import { Controller, Get, Post, Delete, Param, UseGuards, Request } from '@nestjs/common';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import { FriendService } from './friend.service';

@Controller('friends')
@UseGuards(SupabaseAuthGuard)
export class FriendController {
    constructor(private friendService: FriendService) { }

    @Get()
    getFriends(@Request() req) {
        return this.friendService.getFriends(req.user.id);
    }

    @Post('add/:friendId')
    addFriend(@Request() req, @Param('friendId') friendId: string) {
        return this.friendService.addFriend(req.user.id, friendId);
    }

    @Post('accept/:friendshipId')
    acceptFriend(@Request() req, @Param('friendshipId') friendshipId: string) {
        return this.friendService.acceptFriend(friendshipId);
    }

    @Delete(':friendshipId')
    removeFriend(@Param('friendshipId') friendshipId: string) {
        return this.friendService.removeFriend(friendshipId);
    }
}
