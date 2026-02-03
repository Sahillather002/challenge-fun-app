import { ThemeColors, ThemeConfig } from '../types';

// Design System Colors
export const themeConfig: ThemeConfig = {
  light: {
    background: '#F5F1E8',
    card: '#FFFFFF',
    cardSecondary: '#FFF9F0',
    textPrimary: '#2C3E50',
    textSecondary: '#7D8A96',
    textTertiary: '#A8B4C0',
    success: '#4CAF50',
    warning: '#FF9800',
    info: '#2196F3',
    error: '#F44336',
    trophy: '#FFD700',
    natureGreen: '#5D9C7E',
    skyBlue: '#87CEEB',
    sunsetPink: '#FFB6C1',
    mountainPurple: '#9B7EBD',
    border: 'rgba(0, 0, 0, 0.05)',
    shadow: 'rgba(0, 0, 0, 0.08)',
  },
  dark: {
    background: '#0a0e27',
    card: '#161b33',
    cardSecondary: '#1a1f3a',
    textPrimary: '#ffffff',
    textSecondary: '#9ca3af',
    textTertiary: '#6b7280',
    success: '#00ff9d',
    warning: '#ff7d00',
    info: '#4a90d9',
    error: '#ff4757',
    trophy: '#fcd34d',
    natureGreen: '#00ff9d',
    skyBlue: '#4a90d9',
    sunsetPink: '#ff4757',
    mountainPurple: '#7b61ff',
    border: 'rgba(255, 255, 255, 0.1)',
    shadow: 'rgba(0, 0, 0, 0.3)',
  },
};

export const getThemeColors = (mode: 'light' | 'dark'): ThemeColors => {
  return themeConfig[mode];
};

export const getContrastColor = (color: string): string => {
  // Simple contrast check (black or white)
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  return luminance > 0.5 ? '#000000' : '#ffffff';
};

export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

export const formatCurrency = (amount: number, currency: string = 'INR'): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (date: string | Date, format: string = 'short'): string => {
  const d = new Date(date);
  
  if (format === 'short') {
    return d.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short' 
    });
  }
  
  if (format === 'long') {
    return d.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  }
  
  return d.toLocaleDateString();
};

export const calculateProgress = (current: number, target: number): number => {
  return Math.min((current / target) * 100, 100);
};

export const getRankColor = (rank: number): string => {
  if (rank === 1) return '#FFD700'; // Gold
  if (rank === 2) return '#C0C0C0'; // Silver
  if (rank === 3) return '#CD7F32'; // Bronze
  return '#6B7280'; // Gray
};
