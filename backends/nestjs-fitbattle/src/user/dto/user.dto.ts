import { UserSchema } from '@health-competition/shared';
import { z } from 'zod';

/**
 * DTO for updating user profile, derived from the shared Domain Schema.
 * Ensures backend and frontend validation are perfectly synced.
 */
export const UpdateProfileSchema = UserSchema.partial().omit({ 
  id: true, 
  email: true, 
  createdAt: true, 
  updatedAt: true 
});

export type IUpdateProfileDto = z.infer<typeof UpdateProfileSchema>;

/**
 * Class-based DTO to satisfy NestJS decorator metadata requirements.
 * Implements the shared domain type for strict alignment.
 */
export class UpdateProfileDto implements Partial<IUpdateProfileDto> {
  name?: string;
  username?: string;
  avatar?: string | null;
  bio?: string | null;
  height?: string | null;
  weight?: string | null;
  age?: number | null;
}
