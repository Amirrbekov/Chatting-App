import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entity/message.entity';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { MessageGateway } from './message.gateway';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { RedisModule } from 'src/redis/redis.module';
import { ChannelModule } from 'src/channel/channel.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Message]),
        UserModule,
        JwtModule,
        RedisModule,
        ChannelModule
    ],
    controllers: [MessageController],
    providers: [MessageService, MessageGateway],
    exports: [MessageService, TypeOrmModule.forFeature([Message])],
})
export class MessageModule {}
