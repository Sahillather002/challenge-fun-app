import { Injectable } from '@nestjs/common';
import { CacheService } from '../cache/cache.service';
import {
  Leaderboard,
  LeaderboardEntry,
  Prize,
  PrizeDistribution,
} from '../../types/interfaces';
import { ScoreUpdateRequestDto } from '../../types/dto';

@Injectable()
export class LeaderboardService {
  constructor(private readonly cacheService: CacheService) {}

  async getLeaderboard(
    competitionId: string,
    limit: number = 100,
  ): Promise<Leaderboard> {
    const key = `leaderboard:${competitionId}`;

    const entries = await this.cacheService.zrevrangeWithScores(
      key,
      0,
      limit - 1,
    );

    const leaderboardEntries: LeaderboardEntry[] = [];

    for (let i = 0; i < entries.length; i++) {
      const { member: userId, score } = entries[i];

      const userDetails = await this.getUserDetails(competitionId, userId);

      const entry: LeaderboardEntry = {
        user_id: userId,
        user_name: userDetails?.user_name || 'Unknown',
        competition_id: competitionId,
        score: Math.floor(score),
        rank: i + 1,
        steps: userDetails?.steps || 0,
        distance: userDetails?.distance || 0,
        calories: userDetails?.calories || 0,
        last_synced_at: userDetails?.last_synced_at || new Date(),
        updated_at: new Date(),
      };

      leaderboardEntries.push(entry);
    }

    const totalCount = await this.cacheService.zcard(key);

    return {
      competition_id: competitionId,
      entries: leaderboardEntries,
      total_count: totalCount,
      updated_at: new Date(),
    };
  }

  async updateScore(req: ScoreUpdateRequestDto): Promise<void> {
    const key = `leaderboard:${req.competition_id}`;
    const score = req.steps;

    await this.cacheService.zadd(key, score, req.user_id);

    // Store detailed user data
    const userDetailsKey = `user_details:${req.competition_id}:${req.user_id}`;
    const userDetails = {
      user_id: req.user_id,
      competition_id: req.competition_id,
      score,
      steps: req.steps,
      distance: req.distance,
      calories: req.calories,
      last_synced_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await this.cacheService.set(userDetailsKey, userDetails, 86400);

    // Publish update
    await this.publishLeaderboardUpdate(req.competition_id, req.user_id, score);
  }

  async calculatePrizes(
    competitionId: string,
    prizePool: number,
  ): Promise<Prize[]> {
    const leaderboard = await this.getLeaderboard(competitionId, 3);

    if (leaderboard.entries.length === 0) {
      throw new Error('No participants in competition');
    }

    const distribution: PrizeDistribution = {
      rank_1_percentage: 0.6,
      rank_2_percentage: 0.3,
      rank_3_percentage: 0.1,
    };

    const prizes: Prize[] = [];

    if (leaderboard.entries.length > 0) {
      prizes.push({
        id: `prize-${competitionId}-1`,
        competition_id: competitionId,
        user_id: leaderboard.entries[0].user_id,
        rank: 1,
        amount: prizePool * distribution.rank_1_percentage,
        status: 'pending',
        created_at: new Date(),
      });
    }

    if (leaderboard.entries.length > 1) {
      prizes.push({
        id: `prize-${competitionId}-2`,
        competition_id: competitionId,
        user_id: leaderboard.entries[1].user_id,
        rank: 2,
        amount: prizePool * distribution.rank_2_percentage,
        status: 'pending',
        created_at: new Date(),
      });
    }

    if (leaderboard.entries.length > 2) {
      prizes.push({
        id: `prize-${competitionId}-3`,
        competition_id: competitionId,
        user_id: leaderboard.entries[2].user_id,
        rank: 3,
        amount: prizePool * distribution.rank_3_percentage,
        status: 'pending',
        created_at: new Date(),
      });
    }

    // Cache prizes
    const prizesKey = `prizes:${competitionId}`;
    await this.cacheService.set(prizesKey, prizes, 604800);

    return prizes;
  }

  private async getUserDetails(
    competitionId: string,
    userId: string,
  ): Promise<any> {
    const key = `user_details:${competitionId}:${userId}`;
    return await this.cacheService.get(key);
  }

  private async publishLeaderboardUpdate(
    competitionId: string,
    userId: string,
    score: number,
  ): Promise<void> {
    const channel = `leaderboard:${competitionId}`;
    const message = {
      type: 'score_update',
      competition_id: competitionId,
      user_id: userId,
      score,
      timestamp: new Date().toISOString(),
    };
    await this.cacheService.publish(channel, message);
  }
}
