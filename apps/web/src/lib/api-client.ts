import axios from 'axios';
import { getSession } from './supabase';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8083/api/v1';

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth interceptor
apiClient.interceptors.request.use(async (config) => {
  const session = await getSession();
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
});

// API methods
export const api = {
  // Leaderboard
  getLeaderboard: (competitionId: string, limit = 100) =>
    apiClient.get(`/leaderboard/${competitionId}`, { params: { limit } }),

  updateScore: (data: {
    user_id: string;
    competition_id: string;
    steps: number;
    distance: number;
    calories: number;
  }) => apiClient.post('/leaderboard/update', data),

  // Fitness
  syncFitnessData: (data: {
    user_id: string;
    competition_id: string;
    steps: number;
    distance: number;
    calories: number;
    active_minutes: number;
    source: string;
    date: string;
  }) => apiClient.post('/fitness/sync', data),

  getUserStats: (userId: string, competitionId: string) =>
    apiClient.get(`/fitness/stats/${userId}`, {
      params: { competition_id: competitionId },
    }),

  // Prizes
  calculatePrizes: (competitionId: string, prizePool: number) =>
    apiClient.post(`/prizes/calculate/${competitionId}`, { prize_pool: prizePool }),

  distributePrizes: (competitionId: string) =>
    apiClient.post(`/prizes/distribute/${competitionId}`),
};

export default api;
