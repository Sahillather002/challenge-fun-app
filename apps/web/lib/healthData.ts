
import { Trophy, Target, Flame, Droplet, Footprints, Medal } from 'lucide-react';

export interface CompetitionCard {
  id: string;
  title: string;
  category: string;
  prize: string;
  participants: number;
  time: string;
  live: boolean;
  entryFee?: number;
  description?: string;
  rules?: string[];
}

export interface CommunityPost {
  id: string;
  name: string;
  username: string;
  avatar: string;
  caption: string;
  likes: number;
  comments: number;
  badge: string;
  mediaUrl: string;
}

export interface RewardItem {
  id: number;
  name: string;
  points: number;
  available: boolean;
  icon: string;
}

export interface BadgeItem {
  id: number;
  name: string;
  description: string;
  unlocked: boolean;
  icon: keyof typeof iconMap;
}

const iconMap = {
  trophy: Trophy,
  target: Target,
  flame: Flame,
  droplet: Droplet,
  steps: Footprints,
  medal: Medal
};

export const getIcon = (name: keyof typeof iconMap) => iconMap[name];

export const fallbackCompetitions: CompetitionCard[] = [
  {
    id: '1',
    title: 'Push-Up Challenge',
    category: 'Strength',
    prize: '$500',
    participants: 234,
    time: '2h 15m',
    live: true,
    entryFee: 0,
    description: 'Complete as many strict push-ups as possible before the timer ends.',
    rules: ['Each rep must be recorded through the app.', 'Top 10 participants win prizes.', 'Entries close when the live timer expires.']
  },
  {
    id: '2',
    title: '5K Sprint Battle',
    category: 'Cardio',
    prize: '$750',
    participants: 189,
    time: '4h 30m',
    live: true,
    entryFee: 25
  },
  {
    id: '3',
    title: '10K Steps League',
    category: 'Steps',
    prize: '$300',
    participants: 456,
    time: '6h 45m',
    live: true,
    entryFee: 0
  },
  {
    id: '4',
    title: 'Plank Endurance',
    category: 'Endurance',
    prize: '$400',
    participants: 167,
    time: '1h 20m',
    live: true,
    entryFee: 10
  },
  {
    id: '5',
    title: 'Squat Marathon',
    category: 'Strength',
    prize: '$600',
    participants: 298,
    time: '3h 10m',
    live: false,
    entryFee: 15
  }
];

export const fallbackPosts: CommunityPost[] = [
  {
    id: '1',
    name: 'Alex Rivera',
    username: 'arivera_fit',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200',
    caption: 'Crushed my morning 10K and kept the streak alive.',
    likes: 1243,
    comments: 89,
    badge: 'Running • 10.2 km • 52 min',
    mediaUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900'
  },
  {
    id: '2',
    name: 'Sarah Chen',
    username: 'sarah_trains',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    caption: 'Joined the Push-Up Battle. The prize pool is worth the grind.',
    likes: 856,
    comments: 42,
    badge: 'Push-ups • 150 reps • 5 sets',
    mediaUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=900'
  },
  {
    id: '3',
    name: 'Jordan Lee',
    username: 'jordan_steps',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
    caption: 'Hit 12,000 steps before lunch and moved up two leaderboard spots.',
    likes: 632,
    comments: 31,
    badge: 'Steps • 12,040 today',
    mediaUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=900'
  }
];

export const fallbackBadges: BadgeItem[] = [
  { id: 1, name: 'First Win', description: 'Win your first battle.', unlocked: true, icon: 'trophy' },
  { id: 2, name: '7 Day Streak', description: 'Check in for seven consecutive days.', unlocked: true, icon: 'flame' },
  { id: 3, name: '10 Battles', description: 'Complete ten competition entries.', unlocked: true, icon: 'target' },
  { id: 4, name: '100 Wins', description: 'Collect one hundred victories.', unlocked: false, icon: 'medal' },
  { id: 5, name: 'Hydration Hero', description: 'Reach your water goal for ten days.', unlocked: false, icon: 'droplet' },
  { id: 6, name: 'Step Master', description: 'Hit 10,000 steps for thirty days.', unlocked: false, icon: 'steps' }
];

export const fallbackRewards: RewardItem[] = [
  { id: 1, name: '$10 Fitness Store Gift Card', points: 1000, available: true, icon: 'Gift' },
  { id: 2, name: '$25 Nike Voucher', points: 2500, available: true, icon: 'ShoppingBag' },
  { id: 3, name: 'Premium Membership (1 Month)', points: 1500, available: true, icon: 'Crown' },
  { id: 4, name: '$50 Gym Membership', points: 5000, available: false, icon: 'Dumbbell' },
  { id: 5, name: 'Fitness Tracker Watch', points: 10000, available: false, icon: 'Watch' },
  { id: 6, name: '$100 Cash Prize', points: 15000, available: false, icon: 'Coins' }
];

