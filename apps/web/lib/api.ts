
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

export const api = {
  getProfile: () => apiClient.get<ApiResponse<UserProfile>>('/user/profile'),
  updateProfile: (data: Partial<UserProfile>) => apiClient.put<ApiResponse<UserProfile>>('/user/profile', data),
  getStats: () => apiClient.get<ApiResponse<DashboardStats>>('/user/stats'),

  getWorkouts: () => apiClient.get<ApiResponse<Workout[]>>('/workouts'),
  createWorkout: (data: Partial<Workout>) => apiClient.post<ApiResponse<Workout>>('/workouts', data),
  getWorkout: (id: string) => apiClient.get<ApiResponse<Workout>>(`/workouts/${id}`),
  getWorkoutHistory: () => apiClient.get<ApiResponse<Workout[]>>('/workouts/history'),
  getNotifications: () => apiClient.get<ApiResponse<any[]>>('/notifications'),
  markNotificationRead: (id: string) => apiClient.put<ApiResponse<any>>(`/notifications/${id}/read`, {}),
  getLeaderboard: (scope: 'global' | 'friends' | 'team' = 'global') => apiClient.get<ApiResponse<Leaderboard | any>>(`/leaderboard/${scope}`),
  createCompetition: (data: Partial<Competition>) => apiClient.post<ApiResponse<Competition>>('/competitions', data),

  getStreak: () => apiClient.get<ApiResponse<any>>('/streak'),
  checkIn: () => apiClient.post<ApiResponse<any>>('/streak/checkin'),
  useFreeze: () => apiClient.post<ApiResponse<any>>('/streak/freeze'),

  getHealthData: (params?: { date?: string }) => apiClient.get<ApiResponse<any>>('/health/data', { params }),
  syncSteps: (data: { date: string; steps: number }) => apiClient.post<ApiResponse<any>>('/health/steps', data),
  getWaterIntake: (params?: { date?: string }) => apiClient.get<ApiResponse<any>>('/health/water', { params }),
  logWater: (data: { date: string; amount: number }) => apiClient.post<ApiResponse<any>>('/health/water', data),

  getCompetitions: () => apiClient.get<ApiResponse<Competition[]>>('/competitions'),
  getCompetition: (id: string) => apiClient.get<ApiResponse<Competition>>(`/competitions/${id}`),
  joinCompetition: (id: string) => apiClient.post<ApiResponse<any>>(`/competitions/${id}/join`, {}),
  getCompetitionLeaderboard: (id: string) => apiClient.get<ApiResponse<Leaderboard | any>>(`/competitions/${id}/leaderboard`),

  getStories: () => apiClient.get<ApiResponse<Story[]>>('/snap/stories'),
  createStory: (data: Partial<Story>) => apiClient.post<ApiResponse<Story>>('/snap/story', data),
  getInbox: () => apiClient.get<ApiResponse<Snap[]>>('/snap/inbox'),
  sendSnap: (data: Partial<Snap>) => apiClient.post<ApiResponse<Snap>>('/snap/send', data),
  markSnapViewed: (id: string) => apiClient.put<ApiResponse<any>>(`/snap/${id}/view`),

  getFriends: () => apiClient.get<ApiResponse<any>>('/friends'),
  addFriend: (friendId: string) => apiClient.post<ApiResponse<any>>(`/friends/add/${friendId}`),
  acceptFriend: (friendshipId: string) => apiClient.post<ApiResponse<any>>(`/friends/accept/${friendshipId}`),
  removeFriend: (friendshipId: string) => apiClient.delete<ApiResponse<any>>(`/friends/${friendshipId}`),

  getAchievements: () => apiClient.get<ApiResponse<any>>('/achievements'),
  getUserAchievements: () => apiClient.get<ApiResponse<any>>('/achievements/me'),

  getDashboardStats: () => apiClient.get<ApiResponse<DashboardStats>>('/analytics/dashboard'),
  getWeeklyActivity: () => apiClient.get<ApiResponse<DailyActivity[]>>('/analytics/weekly'),
  getTransactions: () => apiClient.get<ApiResponse<Transaction[]>>('/analytics/transactions'),
};
