import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStoryDto, CreateSnapDto } from './dto/snap.dto';
import { SnapStatus } from '@prisma/client';

@Injectable()
export class SnapService {
    constructor(private prisma: PrismaService) { }

    async createStory(userId: string, dto: CreateStoryDto) {
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24); // Stories expire in 24 hours

        return this.prisma.story.create({
            data: {
                userId,
                mediaUrl: dto.mediaUrl,
                mediaType: dto.mediaType,
                caption: dto.caption,
                expiresAt,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        name: true,
                        avatar: true,
                    },
                },
            },
        });
    }

    async getActiveStories(userId: string) {
        // Get stories from user and friends that haven't expired
        const friends = await this.prisma.friendship.findMany({
            where: {
                OR: [
                    { userId, status: 'ACCEPTED' },
                    { friendId: userId, status: 'ACCEPTED' },
                ],
            },
        });

        const friendIds = friends.map((f) => (f.userId === userId ? f.friendId : f.userId));
        const allRelevantIds = [userId, ...friendIds];

        return this.prisma.story.findMany({
            where: {
                userId: { in: allRelevantIds },
                expiresAt: { gt: new Date() },
            },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        name: true,
                        avatar: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async sendSnap(senderId: string, dto: CreateSnapDto) {
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24); // Snaps expire in 24h if not viewed

        return this.prisma.snap.create({
            data: {
                senderId,
                receiverId: dto.receiverId,
                mediaUrl: dto.mediaUrl,
                mediaType: dto.mediaType,
                expiresAt,
            },
        });
    }

    async getMySnaps(userId: string) {
        return this.prisma.snap.findMany({
            where: {
                receiverId: userId,
                status: 'PENDING',
                expiresAt: { gt: new Date() },
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        username: true,
                        name: true,
                        avatar: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async markSnapAsViewed(snapId: string, userId: string) {
        return this.prisma.snap.updateMany({
            where: {
                id: snapId,
                receiverId: userId,
            },
            data: {
                status: 'VIEWED',
            },
        });
    }
}
