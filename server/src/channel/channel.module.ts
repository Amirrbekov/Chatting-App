import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { Channel } from './entity/channel.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelController } from './channel.controller';
import { UserModule } from 'src/user/user.module';
import { ChannelMessage } from './entity/channelMessage.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([Channel, ChannelMessage]),
    UserModule
  ],
  controllers:[ChannelController],
  providers: [ChannelService],
  exports:[ChannelService]
})
export class ChannelModule {}
