import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from 'src/redis/redis.module';
import { User } from 'src/user/entity/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { AccessStrategy, RefreshStrategy } from './strategies';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
              secret: configService.get<string>('JwtSecretoOrKey'),
              signOptions: { expiresIn: '10s' },
            }),
            inject: [ConfigService],
        }),
        RedisModule,
    ],
    controllers: [AuthController],
    providers: [AuthService, UserService, AccessStrategy, RefreshStrategy],
    exports: [JwtModule],
})
export class AuthModule {}
