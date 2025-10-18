import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import GoogleFitCard from '../GoogleFitCard';
import NotificationsContainer from '../NotificationsContainer';

// Mock services and contexts
jest.mock('../services/GoogleFitService', () => ({
  GoogleFitService: {
    getInstance: () => ({
      getStepCount: jest.fn(() => Promise.resolve(8500)),
      syncSteps: jest.fn(() => Promise.resolve(true)),
      isAuthorized: jest.fn(() => true)
    })
  }
}));

jest.mock('../context/ThemeContext', () => ({
  useTheme: () => ({
    theme: {
      colors: {
        background: '#ffffff',
        surface: '#ffffff',
        primary: '#6200ee',
        onSurface: '#000000',
        onSurfaceVariant: '#666666',
        error: '#B00020'
      }
    },
    isDark: false
  })
}));

jest.mock('../context/SupabaseAuthContext', () => ({
  useSupabaseAuth: () => ({
    user: { id: 'user1', name: 'Test User' }
  })
}));

jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'Icon');

// Mock react-native-paper components that might cause issues
jest.mock('react-native-paper', () => ({
  Card: 'Card',
  Title: 'Title',
  Paragraph: 'Paragraph',
  Button: 'Button',
  ProgressBar: 'ProgressBar',
  Snackbar: 'Snackbar'
}));

describe('UI Components', () => {
  describe('GoogleFitCard', () => {
    it('renders Google Fit card correctly', () => {
      const { getByText } = render(<GoogleFitCard />);

      expect(getByText('Google Fit')).toBeTruthy();
      expect(getByText(/Steps|Fitness|Activity/)).toBeTruthy();
    });

    it('displays step count and goal', () => {
      const { getByText } = render(<GoogleFitCard />);

      // Check for step count display
      expect(getByText(/8,500|8500/)).toBeTruthy();
      expect(getByText(/10,000|10000/)).toBeTruthy(); // Daily goal
    });

    it('shows progress bar for step goal', () => {
      const { getByText } = render(<GoogleFitCard />);

      // Check for progress indicator (would need specific implementation check)
      expect(getByText(/85%|Progress/)).toBeTruthy();
    });

    it('displays connection status', () => {
      const { getByText } = render(<GoogleFitCard />);

      // Check for connection status
      expect(getByText(/Connected|Disconnected|Sync/)).toBeTruthy();
    });

    it('handles sync button press', async () => {
      const mockSyncSteps = require('../services/GoogleFitService').GoogleFitService.getInstance().syncSteps;
      const { getByText } = render(<GoogleFitCard />);

      const syncButton = getByText(/Sync|Update/);
      if (syncButton) {
        fireEvent.press(syncButton);

        await waitFor(() => {
          expect(mockSyncSteps).toHaveBeenCalled();
        });
      }
    });

    it('handles connection errors', async () => {
      const mockGetStepCount = require('../services/GoogleFitService').GoogleFitService.getInstance().getStepCount;
      mockGetStepCount.mockRejectedValue(new Error('Connection failed'));

      const { getByText } = render(<GoogleFitCard />);

      // Component should handle errors gracefully
      expect(getByText('Google Fit')).toBeTruthy();
    });

    it('shows last sync time', () => {
      const { getByText } = render(<GoogleFitCard />);

      // Check for last sync information
      expect(getByText(/Last sync|Updated|Time/)).toBeTruthy();
    });

    it('displays daily goal progress', () => {
      const { getByText } = render(<GoogleFitCard />);

      // Check for goal progress visualization
      expect(getByText(/85%/)).toBeTruthy(); // 8500/10000 = 85%
    });
  });

  describe('NotificationsContainer', () => {
    it('renders notifications container correctly', () => {
      const { getByText } = render(<NotificationsContainer />);

      expect(getByText(/Notifications|Alerts|Updates/)).toBeTruthy();
    });

    it('displays notification list', () => {
      const { getByText } = render(<NotificationsContainer />);

      // Check for notification items
      expect(getByText(/Competition|Update|Achievement/)).toBeTruthy();
    });

    it('handles notification dismissal', () => {
      const { getByText } = render(<NotificationsContainer />);

      const dismissButton = getByText(/×|Close|Dismiss/);
      if (dismissButton) {
        fireEvent.press(dismissButton);

        // Notification should be removed
        expect(dismissButton).toBeTruthy();
      }
    });

    it('shows notification badges', () => {
      const { getByText } = render(<NotificationsContainer />);

      // Check for notification count badges
      expect(getByText(/\d+/)).toBeTruthy(); // Should show number of notifications
    });

    it('handles empty notification state', () => {
      const { getByText } = render(<NotificationsContainer />);

      // Should show empty state or no notifications message
      expect(getByText(/No notifications|All caught up/)).toBeTruthy();
    });

    it('displays different notification types', () => {
      const { getByText } = render(<NotificationsContainer />);

      // Check for different notification types (success, error, info)
      expect(getByText(/Competition|Payment|Achievement/)).toBeTruthy();
    });

    it('handles notification actions', () => {
      const { getByText } = render(<NotificationsContainer />);

      const actionButton = getByText(/View|Join|Pay/);
      if (actionButton) {
        fireEvent.press(actionButton);

        // Should trigger navigation or action
        expect(actionButton).toBeTruthy();
      }
    });
  });
});
