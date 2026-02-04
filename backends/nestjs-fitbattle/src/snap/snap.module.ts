import { Module } from '@nestjs/common';
import { SnapService } from './snap.service';
import { SnapController } from './snap.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
    imports: [PrismaModule, SupabaseModule],
    controllers: [SnapController],
    providers: [SnapService],
    exports: [SnapService],
})
export class SnapModule { }
