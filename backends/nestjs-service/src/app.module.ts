import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LeaderboardModule } from './modules/leaderboard/leaderboard.module';
import { FitnessModule } from './modules/fitness/fitness.module';
import { CacheModule } from './modules/cache/cache.module';
import { HealthController } from './health.controller';
import { PrizesController } from './modules/leaderboard/leaderboard.controller';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    CacheModule,
    LeaderboardModule,
    FitnessModule,
  ],
  controllers: [HealthController, PrizesController],
})
export class AppModule {}
