import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common"
import { ChannelService } from "../channel.service"

@Injectable()
export class MembershipGuard implements CanActivate {
    constructor(
        private readonly channelService: ChannelService
    ) {}
    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
        const request = context.switchToHttp().getRequest()
        const channelId = request.params.id || request.params.channelId
        const user = request.user
        const channel = await this.channelService.getChannel(channelId)
        const member = channel.members.includes(user.sub)
        if(!member) {
            throw new ForbiddenException(`You aren't member of this channel`)
        }

        return member
    }
}