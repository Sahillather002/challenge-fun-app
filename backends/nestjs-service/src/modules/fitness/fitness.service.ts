import { Injectable } from '@nestjs/common';
import { CacheService } from '../cache/cache.service';
import { FitnessData } from '../../types/interfaces';
import { FitnessSyncRequestDto } from '../../types/dto';

@Injectable()
export class FitnessService {
  constructor(private readonly cacheService: CacheService) {}

  async syncFitnessData(req: FitnessSyncRequestDto): Promise<void> {
    const date = new Date(req.date);
    const dateStr = date.toISOString().split('T')[0];
    const fitnessKey = `fitness:${req.user_id}:${req.competition_id}:${dateStr}`;

    const fitnessData: FitnessData = {
      id: `${req.user_id}-${req.competition_id}-${date.getTime()}`,
      user_id: req.user_id,
      competition_id: req.competition_id,
      steps: req.steps,
      distance: req.distance,
      calories: req.calories,
      active_minutes: req.active_minutes,
      source: req.source || 'google_fit',
      date: date,
      synced_at: new Date(),
      created_at: new Date(),
    };

    await this.cacheService.set(fitnessKey, fitnessData, 2592000); // 30 days

    // Update aggregated stats
    await this.updateAggregatedStats(
      req.user_id,
      req.competition_id,
      fitnessData,
    );
  }

  async getUserStats(
    userId: string,
    competitionId: string,
  ): Promise<FitnessData> {
    const statsKey = `fitness_stats:${userId}:${competitionId}`;

    const stats = await this.cacheService.get<FitnessData>(statsKey);

    if (!stats) {
      return {
        id: '',
        user_id: userId,
        competition_id: competitionId,
        steps: 0,
        distance: 0,
        calories: 0,
        active_minutes: 0,
        source: '',
        date: new Date(),
        synced_at: new Date(),
        created_at: new Date(),
      };
    }

    return stats;
  }

  private async updateAggregatedStats(
    userId: string,
    competitionId: string,
    newData: FitnessData,
  ): Promise<void> {
    const statsKey = `fitness_stats:${userId}:${competitionId}`;

    let currentStats = await this.cacheService.get<any>(statsKey);

    if (!currentStats) {
      currentStats = {
        id: '',
        user_id: userId,
        competition_id: competitionId,
        steps: 0,
        distance: 0,
        calories: 0,
        active_minutes: 0,
        source: newData.source,
        date: new Date(),
        synced_at: new Date(),
        created_at: new Date(),
      };
    }

    // Update aggregated values
    currentStats.steps += newData.steps;
    currentStats.distance += newData.distance;
    currentStats.calories += newData.calories;
    currentStats.active_minutes += newData.active_minutes;
    currentStats.synced_at = new Date();
    currentStats.source = newData.source;

    await this.cacheService.set(statsKey, currentStats, 2592000); // 30 days
  }
}
