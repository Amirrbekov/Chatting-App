import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthService } from "../auth.service";



type JwtPayload = { sub: string; email: string; jti: string };

@Injectable()
export class AccessStrategy extends PassportStrategy(Strategy, 'access-token') {
    constructor(
        private configService: ConfigService,
        private readonly authService: AuthService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JwtSecretoOrKey'),
        })
    }

    async validate(payload: JwtPayload) {
        const isBlacklisted = await this.authService.isTokenBlacklisted(payload.jti)
        if(isBlacklisted) throw new Error('Token is invalid');
        return payload;
    }
}