// API endpoints
export const API_ENDPOINTS = {
  AUTH: '/api/auth',
  USERS: '/api/users',
  COMPETITIONS: '/api/competitions',
  ACTIVITIES: '/api/activities',
  LEADERBOARD: '/api/leaderboard',
  TRANSACTIONS: '/api/transactions',
};

// Competition constants
export const COMPETITION_TYPES = {
  STEPS: 'steps',
  DISTANCE: 'distance',
  CALORIES: 'calories',
  MIXED: 'mixed',
} as const;

export const COMPETITION_STATUS = {
  UPCOMING: 'upcoming',
  ACTIVE: 'active',
  COMPLETED: 'completed',
} as const;

// Activity constants
export const STEPS_PER_MILE = 2000;
export const CALORIES_PER_STEP = 0.04;
