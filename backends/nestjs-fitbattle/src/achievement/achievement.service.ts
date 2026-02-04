import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AchievementService {
    constructor(private prisma: PrismaService) { }

    async getAllAchievements() {
        return this.prisma.achievement.findMany();
    }

    async getUserAchievements(userId: string) {
        return this.prisma.userAchievement.findMany({
            where: { userId },
            include: {
                achievement: true,
            },
            orderBy: { unlockedAt: 'desc' },
        });
    }

    async unlockAchievement(userId: string, achievementKey: string) {
        const achievement = await this.prisma.achievement.findUnique({
            where: { key: achievementKey },
        });

        if (!achievement) return;

        // Check if already unlocked
        const existing = await this.prisma.userAchievement.findUnique({
            where: {
                userId_achievementId: {
                    userId,
                    achievementId: achievement.id,
                },
            },
        });

        if (existing) return;

        // Unlock and reward
        await this.prisma.userAchievement.create({
            data: {
                userId,
                achievementId: achievement.id,
            },
        });

        await this.prisma.user.update({
            where: { id: userId },
            data: {
                xp: { increment: achievement.xpReward },
                coins: { increment: achievement.coinReward },
            },
        });

        return achievement;
    }
}
