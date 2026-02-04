import { Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import { StreakService } from './streak.service';

@Controller('streak')
@UseGuards(SupabaseAuthGuard)
export class StreakController {
    constructor(private streakService: StreakService) { }

    @Get()
    getStreak(@Request() req) {
        return this.streakService.getStreak(req.user.id);
    }

    @Post('checkin')
    checkIn(@Request() req) {
        return this.streakService.checkIn(req.user.id);
    }

    @Post('freeze')
    useFreeze(@Request() req) {
        return this.streakService.useFreeze(req.user.id);
    }
}
