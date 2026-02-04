import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StreakService {
    constructor(private prisma: PrismaService) { }

    async getStreak(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                currentStreak: true,
                longestStreak: true,
                lastWorkout: true,
                streakFreezes: true,
            },
        });

        if (!user) throw new Error('User not found');

        return {
            currentStreak: user.currentStreak,
            longestStreak: user.longestStreak,
            lastWorkout: user.lastWorkout,
            freezesAvailable: user.streakFreezes,
            hasCheckedInToday: user.lastWorkout ? this.isWorkoutToday(user.lastWorkout) : false,
        };
    }

    async checkIn(userId: string) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new Error('User not found');

        if (user.lastWorkout && this.isWorkoutToday(user.lastWorkout)) {
            throw new BadRequestException('Already checked in today');
        }

        const isYesterday = user.lastWorkout ? this.isWorkoutYesterday(user.lastWorkout) : false;
        const newStreak = isYesterday ? user.currentStreak + 1 : 1;

        const updatedUser = await this.prisma.user.update({
            where: { id: userId },
            data: {
                currentStreak: newStreak,
                longestStreak: Math.max(newStreak, user.longestStreak),
                lastWorkout: new Date(),
            },
        });

        return {
            currentStreak: updatedUser.currentStreak,
            longestStreak: updatedUser.longestStreak,
        };
    }

    async useFreeze(userId: string) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new Error('User not found');

        if (user.streakFreezes <= 0) {
            throw new BadRequestException('No freezes available');
        }

        await this.prisma.user.update({
            where: { id: userId },
            data: {
                streakFreezes: { decrement: 1 },
                lastWorkout: new Date(),
            },
        });

        return { message: 'Streak freeze used successfully' };
    }

    private isWorkoutToday(lastWorkout: Date): boolean {
        if (!lastWorkout) return false;
        const today = new Date();
        const lastDate = new Date(lastWorkout);
        return (
            today.getFullYear() === lastDate.getFullYear() &&
            today.getMonth() === lastDate.getMonth() &&
            today.getDate() === lastDate.getDate()
        );
    }

    private isWorkoutYesterday(lastWorkout: Date): boolean {
        if (!lastWorkout) return false;
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const lastDate = new Date(lastWorkout);
        return (
            yesterday.getFullYear() === lastDate.getFullYear() &&
            yesterday.getMonth() === lastDate.getMonth() &&
            yesterday.getDate() === lastDate.getDate()
        );
    }
}
