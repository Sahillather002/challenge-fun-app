import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWorkoutDto } from './dto/workout.dto';

@Injectable()
export class WorkoutService {
    constructor(private prisma: PrismaService) { }

    async createWorkout(userId: string, createWorkoutDto: CreateWorkoutDto) {
        const { exerciseType, reps, duration, calories, competitionId } = createWorkoutDto;

        // Calculate XP and coins based on workout
        const xpEarned = this.calculateXP(reps ?? 0, duration ?? 0);
        const coinsEarned = Math.floor(xpEarned / 10);

        // Get current user data
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new Error('User not found');

        // Calculate streak
        let newStreak = user.currentStreak;
        const today = new Date();
        const lastWorkoutDate = user.lastWorkout ? new Date(user.lastWorkout) : null;

        if (lastWorkoutDate) {
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);

            const isYesterday = lastWorkoutDate.getFullYear() === yesterday.getFullYear() &&
                lastWorkoutDate.getMonth() === yesterday.getMonth() &&
                lastWorkoutDate.getDate() === yesterday.getDate();

            const isToday = lastWorkoutDate.getFullYear() === today.getFullYear() &&
                lastWorkoutDate.getMonth() === today.getMonth() &&
                lastWorkoutDate.getDate() === today.getDate();

            if (isYesterday) {
                newStreak += 1;
            } else if (!isToday) {
                newStreak = 1;
            }
        } else {
            newStreak = 1;
        }

        const longestStreak = Math.max(newStreak, user.longestStreak);

        const workout = await this.prisma.workout.create({
            data: {
                userId,
                exerciseType,
                reps,
                duration,
                calories,
                competitionId,
                xpEarned,
                coinsEarned,
            },
        });

        // Update user stats
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                xp: { increment: xpEarned },
                coins: { increment: coinsEarned },
                lastWorkout: new Date(),
                currentStreak: newStreak,
                longestStreak: longestStreak,
            },
        });

        return workout;
    }

    async getWorkouts(userId: string) {
        return this.prisma.workout.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 20,
        });
    }

    async getWorkoutHistory(userId: string) {
        const workouts = await this.prisma.workout.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });

        const totalWorkouts = workouts.length;
        const totalXP = workouts.reduce((sum, w) => sum + w.xpEarned, 0);
        const totalCoins = workouts.reduce((sum, w) => sum + w.coinsEarned, 0);

        return {
            workouts,
            stats: {
                totalWorkouts,
                totalXP,
                totalCoins,
            },
        };
    }

    private calculateXP(reps: number, duration: number): number {
        let xp = 0;
        if (reps) xp += reps * 2;
        if (duration) xp += Math.floor(duration / 10);
        return Math.max(xp, 10); // Minimum 10 XP
    }
}
