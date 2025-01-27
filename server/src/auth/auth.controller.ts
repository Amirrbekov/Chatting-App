import { Body, Request as RequestCommon, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { UserService } from 'src/user/user.service';
import { LoginDto } from 'src/user/dto/login.dto';
import { RegisterDto } from 'src/user/dto/register.dto';
import { GetCurrentUser } from './common/decorators/get-current-user';
import { AccessTokenGuard, RefreshTokenGuard } from './common/guards';
import { Public } from './common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
    ) {}

    @Public()
    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() body: LoginDto, @Res({ passthrough: true }) res: Response) {
        const response = await this.authService.login(body)

        res.cookie('refreshToken', response.tokens.refresh_token, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return {
            message: 'Login successful',
            access_token: response.tokens.access_token,
        };
    }

    @Public()
    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    async register(@Body() body: RegisterDto, @Res({ passthrough: true }) res: Response) {
        const response = await this.authService.register(body)

        res.cookie('refreshToken', response.tokens.refresh_token, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return {
            message: "User registered successfully",
            access_token: response.tokens.access_token
        };
    }

    @UseGuards(AccessTokenGuard)
    @Post('logout')
    @HttpCode(HttpStatus.OK)
    async logout(@GetCurrentUser() user) {
        const jti = user.jti;
        const exp = user.exp - Math.floor(Date.now() / 1000);
        await this.authService.blacklistToken(jti, exp)
        await this.authService.logout(user.sub)
        return {
        message: "Logged out successfully"
        };
    }

    @Public()
    @UseGuards(RefreshTokenGuard)
    @Get('refresh')
    @HttpCode(HttpStatus.OK)
    async refreshTokens(@GetCurrentUser() user, @Req() req: Request) {
        if(!user) throw new UnauthorizedException('Invalid user or refresh token');
        
        const refreshToken = req.cookies['refreshToken'];
        
        if (!refreshToken) {
        return {
            message: 'No refresh token provided', status: 401
        }
        }
        return this.authService.refreshToken(user.sub, refreshToken);
    }

    @UseGuards(AccessTokenGuard)
    @Get('profile')
    @HttpCode(HttpStatus.OK)
    getProfile(@RequestCommon() req) {
        return this.userService.getUserByField('id', req.user.sub);
    }
}
