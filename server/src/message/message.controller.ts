import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { MessageService } from './message.service';
import { AccessTokenGuard } from 'src/auth/common/guards';
import { GetCurrentUser } from 'src/auth/common/decorators/get-current-user';

@UseGuards(AccessTokenGuard)
@Controller('message')
export class MessageController {
    constructor(
        private readonly messageService: MessageService
    ) {}

    @Get()
    async getUserConversations(@GetCurrentUser() user) {
        const userId = user.sub
        return this.messageService.getUserConversations(userId)
    }

    @Post('send')
    async sendMessage(
        @Body('senderId') senderId: string,
        @Body('receiverId') receiverId: string,
        @Body('content') content: string,
    ) {
        return this.messageService.sendMessage(senderId, receiverId, content);
    }

    @Get('between-users')
    async getMessagesBetweenUsers(
        @Query('user1Id') user1Id: string,
        @Query('user2Id') user2Id: string,
    ) {
        return this.messageService.getMessagesBetweenUsers(user1Id, user2Id);
    }
  
    // @Get('chat-list')
    // async getChatList(@Query('userId') userId: string) {
    //   return this.chatService.getChatList(userId);
    // }
}
