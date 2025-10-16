export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  profileImage?: string;
  company: string;
  department: string;
  totalSteps: number;
  competitions_won: number; // Changed from competitionsWon to match database schema
  joined_date: Date; // Changed from joinedDate to match database schema
  role: 'user' | 'admin';
}

export interface Competition {
  id: string;
  name: string;
  description: string;
  type: 'weekly' | 'monthly';
  entry_fee: number;
  prize_pool: number;
  start_date: string;
  end_date: string;
  participants: string[];
  status: 'upcoming' | 'active' | 'completed';
  created_by: string;
  rules: string[];
  prizes: {
    first: number;
    second: number;
    third: number;
  };
  created_at: string;
  updated_at: string;
}

export interface StepData {
  user_id: string;
  competition_id: string;
  date: string;
  steps: number;
  timestamp: Date;
  created_at: Date;
}

export interface LeaderboardEntry {
  userId: string;
  userName: string;
  avatar?: string;
  totalSteps: number;
  rank: number;
  prize?: number;
}

export interface Payment {
  id: string;
  user_id: string;
  competition_id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  timestamp: Date;
  payment_method: string;
  created_at: Date;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
}

export interface Reward {
  id: string;
  user_id: string;
  competition_id: string;
  position: 1 | 2 | 3;
  amount: number;
  claimed: boolean;
  claimed_date?: Date;
  created_at: Date;
}