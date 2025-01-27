import { Logger } from '@nestjs/common';
import { ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { User } from 'src/user/entity/user.entity';
import { MessageService } from './message.service';
import { RedisService } from 'src/redis/redis.service';
import { UserService } from 'src/user/user.service';
import { ChannelService } from 'src/channel/channel.service';

interface UserSocket extends Socket {
  user: User,
  userStatus: string
}

@WebSocketGateway(3005, {
  cors: {
    origin: true,
    credentials: true
  },
  pingInterval: 25000,
  pingTimeout: 1000
})
export class MessageGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() public server: Server

  private readonly logger: Logger = new Logger('MessageGateway');

  constructor(
    private readonly messageService: MessageService,
    private readonly redisService: RedisService,
    private readonly userService: UserService,
    private readonly channelService: ChannelService
  ) {}

  async handleConnection(client: UserSocket): Promise<void> {
    const user = await this.messageService.getUserFromSocket(client);
    client.user = user;

    await this.redisService.setUserOnline(user.id, client.id)
    this.server.emit('user:status', { userId: user.id, status: 'online' });

    this.logger.log(`Connection established: ${user.id}`);

    const onlineUsers = await this.redisService.getAllOnlineUsers();
    this.server.emit('users:online', onlineUsers);
  }

  async handleDisconnect(client: UserSocket): Promise<void> {
    if(client.user && client.user.id) {
      await this.redisService.setUserOffline(client.user.id);
      this.server.emit('user:status', { userId: client.user.id, status: 'offline' });

      this.logger.warn(`Connection established: ${client.user.id}`);

      const onlineUsers = await this.redisService.getAllOnlineUsers();
      this.server.emit('users:online', onlineUsers);
    }
  }

  @SubscribeMessage('getUserData')
  async handleGetUserData(@ConnectedSocket() client: UserSocket) {
    const userId = client.user.id;

    if(userId) {
      const conversations = await this.messageService.getUserConversations(userId);
      const channels = await this.channelService.getUserChannels(userId);

      client.emit('userData', { channels, conversations });
    }
  }
}
