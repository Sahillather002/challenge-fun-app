// User types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
}

// Competition types
export interface Competition {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  entryFee: number;
  prizePool: number;
  participantCount: number;
  status: 'upcoming' | 'active' | 'completed';
  type: 'steps' | 'distance' | 'calories' | 'mixed';
}

// Activity types
export interface Activity {
  id: string;
  userId: string;
  competitionId?: string;
  steps: number;
  distance: number;
  calories: number;
  activeMinutes: number;
  date: Date;
}

// Leaderboard types
export interface LeaderboardEntry {
  rank: number;
  userId: string;
  userName: string;
  avatar?: string;
  score: number;
  steps?: number;
  distance?: number;
  calories?: number;
}

// Transaction types
export interface Transaction {
  id: string;
  userId: string;
  type: 'entry_fee' | 'prize' | 'refund';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  competitionId?: string;
  createdAt: Date;
}
