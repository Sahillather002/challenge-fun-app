import axios from 'axios';
import { supabase } from '../lib/supabase';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

// Create axios instance
const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests
apiClient.interceptors.request.use(async (config) => {
    const { data: { session } } = await supabase.auth.getSession();

    if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
    }

    return config;
});

// API methods
export const api = {
    // User
    getProfile: () => apiClient.get('/user/profile'),
    updateProfile: (data) => apiClient.put('/user/profile', data),
    getStats: () => apiClient.get('/user/stats'),

    // Workouts
    createWorkout: (data) => apiClient.post('/workouts', data),
    getWorkouts: () => apiClient.get('/workouts'),
    getWorkoutHistory: () => apiClient.get('/workouts/history'),

    // Streak
    getStreak: () => apiClient.get('/streak'),
    checkIn: () => apiClient.post('/streak/checkin'),
    useFreeze: () => apiClient.post('/streak/freeze'),

    // Competitions
    getCompetitions: () => apiClient.get('/competitions'),
    getCompetition: (id) => apiClient.get(`/competitions/${id}`),
    joinCompetition: (id) => apiClient.post(`/competitions/${id}/join`),
    getLeaderboard: (id) => apiClient.get(`/competitions/${id}/leaderboard`),

    // Friends
    getFriends: () => apiClient.get('/friends'),
    addFriend: (friendId) => apiClient.post(`/friends/add/${friendId}`),
    acceptFriend: (friendshipId) => apiClient.post(`/friends/accept/${friendshipId}`),
    removeFriend: (friendshipId) => apiClient.delete(`/friends/${friendshipId}`),

    // Achievements
    getAchievements: () => apiClient.get('/achievements'),
    getUserAchievements: () => apiClient.get('/achievements/me'),

    // Stories & Snaps
    getStories: () => apiClient.get('/snap/stories'),
    createStory: (data: any) => apiClient.post('/snap/story', data),
    getInbox: () => apiClient.get('/snap/inbox'),
    sendSnap: (data: any) => apiClient.post('/snap/send', data),
    markSnapViewed: (id: any) => apiClient.put(`/snap/${id}/view`),
};



export default apiClient;
