import { Injectable, ExecutionContext, UnauthorizedException, CanActivate } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
    constructor(
        private supabaseService: SupabaseService,
        private prismaService: PrismaService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedException('No token provided');
        }

        const token = authHeader.substring(7);

        try {
            const supabaseUser = await this.supabaseService.verifyToken(token);

            if (!supabaseUser || !supabaseUser.email) {
                throw new UnauthorizedException('Invalid user data from Supabase');
            }

            // Get or create user profile
            let user = await this.prismaService.user.findUnique({
                where: { id: supabaseUser.id },
            });

            if (!user) {
                try {
                    // Auto-create user profile on first login
                    user = await this.prismaService.user.create({
                        data: {
                            id: supabaseUser.id,
                            email: supabaseUser.email,
                            username: supabaseUser.user_metadata?.username || supabaseUser.email.split('@')[0],
                            name: supabaseUser.user_metadata?.name || 'User',
                            updatedAt: new Date(),
                        },
                    });
                } catch (createError) {
                    // If creation fails with unique constraint (race condition), try fetching again
                    if (createError.code === 'P2002') {
                        user = await this.prismaService.user.findUnique({
                            where: { id: supabaseUser.id },
                        });
                    } else {
                        throw createError;
                    }
                }
            }

            request.user = user;
            return true;
        } catch (error) {
            console.error('SupabaseAuthGuard Error:', error.message);
            throw new UnauthorizedException('Invalid token');
        }
    }
}
