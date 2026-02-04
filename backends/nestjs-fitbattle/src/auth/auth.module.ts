import { Module, Global } from '@nestjs/common';
import { SupabaseAuthGuard } from './supabase-auth.guard';
import { PrismaModule } from '../prisma/prisma.module';
import { SupabaseModule } from '../supabase/supabase.module';

@Global()
@Module({
    imports: [PrismaModule, SupabaseModule],
    providers: [SupabaseAuthGuard],
    exports: [SupabaseAuthGuard],
})
export class AuthModule { }
