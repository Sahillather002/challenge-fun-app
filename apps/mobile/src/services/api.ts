import { ApiClient, GetTokenFn } from '@health-competition/shared';
import { supabase } from '../lib/supabase';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

const getToken: GetTokenFn = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token;
};

export const apiClient = new ApiClient(API_URL, getToken);

import { 
    UserProfile, 
    Workout, 
    Competition, 
    Story, 
    Snap,
    ApiResponse 
} from '@health-competition/shared';

export const api = {
    // User
    getProfile: () => apiClient.get<ApiResponse<UserProfile>>('/user/profile'),
    updateProfile: (data: Partial<UserProfile>) => apiClient.put<ApiResponse<UserProfile>>('/user/profile', data),
    getStats: () => apiClient.get<ApiResponse<any>>('/user/stats'),

    // Workouts
    createWorkout: (data: Partial<Workout>) => apiClient.post<ApiResponse<Workout>>('/workouts', data),
    getWorkouts: () => apiClient.get<ApiResponse<Workout[]>>('/workouts'),
    getWorkoutHistory: () => apiClient.get<ApiResponse<Workout[]>>('/workouts/history'),

    // Streak
    getStreak: () => apiClient.get<ApiResponse<any>>('/streak'),
    checkIn: () => apiClient.post<ApiResponse<any>>('/streak/checkin'),
    useFreeze: () => apiClient.post<ApiResponse<any>>('/streak/freeze'),

    // Health Data
    getHealthData: (params?: { date?: string }) => apiClient.get<ApiResponse<any>>('/health/data', { params }),
    syncSteps: (data: { date: string; steps: number }) => apiClient.post<ApiResponse<any>>('/health/steps', data),
    getWaterIntake: (params?: { date?: string }) => apiClient.get<ApiResponse<any>>('/health/water', { params }),
    logWater: (data: { date: string; amount: number }) => apiClient.post<ApiResponse<any>>('/health/water', data),

    // Competitions
    getCompetitions: () => apiClient.get<ApiResponse<Competition[]>>('/competitions'),
    getCompetition: (id: string) => apiClient.get<ApiResponse<Competition>>(`/competitions/${id}`),
    joinCompetition: (id: string) => apiClient.post<ApiResponse<any>>(`/competitions/${id}/join`),
    getLeaderboard: (id: string) => apiClient.get<ApiResponse<any>>(`/competitions/${id}/leaderboard`),

    // Friends
    getFriends: () => apiClient.get<ApiResponse<any>>('/friends'),
    addFriend: (friendId: string) => apiClient.post<ApiResponse<any>>(`/friends/add/${friendId}`),
    acceptFriend: (friendshipId: string) => apiClient.post<ApiResponse<any>>(`/friends/accept/${friendshipId}`),
    removeFriend: (friendshipId: string) => apiClient.delete<ApiResponse<any>>(`/friends/${friendshipId}`),

    // Achievements
    getAchievements: () => apiClient.get<ApiResponse<any>>('/achievements'),
    getUserAchievements: () => apiClient.get<ApiResponse<any>>('/achievements/me'),

    // Stories & Snaps
    getStories: () => apiClient.get<ApiResponse<Story[]>>('/snap/stories'),
    createStory: (data: Partial<Story>) => apiClient.post<ApiResponse<Story>>('/snap/story', data),
    getInbox: () => apiClient.get<ApiResponse<Snap[]>>('/snap/inbox'),
    sendSnap: (data: Partial<Snap>) => apiClient.post<ApiResponse<Snap>>('/snap/send', data),
    markSnapViewed: (id: string) => apiClient.put<ApiResponse<any>>(`/snap/${id}/view`),

    // Messaging
    getConversations: () => apiClient.get<ApiResponse<any>>('/messages/conversations'),
    getMessages: (conversationId: string) => apiClient.get<ApiResponse<any>>(`/messages/${conversationId}`),
    sendMessage: (data: { conversationId: string; text: string }) => 
      apiClient.post<ApiResponse<any>>(`/messages/${data.conversationId}`, { text: data.text }),

    // Challenges
    getChallenges: () => apiClient.get<ApiResponse<any>>('/challenges'),
    joinChallenge: (challengeId: string) => apiClient.post<ApiResponse<any>>(`/challenges/${challengeId}/join`),
};



export default apiClient;