export const normalizeCompetition = (competition: any): CompetitionCard => ({
  id: competition?.id || competition?._id || '1',
  title: competition?.title || fallbackCompetitions[0].title,
  category: competition?.type || competition?.category || 'Strength',
  prize: competition?.prize ? `$${competition.prize}` : competition?.prizePool ? `$${competition.prizePool}` : '$500',
  participants: competition?._count?.participants || competition?.participants || 234,
  time: '2h 15m',
  live: competition?.status === 'LIVE' || competition?.status === 'ACTIVE' || competition?.live !== false,
  entryFee: competition?.entryFee ?? 0,
  description: competition?.description || undefined,
  rules: competition?.rules
});

export const normalizeCompetitionList = (items: any[] | undefined): CompetitionCard[] => {
  if (!items?.length) return fallbackCompetitions;
  return items.map(normalizeCompetition);
};

export const normalizeStories = (stories: any[] | undefined): CommunityPost[] => {
  if (!stories?.length) return fallbackPosts;
  return stories.map((story, index) => ({
    id: story.id || `story-${index}`,
    name: story.user?.name || `Athlete ${index + 1}`,
    username: story.user?.username || `athlete_${index + 1}`,
    avatar: story.user?.avatar || `https://images.unsplash.com/photo-${1500648767791 + index}-00dcc994a43e?w=200`,
    caption: story.caption || 'Shared a new workout milestone.',
    likes: Math.floor(Math.random() * 900) + 100,
    comments: Math.floor(Math.random() * 80) + 5,
    badge: story.workoutData?.type ? `${story.workoutData.type} • ${story.workoutData.distance || story.workoutData.reps || 'Logged'}` : 'Workout shared',
    mediaUrl: story.mediaUrl || fallbackPosts[index % fallbackPosts.length].mediaUrl
  }));
};

export interface WorkoutItem {
  id: string;
  title: string;
  type: 'Run' | 'Strength' | 'Cycle' | 'Yoga' | 'Walk' | 'Swim';
  duration: number;
  calories: number;
  date: string;
  intensity: 'Easy' | 'Moderate' | 'Hard';
}

export interface FriendItem {
  id: string;
  name: string;
  username: string;
  avatar: string;
  status: 'online' | 'offline' | 'in-battle';
  rank: number;
  lastActive: string;
  mutualCompetitions: number;
}

export interface FriendRequestItem {
  id: string;
  name: string;
  username: string;
  avatar: string;
  reason: string;
}

export interface NotificationItem {
  id: string;
  type: 'rank' | 'competition' | 'friend' | 'reward' | 'system';
  title: string;
  body: string;
  time: string;
  read: boolean;
  actionLabel?: string;
}

export interface LeaderboardEntryItem {
  id: string;
  rank: number;
  name: string;
  username: string;
  avatar: string;
  score: number;
  movement: 'up' | 'down' | 'same';
}

export interface AnalyticsMetric {
  label: string;
  value: string;
  delta: string;
  trend: 'up' | 'down' | 'flat';
}

export interface CompetitionTemplate {
  id: string;
  title: string;
  category: CompetitionCard['category'];
  description: string;
  rules: string[];
}

export const fallbackWorkouts: WorkoutItem[] = [
  { id: '1', title: 'Morning Run', type: 'Run', duration: 42, calories: 380, date: 'Today', intensity: 'Hard' },
  { id: '2', title: 'Upper Body Strength', type: 'Strength', duration: 55, calories: 410, date: 'Yesterday', intensity: 'Moderate' },
  { id: '3', title: 'Evening Cycle', type: 'Cycle', duration: 38, calories: 320, date: 'Mon', intensity: 'Moderate' },
  { id: '4', title: 'Mobility Flow', type: 'Yoga', duration: 25, calories: 120, date: 'Sun', intensity: 'Easy' },
  { id: '5', title: 'Recovery Walk', type: 'Walk', duration: 31, calories: 165, date: 'Sat', intensity: 'Easy' },
];

