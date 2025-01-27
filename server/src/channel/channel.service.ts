import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from './entity/channel.entity';
import { Repository } from 'typeorm';
import { ChannelMessage } from 'src/channel/entity/channelMessage.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ChannelService {
    constructor(
        @InjectRepository(Channel) private readonly channelRepository: Repository<Channel>,
        @InjectRepository(ChannelMessage) private readonly channelMessageRepository: Repository<ChannelMessage>,
        private readonly userService: UserService
    ) {}

    async createChannel(name: string, createdById: string): Promise<Channel> {
        const channel = this.channelRepository.create({
            name,
            createdBy: { id: createdById }
        });

        return this.channelRepository.save(channel);
    }

    async addMember(channelId: string, userId: string){
        const channel = await this.channelRepository.findOne({
            where: { id: channelId },
            relations: ['members']
        });

        if(!channel) throw new Error('Channel not found');

        const user = await this.userService.getUserByField('id', userId);

        if(!user) throw new Error('User not found');

        const isUserInChannel = channel.members.some(channelUser => channelUser.id === userId);

        if(isUserInChannel) {
            return {
                success: false,
                message: 'User is already in channel'
            }
        }

        try {
            await this.channelRepository
            .createQueryBuilder()
            .relation(Channel, 'members')
            .of(channel)
            .add(user)

            return {
                success: true,
                message: 'User added to channel'
            }
        } catch (error) {
            return {
                success: false,
                message: 'Failed to add user to channel',
                error: error.message
            };
        }
    }

    async sendChannelMessage(channelId: string, senderId: string, content: string): Promise<ChannelMessage> {
        const channelMessage = this.channelMessageRepository.create({
            channel: { id: channelId },
            sender: { id: senderId },
            content
        });

        return this.channelMessageRepository.save(channelMessage);
    }

    async getUserChannels(userId: string): Promise<Channel[]> {
        const user = this.userService.getUserByField('id', userId);
        if(user) throw new Error('User not found');

        const channels = this.channelRepository.find({
            relations: ["members"],
            where: { members: {
                id: userId
            } }
        })

        return channels;
    }
}
