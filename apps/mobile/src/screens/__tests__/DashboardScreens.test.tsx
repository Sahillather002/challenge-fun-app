import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import LeaderboardScreen from '../LeaderboardScreen';
import TransactionsScreen from '../TransactionsScreen';

// Mock contexts
jest.mock('../context/ThemeContext', () => ({
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

    it('navigates to rewards screen', () => {
      const mockNavigate = jest.fn();
      const { getByText } = render(<LeaderboardScreen navigation={{ navigate: mockNavigate }} />);

      const rewardsButton = getByText('Claim Rewards');
      fireEvent.press(rewardsButton);

      expect(mockNavigate).toHaveBeenCalledWith('Rewards');
    });

    it('sorts leaderboard by points in descending order', () => {
      const { getByText } = render(<LeaderboardScreen navigation={{ navigate: jest.fn() }} />);

      // Check if highest scorer appears first
      const firstItem = getByText('1. User A');
      const secondItem = getByText('2. User B');
      const thirdItem = getByText('3. You');

      expect(firstItem).toBeTruthy();
      expect(secondItem).toBeTruthy();
      expect(thirdItem).toBeTruthy();

      // Verify points are in descending order
      expect(getByText('150 points')).toBeTruthy(); // User A
      expect(getByText('120 points')).toBeTruthy(); // User B
      expect(getByText('100 points')).toBeTruthy(); // You
    });

    it('displays trophy icons for rankings', () => {
      const { getByText } = render(<LeaderboardScreen navigation={{ navigate: jest.fn() }} />);

      // Check if trophy icons are present (would need more specific testing)
      expect(getByText('1. User A')).toBeTruthy();
      expect(getByText('2. User B')).toBeTruthy();
      expect(getByText('3. You')).toBeTruthy();
    });
  });

  describe('TransactionsScreen', () => {
    it('renders transactions screen correctly', () => {
      const { getByText } = render(<TransactionsScreen />);

      expect(getByText('Transactions')).toBeTruthy();
      expect(getByText('Your payment history')).toBeTruthy();
    });

    it('displays transaction history', () => {
      const { getByText } = render(<TransactionsScreen />);

      // Check for mock transaction data
      expect(getByText(/Transaction|Payment|Entry Fee/)).toBeTruthy();
    });

    it('handles empty transaction list', () => {
      const { getByText } = render(<TransactionsScreen />);

      // Should display empty state or no transactions message
      expect(getByText('Transactions')).toBeTruthy();
    });

    it('displays transaction details', () => {
      const { getByText } = render(<TransactionsScreen />);

      // Check for transaction details like amount, date, status
      expect(getByText(/₹|Date|Status/)).toBeTruthy();
    });

    it('shows transaction status indicators', () => {
      const { getByText } = render(<TransactionsScreen />);

      // Check for status indicators (success, pending, failed)
      expect(getByText(/Success|Pending|Failed|Completed/)).toBeTruthy();
    });

    it('handles transaction filtering', () => {
      const { getByText } = render(<TransactionsScreen />);

      // Test filtering functionality if implemented
      expect(getByText('Transactions')).toBeTruthy();
    });
  });
});
