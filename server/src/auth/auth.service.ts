import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from 'src/user/dto/login.dto';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { UserService } from 'src/user/user.service';
import { AccessToken, Tokens } from './types/tokens.type';
import { RedisService } from 'src/redis/redis.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from 'src/user/dto/register.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly redisService: RedisService,
        private readonly jwtService: JwtService,
    ) {}

    async login(dto: LoginDto): Promise<{ tokens: Tokens }> {
        const user = await this.userService.getUserByField("email", dto.email);

        if(!user) {
            throw new UnauthorizedException("User not found");
        }
        
        const isPasswordValid = await await bcrypt.compare(dto.password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid password');
        }

        const tokens = await this.getTokens(user.id, user.email);

        await this.updateRefreshToken(user.id, tokens.refresh_token);

        return {
            tokens
        }
    }

    async register(dto: RegisterDto): Promise<{ tokens: Tokens }> {
        if (dto.password !== dto.confirmPassword) {
            throw new ConflictException('Passwords do not match');
        }

        const existingUser = await this.userService.getUserByField('email', dto.email);

        if (existingUser) {
            throw new ConflictException('Email already registered');
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);

        const newUser = await this.userService.create({
            username: dto.username,
            email: dto.email,
            password: hashedPassword,
        });

        const tokens = await this.getTokens(newUser.id, newUser.email);

        await this.updateRefreshToken(newUser.id, tokens.refresh_token)

        return {
            tokens
        }
    }

    async logout(userId: string): Promise<void> {
        await this.redisService.del(`refresh_token:${userId}`);
    }

    async refreshToken(userId: string, ownRefreshToken: string): Promise<AccessToken> {
        const user = await this.userService.getUserByField('id', userId);
        if (!user) {
            throw new UnauthorizedException("User doesn't exist");
        }

        const storedRefreshToken = await this.redisService.get(`refresh_token:${userId}`);
        if (!storedRefreshToken || ownRefreshToken !== storedRefreshToken) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        const token = await this.getTokens(user.id, user.email);

        return {
            access_token: token.access_token
        };
    }

    async updateRefreshToken(userId: string, refreshToken: string): Promise<void> {
        await this.redisService.set(`refresh_token:${userId}`, refreshToken, 7 * 24 * 60 * 60);
    }

    private async getTokens(userId: string, email: string): Promise<Tokens> {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(
                {
                    sub: userId,
                    email,
                    jti: uuidv4(),
                },
                {
                    expiresIn: '10s',
                    secret: process.env.JwtSecretoOrKey,
                }
            ),
            uuidv4(),
        ]);

        return {
            access_token: accessToken,
            refresh_token: refreshToken,
        }
    }

    async isTokenBlacklisted(jti: string): Promise<boolean> {
        return await this.redisService.get(`blacklist:${jti}`) === 'true';
    }

    async blacklistToken(jti: string, expiration: number): Promise<void> {
        this.redisService.set(`blacklist:${jti}`, 'true',  expiration);
    }
}
