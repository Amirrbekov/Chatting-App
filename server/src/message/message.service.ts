import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entity/message.entity';
import { Repository } from 'typeorm';
import { Socket } from 'socket.io';
import { User } from 'src/user/entity/user.entity';
import { WsException } from '@nestjs/websockets';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class MessageService {
    constructor(
        @InjectRepository(Message)
        private messageRepository: Repository<Message>,
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
    ) {}
    
    async sendMessage(senderId: string, recieverId: string, content: string) {
        const message = this.messageRepository.create({
            sender: { id: senderId },
            receiver: { id: recieverId },
            content
        });

        return this.messageRepository.save(message)
    }

    async getMessages(userId: string): Promise<Message[]> {
        return this.messageRepository.find({
          where: [{ sender: { id: userId } }, { receiver: { id: userId } }],
          relations: ['sender', 'receiver'],
        });
    }

    async getUserFromSocket(client: Socket): Promise<User> {
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
    }

    async getUserConversations(userId: string): Promise<User[]> {
        const user = await this.userService.getUserByField('id', userId);
        if (user) throw new Error('User not found');

        const sentMessages = await this.messageRepository.find({
            where: { sender: {
                id: userId
            }},
            select: ['receiver'],
        });

        const receivedMessages = await this.messageRepository.find({
            where: { receiver: {
                id: userId
            }},
            select: ['sender'],
        })

        const userIds = [
            ...new Set([
              ...sentMessages.map((message) => message.receiver.id),
              ...receivedMessages.map((message) => message.sender.id),
            ]),
        ];

        return this.usersRepository.findByIds(userIds);
    }
}
