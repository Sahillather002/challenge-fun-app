import { Module } from '@nestjs/common';
import { StreakService } from './streak.service';
import { StreakController } from './streak.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [StreakController],
    providers: [StreakService],
    exports: [StreakService],
})
export class StreakModule { }
