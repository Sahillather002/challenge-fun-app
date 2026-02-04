import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { SupabaseModule } from './supabase/supabase.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { WorkoutModule } from './workout/workout.module';
import { StreakModule } from './streak/streak.module';
import { CompetitionModule } from './competition/competition.module';
import { FriendModule } from './friend/friend.module';
import { AchievementModule } from './achievement/achievement.module';
import { SnapModule } from './snap/snap.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    SupabaseModule,
    AuthModule,
    UserModule,
    WorkoutModule,
    StreakModule,
    CompetitionModule,
    FriendModule,
    AchievementModule,
    SnapModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
