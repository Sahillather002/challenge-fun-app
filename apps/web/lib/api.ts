import { 
  UserProfile, 
  Workout, 
  Competition, 
  Story, 
  Snap,
  ApiResponse,
  DashboardStats,
  DailyActivity,
  Transaction,
  Leaderboard,
  LeaderboardEntry
} from '@health-competition/shared';
import { apiClient } from './api-client';

// Shared API Service for web_2
export const api = {
  // User
  getProfile: () => apiClient.get<UserProfile>('/user/profile'),
  updateProfile: (data: Partial<UserProfile>) => apiClient.put<UserProfile>('/user/profile', data),
  getStats: () => apiClient.get<DashboardStats>('/user/stats'),

  // Workouts
  createWorkout: (data: Partial<Workout>) => apiClient.post<Workout>('/workouts', data),
  getWorkouts: () => apiClient.get<Workout[]>('/workouts'),
  getWorkout: (id: string) => apiClient.get<Workout>(`/workouts/${id}`),

  // Competitions
  getCompetitions: () => apiClient.get<Competition[]>('/competitions'),
  getCompetition: (id: string) => apiClient.get<Competition>(`/competitions/${id}`),
  joinCompetition: (id: string) => apiClient.post<any>(`/competitions/${id}/join`, {}),
  getLeaderboard: (id: string) => apiClient.get<Leaderboard>(`/competitions/${id}/leaderboard`),

  // Social
  getStories: () => apiClient.get<Story[]>('/social/stories'),
  createStory: (data: { mediaUrl: string; mediaType: 'IMAGE' | 'VIDEO'; caption?: string }) => 
    apiClient.post<Story>('/social/stories', data),
  
  getFriends: () => apiClient.get<UserProfile[]>('/social/friends'),
  addFriend: (friendId: string) => apiClient.post<any>('/social/friends', { friendId }),
  
  sendSnap: (data: { receiverId: string; mediaUrl: string; mediaType: 'IMAGE' | 'VIDEO' }) => 
    apiClient.post<Snap>('/social/snaps', data),

  // Dashboard & Analytics
  getDashboardStats: () => apiClient.get<DashboardStats>('/analytics/dashboard'),
  getWeeklyActivity: () => apiClient.get<DailyActivity[]>('/analytics/weekly'),
  getTransactions: () => apiClient.get<Transaction[]>('/analytics/transactions'),
};
