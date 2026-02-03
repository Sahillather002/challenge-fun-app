import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeMode, ThemeColors } from '../types';
import { themeConfig, getThemeColors } from '../utils/theme';

interface ThemeContextType {
  mode: ThemeMode;
  colors: ThemeColors;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Storage helper for theme persistence
const themeStorage = {
  getTheme(): ThemeMode {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('app_theme_mode');
        return (stored as ThemeMode) || 'light';
      }
      return 'light';
    } catch {
      return 'light';
    }
  },
  setTheme(mode: ThemeMode): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('app_theme_mode', mode);
      }
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  }
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>('light');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTheme = () => {
      const savedMode = themeStorage.getTheme();
      setMode(savedMode);
      setIsLoading(false);
    };
    loadTheme();
  }, []);

  const colors = getThemeColors(mode);

  const setThemeMode = async (newMode: ThemeMode) => {
    setMode(newMode);
    themeStorage.setTheme(newMode);
    
    // Update HTML class for CSS variables
    if (typeof window !== 'undefined') {
      document.documentElement.classList.toggle('dark', newMode === 'dark');
    }
  };

  const toggleTheme = () => {
    setThemeMode(mode === 'light' ? 'dark' : 'light');
  };

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: themeConfig.light.background
      }}>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          border: '4px solid transparent',
          borderTop: `4px solid ${themeConfig.light.natureGreen}`,
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <ThemeContext.Provider value={{ mode, colors, setThemeMode, toggleTheme }}>
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
