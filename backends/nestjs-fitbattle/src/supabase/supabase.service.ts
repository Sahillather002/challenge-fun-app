import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SupabaseService {
    private supabase: SupabaseClient;

    constructor(private configService: ConfigService) {
        const url = this.configService.get<string>('SUPABASE_URL');
        const key = this.configService.get<string>('SUPABASE_SERVICE_KEY');

        if (!url || !key) {
            throw new Error('Supabase configuration missing (SUPABASE_URL or SUPABASE_SERVICE_KEY)');
        }

        this.supabase = createClient(url, key);
    }

    getClient(): SupabaseClient {
        return this.supabase;
    }

    async verifyToken(token: string) {
        const { data, error } = await this.supabase.auth.getUser(token);

        if (error || !data.user) {
            throw new Error('Invalid token');
        }

        return data.user;
    }
}
