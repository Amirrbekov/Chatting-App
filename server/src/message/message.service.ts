import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entity/message.entity';
import { Repository } from 'typeorm';
import { Socket } from 'socket.io';
import { User } from 'src/user/entity/user.entity';
import { WsException } from '@nestjs/websockets';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { ChannelService } from 'src/channel/channel.service';

@Injectable()
export class MessageService {
    constructor(
        @InjectRepository(Message)
        private messageRepository: Repository<Message>,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
        private readonly channelService: ChannelService,
    ) {}

    async getMessages(userId: string): Promise<Message[]> {
        return this.messageRepository.find({
          where: [{ sender: { id: userId } }, { receiver: { id: userId } }],
          relations: ['sender', 'receiver'],
        });
    }

    async getUserFromSocket(client: Socket): Promise<User> {
        try {
            const token = client.handshake.auth?.token || client.handshake.headers?.authorization?.split(' ')[1];
            if(!token) throw new WsException('No token provided');
    
            const jwtSecret = this.configService.get<string>('JwtSecretoOrKey');
    
            const decoded = await this.jwtService.verifyAsync(token, {
                secret: jwtSecret
            })
    
            if(!decoded || !decoded.sub) throw new WsException('Invalid token');
    
            const user = await this.userService.getUserByField('id', decoded.sub);
    
            if(!user) throw new WsException('User not found');
    
            return user;
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw new WsException('Token expired');
              } else if (error.name === 'JsonWebTokenError') {
                throw new WsException('Invalid token');
              } else {
                throw new WsException(error.message || 'Authentication failed');
              }
        }
    }

    async getUserConversations(userId: string) {
        const user = await this.userService.getUserByField('id', userId);
        if (!user) throw new Error('User not found');

        const query = await this.messageRepository
        .createQueryBuilder('message')
        .where("sender.id = :userId", { userId })
        .orWhere("receiver.id = :userId", { userId })
        .leftJoinAndSelect('message.sender', 'sender')
        .leftJoinAndSelect('message.receiver', 'receiver')
        .select([
            'message',
            'sender.id',
            'sender.username',
            'receiver.id',
            'receiver.username',
        ])
        .orderBy('message.timestamp', 'DESC')
        .getMany()

        return query;
    }

    async getMessagesBetweenUsers(user1Id: string, user2Id: string): Promise<Message[]> {
        return this.messageRepository
            .createQueryBuilder('message')
            .where('(message.sender.id = :user1Id AND message.receiver.id = :user2Id)')
            .orWhere('(message.sender.id = :user2Id AND message.receiver.id = :user1Id)')
            .orderBy('message.timestamp', 'ASC')
            .setParameters({ user1Id, user2Id })
            .getMany();
    }

    async sendMessage(senderId: string, receiverId: string, content: string): Promise<Message> {
        const message = this.messageRepository.create({
          sender: { id: senderId },
          receiver: { id: receiverId },
          content,
        });
        return this.messageRepository.save(message);
    }

    async findMessages(channelId?: string, user1Id?: string, user2Id?: string) {
        if (channelId) {
            return this.channelService.findMessagesForChannel(channelId);
        } else if (user1Id && user2Id) {
            // Fetch messages for a direct conversation
            return this.findMessagesForConversation(user1Id, user2Id);
        } else {
            throw new BadRequestException('Either channelId or both user1Id and user2Id must be provided');
        }
    }

    async findMessagesForConversation(user1Id: string, user2Id: string) {
        const messages = await this.messageRepository
            .createQueryBuilder('message')
            .leftJoinAndSelect('message.sender', 'sender')
            .leftJoinAndSelect('message.receiver', 'receiver')
            .where(
                '(message.sender.id = :user1Id AND message.receiver.id = :user2Id) OR (message.sender.id = :user2Id AND message.receiver.id = :user1Id)',
                { user1Id, user2Id }
            )
            .orderBy('message.timestamp', 'ASC')
            .getMany();
        return messages;
    }
}
// create conversation, message, profile, file attach