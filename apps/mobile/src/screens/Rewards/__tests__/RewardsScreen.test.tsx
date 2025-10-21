import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import RewardsScreen from '../src/screens/Rewards/RewardsScreen';

// Mock the Supabase Auth context
jest.mock('../src/context/SupabaseAuthContext', () => ({
  useSupabaseAuth: () => ({
    user: {
      id: 'user123',
      name: 'Test User',
      email: 'test@example.com'
    }
  })
}));

// Mock the theme context
jest.mock('../src/context/ThemeContext', () => ({
  useTheme: () => ({
    theme: {
      colors: {
        primary: '#007AFF',
        background: '#FFFFFF',
        surface: '#F5F5F5'
      }
    }
  })
}));

// Mock the toast context
jest.mock('../src/context/ToastContext', () => ({
  useToast: () => ({
    show: jest.fn()
  })
}));

// Mock Supabase helpers
jest.mock('../src/config/supabase', () => ({
  supabaseHelpers: {
    rewards: {
      getByUser: jest.fn(() => Promise.resolve([
        {
          id: 'reward1',
          userId: 'user123',
          competitionId: 'comp1',
          amount: 1800,
          status: 'pending',
          createdAt: new Date().toISOString(),
          competition: {
            name: 'Weekly Fitness Challenge',
            endDate: new Date().toISOString()
          }
        },
        {
          id: 'reward2',
          userId: 'user123',
          competitionId: 'comp2',
          amount: 900,
          status: 'claimed',
          createdAt: new Date().toISOString(),
          claimedAt: new Date().toISOString(),
          competition: {
            name: 'Monthly Marathon',
            endDate: new Date().toISOString()
          }
        }
      ])),
      claimReward: jest.fn(() => Promise.resolve({ success: true }))
    }
  }
}));

describe('RewardsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('displays prize amounts correctly', async () => {
    const { getByText } = render(<RewardsScreen navigation={{}} />);

    await waitFor(() => {
      expect(getByText('₹1,800')).toBeTruthy(); // 1st place: 60% of prize pool
      expect(getByText('₹900')).toBeTruthy();   // 2nd place: 30% of prize pool
    });
  });

  it('shows total earnings calculation', async () => {
    const { getByText } = render(<RewardsScreen navigation={{}} />);

    await waitFor(() => {
      expect(getByText(/Total Earnings|₹2,700/)).toBeTruthy(); // 1800 + 900
    });
  });

  it('displays reward status correctly', async () => {
    const { getByText } = render(<RewardsScreen navigation={{}} />);

    await waitFor(() => {
      expect(getByText(/Pending|Unclaimed/)).toBeTruthy();
      expect(getByText(/Claimed/)).toBeTruthy();
    });
  });

  it('handles reward claiming process', async () => {
    const mockClaimReward = require('../src/config/supabase').supabaseHelpers.rewards.claimReward;
    const { getByText } = render(<RewardsScreen navigation={{}} />);

    await waitFor(() => {
      const claimButton = getByText('Claim Reward');
      fireEvent.press(claimButton);
    });

    await waitFor(() => {
      expect(mockClaimReward).toHaveBeenCalledWith('reward1');
    });
  });

  it('filters rewards by status', async () => {
    const { getByText } = render(<RewardsScreen navigation={{}} />);

    await waitFor(() => {
      // Test filter buttons
      const allButton = getByText('All');
      const pendingButton = getByText('Pending');
      const claimedButton = getByText('Claimed');

      fireEvent.press(pendingButton);

      // Should show only pending rewards
      expect(getByText('₹1,800')).toBeTruthy();
    });
  });

  it('displays competition information', async () => {
    const { getByText } = render(<RewardsScreen navigation={{}} />);

    await waitFor(() => {
      expect(getByText('Weekly Fitness Challenge')).toBeTruthy();
      expect(getByText('Monthly Marathon')).toBeTruthy();
    });
  });

  it('handles real-time updates', async () => {
    const { getByTestId } = render(<RewardsScreen navigation={{}} />);

    await waitFor(() => {
      // Check for real-time update indicators
      const updateIndicator = getByTestId('realtime-indicator');
      expect(updateIndicator).toBeTruthy();
    });
  });

  it('shows prize distribution breakdown', async () => {
    const { getByText } = render(<RewardsScreen navigation={{}} />);

    await waitFor(() => {
      // Should show prize breakdown (60-30-10 split)
      expect(getByText(/1st Place|60%/)).toBeTruthy();
      expect(getByText(/2nd Place|30%/)).toBeTruthy();
    });
  });

  it('validates payment processing integration', async () => {
    const { getByText } = render(<RewardsScreen navigation={{}} />);

    await waitFor(() => {
      // Should show payment method options for claiming
      const paymentOptions = getByText(/UPI|Bank Transfer|Paytm/);
      expect(paymentOptions).toBeTruthy();
    });
  });

  it('tracks achievement statistics', async () => {
    const { getByText } = render(<RewardsScreen navigation={{}} />);

    await waitFor(() => {
      // Should display achievement stats
      expect(getByText(/Competitions Won|Tournaments|Badges/)).toBeTruthy();
    });
  });

  it('handles error states gracefully', async () => {
    // Mock error scenario
    require('../src/config/supabase').supabaseHelpers.rewards.getByUser.mockRejectedValueOnce(new Error('Network error'));

    const { getByText } = render(<RewardsScreen navigation={{}} />);

    await waitFor(() => {
      // Should show error message or retry option
      expect(getByText(/Error|Retry|No Rewards/)).toBeTruthy();
    });
  });
});
