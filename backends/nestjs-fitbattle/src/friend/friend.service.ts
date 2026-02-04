import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FriendshipStatus } from '@prisma/client';

@Injectable()
export class FriendService {
    constructor(private prisma: PrismaService) { }

    async getFriends(userId: string) {
        const friendships = await this.prisma.friendship.findMany({
            where: {
                OR: [
                    { userId, status: FriendshipStatus.ACCEPTED },
                    { friendId: userId, status: FriendshipStatus.ACCEPTED },
                ],
            },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        name: true,
                        avatar: true,
                        level: true,
                        currentStreak: true,
                    },
                },
                friend: {
                    select: {
                        id: true,
                        username: true,
                        name: true,
                        avatar: true,
                        level: true,
                        currentStreak: true,
                    },
                },
            },
        });

        return friendships.map((f) => ({
            ...f,
            friendData: f.userId === userId ? f.friend : f.user,
        }));
    }

    async addFriend(userId: string, friendId: string) {
        if (userId === friendId) {
            throw new BadRequestException('Cannot add yourself as a friend');
        }

        const existing = await this.prisma.friendship.findFirst({
            where: {
                OR: [
                    { userId, friendId },
                    { userId: friendId, friendId: userId },
                ],
            },
        });

        if (existing) {
            throw new BadRequestException('Friend request already exists');
        }

        return this.prisma.friendship.create({
            data: {
                userId,
                friendId,
                status: FriendshipStatus.PENDING,
            },
        });
    }

    async acceptFriend(friendshipId: string) {
        return this.prisma.friendship.update({
            where: { id: friendshipId },
            data: { status: FriendshipStatus.ACCEPTED },
        });
    }

    async removeFriend(friendshipId: string) {
        return this.prisma.friendship.delete({
            where: { id: friendshipId },
        });
    }
}
