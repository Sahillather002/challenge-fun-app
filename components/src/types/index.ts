// Shared type definitions for UI components

export type ThemeMode = 'light' | 'dark';

export interface ThemeColors {
  background: string;
  card: string;
  cardSecondary: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  success: string;
  warning: string;
  info: string;
  error: string;
  trophy: string;
  natureGreen: string;
  skyBlue: string;
  sunsetPink: string;
  mountainPurple: string;
  border: string;
  shadow: string;
}

export interface Theme {
  mode: ThemeMode;
  colors: ThemeColors;
}

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
  fullWidth?: boolean;
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  glass?: boolean;
  elevated?: boolean;
  bordered?: boolean;
  onClick?: () => void;
}

export interface InputProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  error?: string;
  className?: string;
  type?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

export interface AvatarProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  bordered?: boolean;
}

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'info' | 'error';
  className?: string;
  pill?: boolean;
}

export interface IconProps {
  name: string;
  size?: number;
  color?: string;
  className?: string;
}

export interface StatCardProps {
  label: string;
  value: string;
  change?: string;
  isUp?: boolean;
  icon?: string;
  className?: string;
}

export interface CompetitionCardProps {
  id: string;
  title: string;
  participants: number;
  prize: string;
  progress: number;
  endDate: string;
  isActive?: boolean;
  onClick?: (id: string) => void;
}

export interface TransactionProps {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  date: string;
  category?: string;
}

export interface LeaderboardItemProps {
  rank: number;
  user: string;
  avatar: string;
  score: number;
  progress?: number;
}

export interface FitnessStatProps {
  label: string;
  value: string;
  icon: string;
  trend?: number;
  trendType?: 'steps' | 'calories' | 'distance';
}

export interface ThemeConfig {
  light: ThemeColors;
  dark: ThemeColors;
}

export interface DashboardStats {
  totalSteps: number;
  stepsChange: number;
  totalCalories: number;
  caloriesChange: number;
  activeCompetitions: number;
  bestRank: number;
}

export interface UserCompetition {
  id: string;
  title: string;
  participants: number;
  prize: string;
  progress: number;
  endDate: string;
  isActive: boolean;
}
