import { z } from 'zod';

// --- Shared Enums (matching Prisma) ---
export const CompetitionType = z.enum(['SOLO', 'ONE_V_ONE', 'GROUP', 'GLOBAL']);
export const CompetitionStatus = z.enum(['UPCOMING', 'LIVE', 'COMPLETED']);
export const FriendshipStatus = z.enum(['PENDING', 'ACCEPTED', 'BLOCKED']);
export const SnapStatus = z.enum(['PENDING', 'VIEWED', 'EXPIRED']);

// --- User Domain ---
export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  username: z.string().min(3).max(30),
  name: z.string().min(1),
  avatar: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
  height: z.string().nullable().optional(),
  weight: z.string().nullable().optional(),
  age: z.number().int().nullable().optional(),
  level: z.number().int().default(1),
  xp: z.number().int().default(0),
  coins: z.number().int().default(0),
  currentStreak: z.number().int().default(0),
  longestStreak: z.number().int().default(0),
  createdAt: z.date().or(z.string()),
  updatedAt: z.date().or(z.string()),
});

export type UserProfile = z.infer<typeof UserSchema>;

// --- Workout Domain ---
export const WorkoutSchema = z.object({
  id: z.string(),
  userId: z.string().uuid(),
  exerciseType: z.string(),
  reps: z.number().int().nullable().optional(),
  duration: z.number().int().nullable().optional(), // seconds
  calories: z.number().int().nullable().optional(),
  videoUrl: z.string().url().nullable().optional(),
  verified: z.boolean().default(false),
  xpEarned: z.number().int().default(0),
  coinsEarned: z.number().int().default(0),
  createdAt: z.date().or(z.string()),
});

export type Workout = z.infer<typeof WorkoutSchema>;

// --- Competition Domain ---
export const CompetitionSchema = z.object({
  id: z.string(),
  title: z.string().min(3),
  description: z.string().nullable().optional(),
  type: CompetitionType,
  status: CompetitionStatus,
  startTime: z.date().or(z.string()),
  endTime: z.date().or(z.string()),
  prizePool: z.number().int().nullable().optional(),
  entryFee: z.number().int().nullable().optional(),
});

export type Competition = z.infer<typeof CompetitionSchema>;

// --- Social Domain (Friendships, Snaps, Stories) ---

export const FriendshipSchema = z.object({
  id: z.string(),
  userId: z.string().uuid(),
  friendId: z.string().uuid(),
  status: FriendshipStatus,
  createdAt: z.date().or(z.string()),
});

export type Friendship = z.infer<typeof FriendshipSchema>;

export const StorySchema = z.object({
  id: z.string(),
  userId: z.string().uuid(),
  mediaUrl: z.string().url(),
  mediaType: z.enum(['IMAGE', 'VIDEO']),
  caption: z.string().nullable().optional(),
  expiresAt: z.date().or(z.string()),
  createdAt: z.date().or(z.string()),
});

export type Story = z.infer<typeof StorySchema>;

export const SnapSchema = z.object({
  id: z.string(),
  senderId: z.string().uuid(),
  receiverId: z.string().uuid(),
  mediaUrl: z.string().url(),
  mediaType: z.enum(['IMAGE', 'VIDEO']),
  status: SnapStatus,
  expiresAt: z.date().or(z.string()),
  createdAt: z.date().or(z.string()),
});

export type Snap = z.infer<typeof SnapSchema>;

// --- Auth DTOs ---
export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// --- Analytics & Dashboard ---

export const DailyActivitySchema = z.object({
  date: z.string(),
  steps: z.number().int(),
  calories: z.number().int(),
  distance: z.number(),
});

export type DailyActivity = z.infer<typeof DailyActivitySchema>;

export const TransactionSchema = z.object({
  id: z.string(),
  user_id: z.string().uuid(),
  competition_id: z.string().nullable().optional(),
  type: z.enum(['entry_fee', 'prize', 'refund']),
  amount: z.number(),
  status: z.enum(['pending', 'completed', 'failed']),
  description: z.string(),
  payment_method: z.string(),
  created_at: z.date().or(z.string()),
});

export type Transaction = z.infer<typeof TransactionSchema>;

export const DashboardStatsSchema = z.object({
  total_steps: z.number().int(),
  total_calories: z.number().int(),
  total_distance: z.number(),
  active_competitions: z.number().int(),
  best_rank: z.number().int(),
  steps_change: z.number(),
  calories_change: z.number(),
  weekly_activity: z.array(DailyActivitySchema),
});

export type DashboardStats = z.infer<typeof DashboardStatsSchema>;

export const LeaderboardEntrySchema = z.object({
  user_id: z.string().uuid(),
  user_name: z.string(),
  competition_id: z.string(),
  score: z.number(),
  rank: z.number(),
  steps: z.number(),
  distance: z.number(),
  calories: z.number(),
  last_synced_at: z.date().or(z.string()),
});

export type LeaderboardEntry = z.infer<typeof LeaderboardEntrySchema>;

export const LeaderboardSchema = z.object({
  competition_id: z.string(),
  entries: z.array(LeaderboardEntrySchema),
  total_count: z.number().int(),
  updated_at: z.date().or(z.string()),
});

export type Leaderboard = z.infer<typeof LeaderboardSchema>;
