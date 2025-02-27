import { Logger } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { User } from 'src/user/entity/user.entity';
import { MessageService } from './message.service';
import { RedisService } from 'src/redis/redis.service';
import { ChannelService } from 'src/channel/channel.service';
import { JwtService } from '@nestjs/jwt';

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
  pingTimeout: 10000,
})
export class MessageGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() public server: Server

  private readonly logger: Logger = new Logger('MessageGateway');

  constructor(
    private readonly messageService: MessageService,
    private readonly redisService: RedisService,
    private readonly channelService: ChannelService,
    private readonly jwtService: JwtService
  ) {}

  async handleConnection(client: UserSocket): Promise<void> {
    try {
      const user = await this.messageService.getUserFromSocket(client);
      client.user = user;

      client.join(client.user.id);
  
      await this.redisService.setUserOnline(user.id, client.id)
      this.server.emit('user:status', { userId: user.id, status: 'online' });
  
      this.logger.log(`Connection established: ${user.id}`);
  
      const onlineUsers = await this.redisService.getAllOnlineUsers();
      this.server.emit('users:online', onlineUsers);
    } catch (error) {
      client.emit('refresh_token_required');
      this.logger.error(`Connection error: ${error.message}`);
    }
  }

  async handleDisconnect(client: UserSocket): Promise<void> {
    try {
      if (client.user && client.user.id) {
          await this.redisService.setUserOffline(client.user.id);
          this.server.emit('user:status', { userId: client.user.id, status: 'offline' });

          const onlineUsers = await this.redisService.getAllOnlineUsers();
          this.server.emit('users:online', onlineUsers);

          this.logger.log(`User ${client.user.id} disconnected and set offline.`);
      } else {
          this.logger.warn('Client disconnected without a valid user object.');
      }
    } catch (err) {
        this.logger.error(`Error during disconnection: ${err.message}`);
    } finally {
        client.disconnect(true);
    }
  }

  @SubscribeMessage('channel:create')
  public async onChannelCreate(
      @ConnectedSocket() socket: UserSocket,
      @MessageBody() data: { name: string }
  ) {
      try {
        if (!data.name) {
            throw new WsException('Channel name is required');
        }
        const createdChannel = await this.channelService.createChannel(data.name, socket.user)
        socket.join(createdChannel.id)
        for (const user of createdChannel.members) {
            const channels = await this.channelService.getUserChannels(user.id)
            this.server.to(socket.id).emit('channel:all', channels)
        }
        this.server.to(socket.id).emit('channel:created', createdChannel);
      } catch (err) {
          this.server.to(socket.id).emit('error:channel-create', err)
          throw new WsException(err)
      }
  }

  @SubscribeMessage('channel:delete')
  public async onChannelDelete(
      @ConnectedSocket() socket: UserSocket,
      @MessageBody() data: { channelId: string }
  ) {
      try {
        const channel = await this.channelService.getChannel(data.channelId)
        if(socket.user.id !== channel.createdBy.id) {
          console.log(data.channelId)
          throw new Error("You are not owner of this channel")
        }
        console.log(data.channelId)
        await this.channelService.deleteChannel(data.channelId)
        console.log(data.channelId)
        const channels = await this.channelService.getUserChannels(socket.user.id)
        this.server.to(socket.id).emit('channel:all', channels)
      } catch (err) {
          this.server.to(socket.id).emit('error:channel-create', err)
          throw new WsException(err)
      }
  }

  @SubscribeMessage('channel:join')
  public async onChannelJoin(
    @ConnectedSocket() socket: UserSocket,
    @MessageBody() data: { channelId: string }
  ) {
      try {
          const { channelId } = data
          socket.join(channelId)
          const messages = await this.channelService.findMessagesForChannel(channelId)
          this.server.to(socket.id).emit('channel:messages', messages)
      } catch (err) {
          throw new WsException(err)
      }
  }

  @SubscribeMessage('sendMessageChannel')
  async handleMessageChannel(
    @MessageBody() data: { channelId: string; content: string },
    @ConnectedSocket() client: UserSocket,
  ) {
    const { channelId, content } = data;
    const message = await this.channelService.sendChannelMessage(channelId, client.user.id, content);

    this.server.to(channelId).emit('receiveChannelMessage', message);
  }

  @SubscribeMessage('addMemberToChannel')
  async handleAddMemberToChannel(
      @MessageBody() data: { channelId: string; userIds: string[] },
      @ConnectedSocket() client: UserSocket,
  ) {
      const { channelId, userIds } = data;
  
      try {
          const updatedChannel = await this.channelService.addMember(channelId, userIds);
  
          // Notify all members of the channel about the update
          this.server.to(channelId).emit('memberAdded', {
              channelId,
              members: updatedChannel.members.map((member) => ({
                  id: member.id,
                  username: member.username,
              })),
          });
  
          console.log(`Added ${userIds.length} users to channel ${channelId}`);
      } catch (error) {
        console.error('Error adding members to channel:', error.message);
        client.emit('error', { message: error.message });
      }
  }

  @SubscribeMessage('removeMemberToChannel')
  async handleRemoveMemberToChannel(
      @MessageBody() data: { channelId: string; userId: string },
      @ConnectedSocket() client: UserSocket,
  ) {
      const { channelId, userId } = data;
  
      try {
          const updatedChannel = await this.channelService.removeUsersFromChannel(channelId, userId);

          this.server.to(channelId).emit('memberRemoved', {
              channelId,
              members: updatedChannel.members.map((member) => ({
                  id: member.id,
                  username: member.username,
              })),
          });
  
          console.log(`Removed ${userId.length} users to channel ${channelId}`);
      } catch (error) {
        console.error('Error removing members to channel:', error.message);
        client.emit('error', { message: error.message });
      }
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() data: { receiverId: string; content: string },
    @ConnectedSocket() client: UserSocket,
  ) {
    const { receiverId, content } = data;
    const message = await this.messageService.sendMessage(client.user.id, receiverId, content);

    client.emit('receiveMessage', message);
    this.server.to(receiverId).emit('receiveMessage', message);
  }

  @SubscribeMessage('conversation:join')
  public async onConversationJoin(
      @ConnectedSocket() socket: UserSocket,
      @MessageBody() data: { otherUserId: string }
  ) {
      try {
          const { otherUserId } = data
          const messages = await this.messageService.findMessagesForConversation(otherUserId, socket.user.id)
          this.server.to(socket.id).emit('conversation:messages', messages)
      } catch (err) {
          throw new WsException(err)
      }
  }

  @SubscribeMessage('getUserData')
  async handleGetUserData(@ConnectedSocket() client: UserSocket) {
    const userId = client.user.id;

    if(userId) {
      const conversations = await this.messageService.getUserConversations(userId);
      const channels = await this.channelService.getUserChannels(userId);

      client.join(channels.map(channel => channel.id));
      client.join(conversations.map(conversation => conversation.id));

      client.join(client.user.id);

      client.emit('userData', { channels, conversations });
    }
  }

  @SubscribeMessage('refresh_token_success')
  handleRefreshTokenSuccess(client: Socket, data: { newAccessToken: string }) {
    try {
      const payload = this.jwtService.verify(data.newAccessToken);
      client.data.userId = payload.sub;
    } catch (error) {
      client.disconnect();
    }
  }
}
