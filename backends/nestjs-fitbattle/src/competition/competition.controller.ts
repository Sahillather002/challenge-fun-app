import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import { CompetitionService } from './competition.service';
import { CreateCompetitionDto } from './dto/competition.dto';

@Controller('competitions')
@UseGuards(SupabaseAuthGuard)
export class CompetitionController {
    constructor(private competitionService: CompetitionService) { }

    @Get()
    getCompetitions() {
        return this.competitionService.getCompetitions();
    }

    @Get(':id')
    getCompetitionById(@Param('id') id: string) {
        return this.competitionService.getCompetitionById(id);
    }

    @Post()
    createCompetition(@Request() req, @Body() createCompetitionDto: CreateCompetitionDto) {
        return this.competitionService.createCompetition(createCompetitionDto);
    }

    @Post(':id/join')
    joinCompetition(@Request() req, @Param('id') id: string) {
        return this.competitionService.joinCompetition(req.user.id, id);
    }

    @Get(':id/leaderboard')
    getLeaderboard(@Param('id') id: string) {
        return this.competitionService.getLeaderboard(id);
    }
}
