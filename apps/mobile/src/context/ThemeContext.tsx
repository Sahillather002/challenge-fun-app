import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform, View, ActivityIndicator } from 'react-native';

export type AppThemeMode = 'light' | 'dark';

// Design System Colors (Cream/Beige Aesthetic)
const colors = {
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
    // New properties
    glass: 'rgba(255, 255, 255, 0.7)',
    glassBorder: 'rgba(255, 255, 255, 0.5)',
    primary: '#4F46E5',
    primaryContainer: '#E0E7FF',
    foreground: '#2C3E50',
    mutedForeground: '#7D8A96',
    muted: '#F1F5F9',
    tertiary: '#A8B4C0',
    surface: '#FFFFFF',
    outline: 'rgba(0, 0, 0, 0.05)',
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
    // New properties
    glass: 'rgba(30, 41, 59, 0.6)',
    glassBorder: 'rgba(255, 255, 255, 0.1)',
    primary: '#6366f1',
    primaryContainer: '#312e81',
    foreground: '#ffffff',
    mutedForeground: '#9ca3af',
    muted: '#1e293b',
    tertiary: '#6b7280',
    surface: '#161b33',
    outline: 'rgba(255, 255, 255, 0.1)',
  },
};

interface ThemeContextType {
  mode: AppThemeMode;
  setThemeMode: (mode: AppThemeMode) => void;
  toggleTheme: () => void;
  theme: typeof colors.light;
  assets: {
    avatar: string;
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const themeStorage = {
  async getTheme(): Promise<AppThemeMode> {
    try {
      if (Platform.OS === 'web') {
        const stored = localStorage.getItem('app_theme_mode');
        return (stored as AppThemeMode) || 'light';
      }
      return 'light';
    } catch {
      return 'light';
    }
  },
  async setTheme(mode: AppThemeMode): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        localStorage.setItem('app_theme_mode', mode);
      }
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  }
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<AppThemeMode>('light');
  const [isLoading, setIsLoading] = useState(true);

  const assets = {
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=anime-character&backgroundColor=b6e3f4,c0aede,d1d4f9&hair=short01,short02,short03&hairColor=0e7490,7c2d12,be185d&eyes=variant01,variant02,variant03&mouth=variant01,variant02,variant03&skinColor=f3e8ab,f8d25c,fbbf24',
  };

  useEffect(() => {
    const loadTheme = async () => {
      const savedMode = await themeStorage.getTheme();
      setMode(savedMode);
      setIsLoading(false);
    };
    loadTheme();
  }, []);

  const theme = colors[mode];

  const setThemeMode = async (newMode: AppThemeMode) => {
    setMode(newMode);
    await themeStorage.setTheme(newMode);
  };

  const toggleTheme = () => {
    setThemeMode(mode === 'light' ? 'dark' : 'light');
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.light.background }}>
        <ActivityIndicator size="large" color={colors.light.textPrimary} />
      </View>
    );
  }

  return (
    <ThemeContext.Provider value={{ mode, setThemeMode, toggleTheme, theme, assets }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};