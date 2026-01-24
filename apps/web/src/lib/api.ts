import axios, { AxiosInstance } from 'axios';
import { getSession } from './supabase';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

console.log("api base", API_BASE_URL)
// Create axios instance
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor to add auth token
  client.interceptors.request.use(
    async (config) => {
      const session = await getSession();
      if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor for error handling
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Handle unauthorized - could redirect to login
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login';
        }
      }
      return Promise.reject(error);
    }
  );

  return client;
};

export const apiClient = createApiClient();

// Type definitions
export interface Competition {
  id: string;
  name: string;
  description: string;
  entry_fee: number;
  prize_pool: number;
  start_date: string;
  end_date: string;
  status: 'active' | 'upcoming' | 'completed';
  type: string;
  created_at: string;
}

export interface UserCompetition extends Competition {
  current_rank?: number;
  user_steps: number;
  user_calories: number;
  user_distance: number;
  joined_at: string;
}

export interface DashboardStats {
  total_steps: number;
  total_calories: number;
  total_distance: number;
  active_competitions: number;
  best_rank: number;
  steps_change: number;
  calories_change: number;
  weekly_activity: DailyActivity[];
  recent_activity: ActivityLog[];
}

export interface DailyActivity {
  date: string;
  steps: number;
  calories: number;
  distance: number;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  title: string;
  type: string;
  steps: number;
  calories: number;
  distance: number;
  duration: number;
  created_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  bio?: string;
  country?: string;
  total_steps: number;
  total_calories: number;
  total_distance: number;
  competitions_won: number;
  total_prizes: number;
  joined_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  competition_id?: string;
  type: 'entry_fee' | 'prize' | 'refund';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  description: string;
  payment_method: string;
  transaction_ref?: string;
  created_at: string;
  completed_at?: string;
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
  last_synced_at: string;
  updated_at: string;
}

export interface Leaderboard {
  competition_id: string;
  entries: LeaderboardEntry[];
  total_count: number;
  updated_at: string;
}

// API methods
export const api = {
  // ==================== COMPETITIONS ====================
  competitions: {
    getAll: async (params?: { status?: string; limit?: number; offset?: number }) => {
      const response = await apiClient.get<{ success: boolean; data: Competition[] }>(
        '/competitions',
        { params }
      );
      return response.data.data;
    },

    getById: async (id: string) => {
      const response = await apiClient.get<{ success: boolean; data: Competition }>(
        `/competitions/${id}`
      );
      return response.data.data;
    },

    create: async (data: {
      name: string;
      description: string;
      entry_fee: number;
      prize_pool: number;
      start_date: string;
      end_date: string;
      type: string;
    }) => {
      const response = await apiClient.post<{ success: boolean; data: Competition }>(
        '/competitions',
        data
      );
      return response.data.data;
    },

    join: async (competitionId: string) => {
      const response = await apiClient.post<{ success: boolean; data: any }>(
        `/competitions/${competitionId}/join`
      );
      return response.data;
    },

    getUserCompetitions: async (userId: string, status?: string) => {
      const response = await apiClient.get<{ success: boolean; data: UserCompetition[] }>(
        `/users/${userId}/competitions`,
        { params: { status } }
      );
      return response.data.data;
    },
  },

  // ==================== USER ====================
  user: {
    getDashboard: async (userId: string) => {
      const response = await apiClient.get<{ success: boolean; data: DashboardStats }>(
        `/users/${userId}/dashboard`
      );
      return response.data.data;
    },

    getProfile: async (userId: string) => {
      const response = await apiClient.get<{ success: boolean; data: UserProfile }>(
        `/users/${userId}/profile`
      );
      return response.data.data;
    },

    updateProfile: async (
      userId: string,
      data: { name?: string; avatar?: string; bio?: string; country?: string }
    ) => {
      const response = await apiClient.put<{ success: boolean; data: UserProfile }>(
        `/users/${userId}/profile`,
        data
      );
      return response.data.data;
    },

    getActivity: async (userId: string, days?: number) => {
      const response = await apiClient.get<{ success: boolean; data: DailyActivity[] }>(
        `/users/${userId}/activity`,
        { params: { days } }
      );
      return response.data.data;
    },

    getTransactions: async (userId: string) => {
      const response = await apiClient.get<{ success: boolean; data: Transaction[] }>(
        `/users/${userId}/transactions`
      );
      return response.data.data;
    },

    uploadAvatar: async (userId: string, file: File) => {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await apiClient.post<{ success: boolean; data: UserProfile }>(
        `/users/${userId}/avatar`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data.data;
    },
  },

  // ==================== LEADERBOARD ====================
  leaderboard: {
    get: async (competitionId: string, limit?: number) => {
      const response = await apiClient.get<{ success: boolean; data: Leaderboard }>(
        `/leaderboard/${competitionId}`,
        { params: { limit } }
      );
      return response.data.data;
    },

    updateScore: async (data: {
      user_id: string;
      competition_id: string;
      steps: number;
      distance: number;
      calories: number;
    }) => {
      const response = await apiClient.post<{ success: boolean }>('/leaderboard/update', data);
      return response.data;
    },
  },

  // ==================== FITNESS ====================
  fitness: {
    sync: async (data: {
      user_id: string;
      competition_id: string;
      steps: number;
      distance: number;
      calories: number;
      active_minutes: number;
      source: string;
      date: string;
    }) => {
      const response = await apiClient.post<{ success: boolean }>('/fitness/sync', data);
      return response.data;
    },

    getStats: async (userId: string, competitionId: string) => {
      const response = await apiClient.get<{ success: boolean; data: any }>(
        `/fitness/stats/${userId}`,
        { params: { competition_id: competitionId } }
      );
      return response.data.data;
    },
  },

  // ==================== PRIZES ====================
  prizes: {
    calculate: async (competitionId: string, prizePool: number) => {
      const response = await apiClient.post<{ success: boolean; data: any }>(
        `/prizes/calculate/${competitionId}`,
        { prize_pool: prizePool }
      );
      return response.data.data;
    },

    distribute: async (competitionId: string) => {
      const response = await apiClient.post<{ success: boolean; data: any }>(
        `/prizes/distribute/${competitionId}`
      );
      return response.data.data;
    },
  },
};

// WebSocket connection for real-time leaderboard updates
export const createLeaderboardWebSocket = (competitionId: string, token: string) => {
  const wsUrl = API_BASE_URL.replace('http', 'ws').replace('/api/v1', '');
  return new WebSocket(`${wsUrl}/ws/leaderboard/${competitionId}?token=${token}`);
};

export default api;
