import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ThemeProvider } from '../../context/ThemeContext';
import { SupabaseAuthProvider } from '../../context/SupabaseAuthContext';
import LeaderboardScreen from '../LeaderboardScreen';
import TransactionsScreen from '../TransactionsScreen';

// Mock contexts
jest.mock('../../context/ThemeContext', () => ({
  useTheme: () => ({
    theme: {
      colors: {
        background: '#ffffff',
        surface: '#ffffff',
        primary: '#6200ee',
        onSurface: '#000000',
        onSurfaceVariant: '#666666'
      }
    },
    isDark: false
  })
}));

jest.mock('@react-navigation/native', () => ({
  useRoute: () => ({
    params: { competitionId: 'test-competition-id' }
  }),
  useNavigation: () => ({
    navigate: jest.fn()
  })
}));

describe('Dashboard Screens', () => {
  describe('LeaderboardScreen', () => {
    it('renders leaderboard correctly', () => {
      const { getByText } = render(<LeaderboardScreen navigation={{ navigate: jest.fn() }} />);

      expect(getByText('Leaderboard')).toBeTruthy();
      expect(getByText('Rankings based on challenges and payments.')).toBeTruthy();
    });

    it('displays leaderboard items', () => {
      const { getByText } = render(<LeaderboardScreen navigation={{ navigate: jest.fn() }} />);

      expect(getByText('1. User A')).toBeTruthy();
      expect(getByText('150 points')).toBeTruthy();
      expect(getByText('2. User B')).toBeTruthy();
      expect(getByText('120 points')).toBeTruthy();
      expect(getByText('3. You')).toBeTruthy();
      expect(getByText('100 points')).toBeTruthy();
    });

    it('basic View component renders', () => {
      const { getByTestId } = render(
        <View testID="test-view">
          <Text>Test Content</Text>
        </View>
      );
      
      expect(getByTestId('test-view')).toBeTruthy();
    });
  });
});


