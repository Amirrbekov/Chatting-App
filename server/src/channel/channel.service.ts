import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from './entity/channel.entity';
import { Repository } from 'typeorm';
import { ChannelMessage } from 'src/channel/entity/channelMessage.entity';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entity/user.entity';

@Injectable()
export class ChannelService {
    constructor(
        @InjectRepository(Channel) private readonly channelRepository: Repository<Channel>,
        @InjectRepository(ChannelMessage) private readonly channelMessageRepository: Repository<ChannelMessage>,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        private readonly userService: UserService
    ) {}

    async getChannel(channelId: string): Promise<Channel> {
        return this.channelRepository.findOne({
          where: { id: channelId },
          relations: ['members', 'createdBy'],
        });
    }

    async createChannel(name: string, owner: User): Promise<Channel> {
        const channel: Channel = new Channel()
        channel.name = name;
        channel.createdBy = owner;
        channel.members = [owner];
        

        const savedChannel = await this.channelRepository.save(channel)

        return await this.channelRepository.findOne({
            where: { id: savedChannel.id },
            relations: ['members', 'createdBy']
        });
    }

    async updateChannel(channelId: string, name: string): Promise<Channel> {
        const channel = await this.channelRepository.findOne({ where: { id: channelId } });
        if (!channel) throw new Error('Channel not found');
        channel.name = name;
        return this.channelRepository.save(channel);
    }

    async deleteChannel(channelId: string): Promise<void> {
        await this.channelRepository.delete(channelId);
    }

    async addMember(channelId: string, userIds: string[]) {
        const channel = await this.channelRepository.findOne({
            where: { id: channelId },
            relations: ['members', 'createdBy']
        });

        if(!channel) throw new Error('Channel not found');

        const existingUserIds = channel.members.map((member) => member.id);
        const uniqueUserIds = userIds.filter((userId) => !existingUserIds.includes(userId));

        if (uniqueUserIds.length === 0) {
            throw new Error('All users are already in the channel');
        }

        const usersToAdd = await this.userRepository
            .createQueryBuilder('user')
            .where('user.id IN (:...ids)', { ids: uniqueUserIds })
            .getMany();

        if (usersToAdd.length === 0) {
            throw new Error('All users are already in the channel');
        }

        channel.members = [...channel.members, ...usersToAdd];

        const updatedChannel = await this.channelRepository.save(channel);
    
        return updatedChannel;
    }

    async removeUsersFromChannel(channelId: string, userId: string): Promise<Channel> {
        const channel = await this.channelRepository.findOne({
          where: { id: channelId },
          relations: ['members', 'createdBy'],
        });
        if (!channel) throw new Error('Channel not found');
      
        channel.members = channel.members.filter((member) => !userId.includes(member.id));
        return this.channelRepository.save(channel);
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
        if(!user) throw new Error('User not found');

        const channels = this.channelRepository.find({
            relations: ["members", 'createdBy'],
            where: { members: {
                id: userId
            } }
        })

        return channels;
    }

    async findMessagesForChannel(channelId: string) {
        const channel = await this.channelRepository.findOne({
            where: { id: channelId },
            relations: ['messages', 'members'],
        });
    
        if (!channel) {
            throw new NotFoundException(`Channel with ID ${channelId} not found`);
        }
    
        const messages = await this.channelMessageRepository
            .createQueryBuilder('channelMessage')
            .leftJoinAndSelect('channelMessage.sender', 'sender')
            .where('channelMessage.channel.id = :channelId', { channelId })
            .orderBy('channelMessage.timestamp', 'ASC')
            .getMany();
    
        return messages;
    }
}