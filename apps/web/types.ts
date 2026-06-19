
export interface HealthMetric {
  label: string;
  value: string;
  unit?: string;
  progress: number;
  icon: 'steps' | 'water' | 'calories' | 'minutes' | 'streak' | 'rank';
}

export interface Competition {
  id: string;
  title: string;
  category: 'Strength' | 'Cardio' | 'Steps' | 'Endurance' | 'Wellness';
  prize: string;
  participants: number;
  time: string;
  live: boolean;
  entryFee?: number;
  description?: string;
  rules?: string[];
}

export interface NavigationTab {
  HOME: 'home';
  HEALTH: 'health';
  COMMUNITY: 'community';
  COMPETE: 'compete';
  COMPETITION_DETAIL: 'competition-detail';
  GOALS: 'goals';
  REWARDS: 'rewards';
  WORKOUTS: 'workouts';
  FRIENDS: 'friends';
  ANALYTICS: 'analytics';
  LEADERBOARD: 'leaderboard';
  CREATE_COMPETITION: 'create-competition';
  NOTIFICATIONS: 'notifications';
  PROFILE: 'profile';
  SETTINGS: 'settings';
  FAQ: 'faq';
}

export const NavigationTab = {
  HOME: 'home',
  HEALTH: 'health',
  COMMUNITY: 'community',
  COMPETE: 'compete',
  COMPETITION_DETAIL: 'competition-detail',
  GOALS: 'goals',
  REWARDS: 'rewards',
  WORKOUTS: 'workouts',
  FRIENDS: 'friends',
  ANALYTICS: 'analytics',
  LEADERBOARD: 'leaderboard',
  CREATE_COMPETITION: 'create-competition',
  NOTIFICATIONS: 'notifications',
  PROFILE: 'profile',
  SETTINGS: 'settings',
  FAQ: 'faq'
} as const;

export type NavigationTabValue = (typeof NavigationTab)[keyof typeof NavigationTab];

export interface NavigationRoute {
  id: NavigationTabValue;
  label: string;
  section: 'Competition Hub' | 'Account';
}

export const WEB_ROUTES: NavigationRoute[] = [
  { id: NavigationTab.HOME, label: 'Home', section: 'Competition Hub' },
  { id: NavigationTab.HEALTH, label: 'Health', section: 'Competition Hub' },
  { id: NavigationTab.COMMUNITY, label: 'Community', section: 'Competition Hub' },
  { id: NavigationTab.COMPETE, label: 'Compete', section: 'Competition Hub' },
  { id: NavigationTab.WORKOUTS, label: 'Workouts', section: 'Competition Hub' },
  { id: NavigationTab.FRIENDS, label: 'Friends', section: 'Competition Hub' },
  { id: NavigationTab.ANALYTICS, label: 'Analytics', section: 'Competition Hub' },
  { id: NavigationTab.LEADERBOARD, label: 'Leaderboard', section: 'Competition Hub' },
  { id: NavigationTab.CREATE_COMPETITION, label: 'Create Competition', section: 'Competition Hub' },
  { id: NavigationTab.GOALS, label: 'Goals', section: 'Competition Hub' },
  { id: NavigationTab.REWARDS, label: 'Rewards', section: 'Competition Hub' },
  { id: NavigationTab.PROFILE, label: 'Profile', section: 'Account' },
  { id: NavigationTab.NOTIFICATIONS, label: 'Notifications', section: 'Account' },
  { id: NavigationTab.FAQ, label: 'Help & FAQ', section: 'Account' },
  { id: NavigationTab.SETTINGS, label: 'Settings', section: 'Account' }
];
