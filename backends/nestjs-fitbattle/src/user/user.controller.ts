import { Controller, Get, Put, Body, UseGuards, Request, Param } from '@nestjs/common';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import { UserService } from './user.service';
import { UpdateProfileDto } from './dto/user.dto';

@Controller('user')
@UseGuards(SupabaseAuthGuard)
export class UserController {
    constructor(private userService: UserService) { }

    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }

    @Put('profile')
    updateProfile(@Request() req, @Body() updateProfileDto: UpdateProfileDto) {
        return this.userService.updateProfile(req.user.id, updateProfileDto);
    }

    @Get('stats')
    getUserStats(@Request() req: any) {
        return this.userService.getUserStats(req.user.id);
    }

    @Get(':id')
    getUserById(@Param('id') id: string) {
        return this.userService.getUserById(id);
    }
}
