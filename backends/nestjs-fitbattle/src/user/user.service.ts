import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/user.dto';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }

    async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
        const { age, ...rest } = updateProfileDto;
        const data: any = { ...rest };

        if (age !== undefined && age !== null) {
            data.age = typeof age === 'string' ? parseInt(age, 10) : age;
        }

        return this.prisma.user.update({
            where: { id: userId },
            data,
        });
    }

    async getUserById(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                username: true,
                email: true,
                name: true,
                avatar: true,
                bio: true,
                height: true,
                weight: true,
                age: true,
                level: true,
                currentStreak: true,
                longestStreak: true,
            },
        });

        return user;
    }

    async getUserStats(userId: string) {
        const [user, workoutCount, competitionCount] = await Promise.all([
            this.prisma.user.findUnique({ where: { id: userId } }),
            this.prisma.workout.count({ where: { userId } }),
            this.prisma.competitionParticipant.count({
                where: { userId, rank: 1 }
            }),
        ]);

        if (!user) {
            throw new Error('User not found');
        }

        return {
            level: user.level,
            xp: user.xp,
            coins: user.coins,
            currentStreak: user.currentStreak,
            longestStreak: user.longestStreak,
            totalWorkouts: workoutCount,
            wins: competitionCount,
        };
    }
}
