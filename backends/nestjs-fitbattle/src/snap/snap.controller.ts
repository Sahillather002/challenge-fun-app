import { Controller, Get, Post, Body, Param, UseGuards, Request, Put } from '@nestjs/common';
import { SnapService } from './snap.service';
import { CreateStoryDto, CreateSnapDto } from './dto/snap.dto';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';

@Controller('snap')
@UseGuards(SupabaseAuthGuard)
export class SnapController {
    constructor(private readonly snapService: SnapService) { }

    @Post('story')
    createStory(@Request() req: any, @Body() dto: CreateStoryDto) {
        return this.snapService.createStory(req.user.id, dto);
    }

    @Get('stories')
    getStories(@Request() req: any) {
        return this.snapService.getActiveStories(req.user.id);
    }

    @Post('send')
    sendSnap(@Request() req: any, @Body() dto: CreateSnapDto) {
        return this.snapService.sendSnap(req.user.id, dto);
    }

    @Get('inbox')
    getMySnaps(@Request() req: any) {
        return this.snapService.getMySnaps(req.user.id);
    }

    @Put(':id/view')
    markAsViewed(@Request() req: any, @Param('id') id: string) {
        return this.snapService.markSnapAsViewed(id, req.user.id);
    }
}
