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
}
