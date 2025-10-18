export interface User {
  id: string;
  email: string;
  name: string;
  created_at: Date;
}

export interface Competition {
  id: string;
  name: string;
  description: string;
  entry_fee: number;
  prize_pool: number;
  start_date: Date;
  end_date: Date;
  status: string;
  type: string;
  created_at: Date;
}

export interface LeaderboardEntry {
  user_id: string;
  user_name: string;
  competition_id: string;
  score: number;
  rank: number;
  steps: number;
  distance: number;
  calories: number;
  last_synced_at: Date;
  updated_at: Date;
}

export interface Leaderboard {
  competition_id: string;
  entries: LeaderboardEntry[];
  total_count: number;
  updated_at: Date;
}

export interface FitnessData {
  id: string;
  user_id: string;
  competition_id: string;
  steps: number;
  distance: number;
  calories: number;
  active_minutes: number;
  source: string;
  date: Date;
  synced_at: Date;
  created_at: Date;
}

export interface Prize {
  id: string;
  competition_id: string;
  user_id: string;
  rank: number;
  amount: number;
  status: string;
  distributed_at?: Date;
  created_at: Date;
}

export interface PrizeDistribution {
  rank_1_percentage: number;
  rank_2_percentage: number;
  rank_3_percentage: number;
}

export interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: Date;
}

export interface SuccessResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface ErrorResponse {
  error: string;
  message: string;
  code: number;
}
