import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import { WorkoutService } from './workout.service';
import { CreateWorkoutDto } from './dto/workout.dto';

@Controller('workouts')
@UseGuards(SupabaseAuthGuard)
export class WorkoutController {
    constructor(private workoutService: WorkoutService) { }

    @Post()
    createWorkout(@Request() req, @Body() createWorkoutDto: CreateWorkoutDto) {
        return this.workoutService.createWorkout(req.user.id, createWorkoutDto);
    }

    @Get()
    getWorkouts(@Request() req) {
        return this.workoutService.getWorkouts(req.user.id);
    }

    @Get('history')
    getWorkoutHistory(@Request() req) {
        return this.workoutService.getWorkoutHistory(req.user.id);
    }
}
