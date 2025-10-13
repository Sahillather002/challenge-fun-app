export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  profileImage?: string;
  company: string;
  department: string;
  totalSteps: number;
  competitionsWon: number;
  joinedDate: Date;
}

export interface Competition {
  id: string;
  name: string;
  description: string;
  type: 'weekly' | 'monthly';
  entryFee: number;
  prizePool: number;
  startDate: Date;
  endDate: Date;
  participants: string[];
  status: 'upcoming' | 'active' | 'completed';
  createdBy: string;
  rules: string[];
  prizes: {
    first: number;
    second: number;
    third: number;
  };
}

export interface StepData {
  userId: string;
  competitionId: string;
  date: string;
  steps: number;
  timestamp: Date;
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
  userId: string;
  competitionId: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  timestamp: Date;
  paymentMethod: string;
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
  userId: string;
  competitionId: string;
  position: 1 | 2 | 3;
  amount: number;
  claimed: boolean;
  claimedDate?: Date;
}