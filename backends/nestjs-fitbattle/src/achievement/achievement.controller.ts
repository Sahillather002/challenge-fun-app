import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import { AchievementService } from './achievement.service';

@Controller('achievements')
@UseGuards(SupabaseAuthGuard)
export class AchievementController {
    constructor(private achievementService: AchievementService) { }

    @Get()
    getAllAchievements() {
        return this.achievementService.getAllAchievements();
    }

    @Get('me')
    getUserAchievements(@Request() req) {
        return this.achievementService.getUserAchievements(req.user.id);
    }
}
