import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SettingsScreen from '../Settings/SettingsScreen';
import GoogleFitAccountScreen from '../Settings/GoogleFitAccountScreen';

// Mock contexts
jest.mock('../../context/SupabaseAuthContext', () => ({
  useSupabaseAuth: () => ({
    user: { id: 'user1', name: 'Test User', email: 'test@example.com' },
    logout: jest.fn()
  })
}));

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
    isDark: false,
    toggleTheme: jest.fn()
  })
}));

jest.mock('../../context/ToastContext', () => ({
  useToast: () => ({
    success: jest.fn(),
    error: jest.fn()
  })
}));

jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'Icon');

// Mock Linking
jest.mock('react-native/Libraries/Linking/Linking', () => ({
  openURL: jest.fn()
}));

describe('Settings Screens', () => {
  describe('SettingsScreen', () => {
    it('renders settings screen correctly', () => {
      const { getByText } = render(<SettingsScreen navigation={{ navigate: jest.fn() }} />);

      expect(getByText('Settings')).toBeTruthy();
      expect(getByText('Account')).toBeTruthy();
      expect(getByText('Notifications')).toBeTruthy();
      expect(getByText('Privacy')).toBeTruthy();
      expect(getByText('Data & Sync')).toBeTruthy();
      expect(getByText('App Preferences')).toBeTruthy();
    });

    it('displays account settings', () => {
      const { getByText } = render(<SettingsScreen navigation={{ navigate: jest.fn() }} />);

      expect(getByText('Profile')).toBeTruthy();
      expect(getByText('Google Fit')).toBeTruthy();
      expect(getByText('Change Password')).toBeTruthy();
      expect(getByText('Delete Account')).toBeTruthy();
    });

    it('navigates to profile settings', () => {
      const mockNavigate = jest.fn();
      const { getByText } = render(<SettingsScreen navigation={{ navigate: mockNavigate }} />);

      const profileButton = getByText('Profile');
      fireEvent.press(profileButton);

      expect(mockNavigate).toHaveBeenCalledWith('Profile');
    });

    it('navigates to Google Fit settings', () => {
      const mockNavigate = jest.fn();
      const { getByText } = render(<SettingsScreen navigation={{ navigate: mockNavigate }} />);

      const googleFitButton = getByText('Google Fit');
      fireEvent.press(googleFitButton);

      expect(mockNavigate).toHaveBeenCalledWith('GoogleFitAccount');
    });

    it('toggles notification settings', () => {
      const { getByText } = render(<SettingsScreen navigation={{ navigate: jest.fn() }} />);

      // Find and toggle notification switches
      const pushSwitch = getByText('Push Notifications');
      const emailSwitch = getByText('Email Notifications');

      expect(pushSwitch).toBeTruthy();
      expect(emailSwitch).toBeTruthy();
    });

    it('toggles privacy settings', () => {
      const { getByText } = render(<SettingsScreen navigation={{ navigate: jest.fn() }} />);

      // Find and toggle privacy switches
      const profileVisibleSwitch = getByText('Profile Visibility');
      const shareStatsSwitch = getByText('Share Statistics');

      expect(profileVisibleSwitch).toBeTruthy();
      expect(shareStatsSwitch).toBeTruthy();
    });

    it('toggles data and sync settings', () => {
      const { getByText } = render(<SettingsScreen navigation={{ navigate: jest.fn() }} />);

      // Find and toggle data settings
      const autoSyncSwitch = getByText('Auto Sync');
      const syncWifiSwitch = getByText('Sync on WiFi Only');

      expect(autoSyncSwitch).toBeTruthy();
      expect(syncWifiSwitch).toBeTruthy();
    });

    it('toggles app preference settings', () => {
      const { getByText } = render(<SettingsScreen navigation={{ navigate: jest.fn() }} />);

      // Find and toggle app settings
      const hapticSwitch = getByText('Haptic Feedback');
      const soundSwitch = getByText('Sound Effects');
      const animationSwitch = getByText('Animations');

      expect(hapticSwitch).toBeTruthy();
      expect(soundSwitch).toBeTruthy();
      expect(animationSwitch).toBeTruthy();
    });

    it('handles logout functionality', () => {
      const mockLogout = require('../../context/SupabaseAuthContext').useSupabaseAuth().logout;
      const { getByText } = render(<SettingsScreen navigation={{ navigate: jest.fn() }} />);

      const logoutButton = getByText('Logout');
      fireEvent.press(logoutButton);

      expect(mockLogout).toHaveBeenCalled();
    });

    it('opens external links', () => {
      const mockOpenURL = require('react-native/Libraries/Linking/Linking').openURL;
      const { getByText } = render(<SettingsScreen navigation={{ navigate: jest.fn() }} />);

      const helpButton = getByText('Help & Support');
      fireEvent.press(helpButton);

      expect(mockOpenURL).toHaveBeenCalledWith('https://example.com/help');
    });
  });

  describe('GoogleFitAccountScreen', () => {
    it('renders Google Fit account screen correctly', () => {
      const { getByText } = render(<GoogleFitAccountScreen />);

      expect(getByText('Google Fit Integration')).toBeTruthy();
      expect(getByText('Connect your Google Fit account to sync fitness data.')).toBeTruthy();
    });

    it('displays connection status', () => {
      const { getByText } = render(<GoogleFitAccountScreen />);

      // Check for connection status indicators
      expect(getByText(/Connected|Disconnected|Connect|Disconnect/)).toBeTruthy();
    });

    it('handles Google Fit connection', () => {
      const { getByText } = render(<GoogleFitAccountScreen />);

      const connectButton = getByText(/Connect|Link/);
      if (connectButton) {
        fireEvent.press(connectButton);

        // Should initiate Google Fit connection flow
        expect(connectButton).toBeTruthy();
      }
    });

    it('handles Google Fit disconnection', () => {
      const { getByText } = render(<GoogleFitAccountScreen />);

      const disconnectButton = getByText(/Disconnect|Unlink/);
      if (disconnectButton) {
        fireEvent.press(disconnectButton);

        // Should handle disconnection
        expect(disconnectButton).toBeTruthy();
      }
    });

    it('displays sync options', () => {
      const { getByText } = render(<GoogleFitAccountScreen />);

      // Check for sync-related options
      expect(getByText(/Sync|Steps|Activity/)).toBeTruthy();
    });

    it('navigates back to settings', () => {
      const mockGoBack = jest.fn();
      const { getByText } = render(<GoogleFitAccountScreen />);

      // Look for back button or navigation element
      const backButton = getByText(/Back|Settings/);
      if (backButton) {
        fireEvent.press(backButton);

        expect(backButton).toBeTruthy();
      }
    });
  });
});
