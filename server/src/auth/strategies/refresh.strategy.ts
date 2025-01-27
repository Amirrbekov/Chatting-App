import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-custom";
import { Request } from "express";
import { RedisService } from "src/redis/redis.service";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh-token') {
    constructor(
        private readonly redisService: RedisService,
        private readonly jwtService: JwtService
    ) {
        super();
    }

    async validate(req: Request): Promise<any> {
        const authorizationHeader = req.get('authorization');

        if(!authorizationHeader) throw new UnauthorizedException('Authorizatipn header is missing');

        try {
            const token = authorizationHeader.replace('Bearer ', '').trim();
            const payload = this.jwtService.decode(token) as any;

            if (!payload || !payload.sub) {
                throw new UnauthorizedException('Invalid access token');
            }

            const refreshToken = await this.redisService.get(`refresh_token:${payload.sub}`);
        
            if (!refreshToken) {
                throw new UnauthorizedException('Refresh token not found');
            }

            return {
                ...payload,
                refreshToken
            };
        } catch (error) {
            throw new UnauthorizedException('Invalid access token');
        }
    }
}