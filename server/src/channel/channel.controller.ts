import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { AccessTokenGuard } from 'src/auth/common/guards';
import { OwnershipGuard } from './guards/Ownership.guard';
import { GetCurrentUser } from 'src/auth/common/decorators/get-current-user';
import { UserService } from 'src/user/user.service';

@Controller('channel')
export class ChannelController {
    constructor(
        private readonly channelService: ChannelService,
        private readonly userService: UserService
    ) {}

    @UseGuards(AccessTokenGuard)
    @Get()
    async getChannelsForUser(@GetCurrentUser() user) {
        return this.channelService.getUserChannels(user.sub);
    }
    
    @UseGuards(AccessTokenGuard)
    @Post()
    async createChannel(@GetCurrentUser() userData, @Body() body) {
        const user = await this.userService.getUserByField('id', userData.sub)
        const { name } = body;
        return this.channelService.createChannel(name, user);
    }

    @UseGuards(AccessTokenGuard, OwnershipGuard)
    @Patch(':id')
    async updateChannel(@Param('id') channelId: string, @Body('name') name: string) {
        return this.channelService.updateChannel(channelId, name);
    }

    @UseGuards(AccessTokenGuard, OwnershipGuard)
    @Delete(':id')
    async deleteChannel(@Param('id') channelId: string) {
        return this.channelService.deleteChannel(channelId);
    }

    @UseGuards(AccessTokenGuard, OwnershipGuard)
    @Post(':id/users')
    async addUsersToChannel(
        @Param('id') channelId: string,
        @Body('userIds') userIds: string[]
    ) {
        return this.channelService.addMember(channelId, userIds);
    }

    @UseGuards(AccessTokenGuard, OwnershipGuard)
    @Delete(':id/users')
    async removeUsersFromChannel(
        @Param('id') channelId: string,
        @Body('userIds') userIds: string[]
    ) {
        return this.channelService.removeUsersFromChannel(channelId, userIds);
    }
}
