import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCompetitionDto } from './dto/competition.dto';
import { CompetitionStatus } from '@prisma/client';

@Injectable()
export class CompetitionService {
    constructor(private prisma: PrismaService) { }

    async getCompetitions() {
        return this.prisma.competition.findMany({
            where: {
                status: { in: [CompetitionStatus.UPCOMING, CompetitionStatus.LIVE] },
            },
            include: {
                _count: {
                    select: { participants: true },
                },
            },
            orderBy: { startTime: 'asc' },
        });
    }

    async getCompetitionById(id: string) {
        return this.prisma.competition.findUnique({
            where: { id },
            include: {
                participants: {
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
                },
            },
        });
    }

    async createCompetition(createCompetitionDto: CreateCompetitionDto) {
        return this.prisma.competition.create({
            data: createCompetitionDto,
        });
    }

    async joinCompetition(userId: string, competitionId: string) {
        const competition = await this.prisma.competition.findUnique({
            where: { id: competitionId },
        });

        if (!competition) {
            throw new BadRequestException('Competition not found');
        }

        if (competition.status === CompetitionStatus.COMPLETED) {
            throw new BadRequestException('Competition has ended');
        }

        // Check if already joined
        const existing = await this.prisma.competitionParticipant.findUnique({
            where: {
                userId_competitionId: {
                    userId,
                    competitionId,
                },
            },
        });

        if (existing) {
            throw new BadRequestException('Already joined this competition');
        }

        // Deduct entry fee if applicable
        if (competition.entryFee) {
            const user = await this.prisma.user.findUnique({ where: { id: userId } });
            if (!user) throw new Error('User not found');

            if (user.coins < competition.entryFee) {
                throw new BadRequestException('Insufficient coins');
            }
            await this.prisma.user.update({
                where: { id: userId },
                data: { coins: { decrement: competition.entryFee } },
            });
        }

        return this.prisma.competitionParticipant.create({
            data: {
                userId,
                competitionId,
            },
        });
    }

    async getLeaderboard(competitionId: string) {
        return this.prisma.competitionParticipant.findMany({
            where: { competitionId },
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
            orderBy: { score: 'desc' },
            take: 100,
        });
    }
}