export const fallbackFriends: FriendItem[] = [
  { id: '1', name: 'Alex Rivera', username: 'arivera_fit', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200', status: 'in-battle', rank: 12, lastActive: 'Now', mutualCompetitions: 8 },
  { id: '2', name: 'Sarah Chen', username: 'sarah_trains', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200', status: 'online', rank: 24, lastActive: '12m ago', mutualCompetitions: 5 },
  { id: '3', name: 'Jordan Lee', username: 'jordan_steps', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200', status: 'offline', rank: 38, lastActive: '2h ago', mutualCompetitions: 3 },
  { id: '4', name: 'Maya Patel', username: 'maya_moves', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200', status: 'online', rank: 51, lastActive: 'Now', mutualCompetitions: 2 },
];

export const fallbackFriendRequests: FriendRequestItem[] = [
  { id: '1', name: 'Noah Brooks', username: 'noah_runs', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200', reason: 'You both joined the 10K Steps League' },
  { id: '2', name: 'Priya Shah', username: 'priya_yoga', avatar: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=200', reason: 'Recommended from Wellness Battles' },
];

export const fallbackNotifications: NotificationItem[] = [
  { id: '1', type: 'rank', title: 'You moved up to #47', body: 'Your Push-Up Challenge score pushed you past 18 athletes.', time: '5m ago', read: false, actionLabel: 'View rank' },
  { id: '2', type: 'competition', title: '5K Sprint Battle opens soon', body: 'Registration closes in 45 minutes. Bring your best pace.', time: '22m ago', read: false, actionLabel: 'Join battle' },
  { id: '3', type: 'friend', title: 'Alex beat your streak', body: 'Alex Rivera is now on an 8-day streak.', time: '1h ago', read: true, actionLabel: 'Challenge back' },
  { id: '4', type: 'reward', title: 'Reward milestone reached', body: 'You are 250 points away from the Nike voucher.', time: 'Yesterday', read: true, actionLabel: 'View rewards' },
];

export const fallbackLeaderboardEntries: LeaderboardEntryItem[] = [
  { id: '1', rank: 1, name: 'Mia Stone', username: 'mia_power', avatar: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=200', score: 18920, movement: 'up' },
  { id: '2', rank: 2, name: 'Alex Rivera', username: 'arivera_fit', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200', score: 18145, movement: 'down' },
  { id: '3', rank: 3, name: 'Sarah Chen', username: 'sarah_trains', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200', score: 17680, movement: 'up' },
  { id: '4', rank: 4, name: 'Jordan Lee', username: 'jordan_steps', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200', score: 16940, movement: 'same' },
  { id: '5', rank: 5, name: 'Fit Fighter', username: 'fit_fighter', avatar: '', score: 15870, movement: 'up' },
];

export const fallbackAnalyticsMetrics: AnalyticsMetric[] = [
  { label: 'Weekly activity score', value: '842', delta: '+12%', trend: 'up' },
  { label: 'Average daily steps', value: '8,640', delta: '+8%', trend: 'up' },
  { label: 'Hydration consistency', value: '76%', delta: '-3%', trend: 'down' },
  { label: 'Competition win rate', value: '31%', delta: '+5%', trend: 'up' },
];

export const fallbackCompetitionTemplates: CompetitionTemplate[] = [
  { id: 'steps', title: 'Step Surge', category: 'Steps', description: 'A team or solo step-count battle focused on consistency.', rules: ['Daily steps sync before midnight.', 'Top average daily steps wins.', 'Manual step entries are reviewed.'] },
  { id: 'strength', title: 'Rep Rush', category: 'Strength', description: 'A timed strength challenge for push-ups, squats, or custom reps.', rules: ['Record reps through the app.', 'Use strict form only.', 'Tie-breaker goes to faster completion.'] },
  { id: 'cardio', title: 'Pace Chase', category: 'Cardio', description: 'A running or cycling battle based on distance and pace.', rules: ['GPS route required.', 'Average pace determines score.', 'Outdoor routes only.'] },
];

export const normalizeWorkouts = (items: any[] | undefined): WorkoutItem[] => {
  if (!items?.length) return fallbackWorkouts;
  return items.map((item, index) => ({
    id: item.id || `workout-${index}`,
    title: item.title || item.type || 'Workout',
    type: item.type || 'Run',
    duration: item.duration || 30,
    calories: item.calories || 250,
    date: item.date || 'Today',
    intensity: item.intensity || 'Moderate',
  }));
};

export const normalizeFriends = (items: any[] | undefined): FriendItem[] => {
  if (!items?.length) return fallbackFriends;
  return items.map((item, index) => ({
    id: item.id || `friend-${index}`,
    name: item.name || item.profile?.name || `Athlete ${index + 1}`,
    username: item.username || item.profile?.username || `athlete_${index + 1}`,
    avatar: item.avatar || item.profile?.avatar || '',
    status: item.status || 'offline',
    rank: item.rank || index + 10,
    lastActive: item.lastActive || 'Recently',
    mutualCompetitions: item.mutualCompetitions || 0,
  }));
};

export const normalizeNotifications = (items: any[] | undefined): NotificationItem[] => {
  if (!items?.length) return fallbackNotifications;
  return items.map((item, index) => ({
    id: item.id || `notification-${index}`,
    type: item.type || 'system',
    title: item.title || 'Notification',
    body: item.body || 'New activity in your competition circle.',
    time: item.time || 'Just now',
    read: Boolean(item.read),
    actionLabel: item.actionLabel,
  }));
};

export const normalizeLeaderboard = (items: any[] | undefined): LeaderboardEntryItem[] => {
  if (!items?.length) return fallbackLeaderboardEntries;
  return items.map((item, index) => ({
    id: item.id || `leader-${index}`,
    rank: item.rank || index + 1,
    name: item.name || item.user?.name || `Athlete ${index + 1}`,
    username: item.username || item.user?.username || `athlete_${index + 1}`,
    avatar: item.avatar || item.user?.avatar || '',
    score: item.score || 0,
    movement: item.movement || 'same',
  }));
};

export const normalizeAnalyticsMetrics = (items: any[] | undefined): AnalyticsMetric[] => {
  if (!items?.length) return fallbackAnalyticsMetrics;
  return items.map((item) => ({
    label: item.label || 'Metric',
    value: item.value || '0',
    delta: item.delta || '+0%',
    trend: item.trend || 'flat',
  }));
};

