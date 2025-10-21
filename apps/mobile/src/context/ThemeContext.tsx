import React, { createContext, useContext, useState, useEffect } from 'react';
import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import { Platform } from 'react-native';

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
  theme: any;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Storage helper for theme persistence
const themeStorage = {
  async getTheme(): Promise<boolean> {
    try {
      if (Platform.OS === 'web') {
        const stored = localStorage.getItem('app_theme');
        return stored === 'dark';
      } else {
        // For native, you'd use AsyncStorage or SecureStore
        return false;
      }
    } catch {
      return false;
    }
  },
  async setTheme(isDark: boolean): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        localStorage.setItem('app_theme', isDark ? 'dark' : 'light');
      }
      // For native, you'd use AsyncStorage or SecureStore
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  }
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved theme on mount
  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await themeStorage.getTheme();
      setIsDark(savedTheme);
      setIsLoading(false);
    };
    loadTheme();
  }, []);

  const theme = isDark ? MD3DarkTheme : MD3LightTheme;

  const toggleTheme = async () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    await themeStorage.setTheme(newTheme);
  };

  // Don't render children until theme is loaded
  if (isLoading) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, theme }}>
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