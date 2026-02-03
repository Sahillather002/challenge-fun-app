import React from 'react';
import { render, act } from '@testing-library/react-native';
import { View } from 'react-native';
import { ThemeProvider, useTheme } from '../ThemeContext';
import { ToastProvider, useToast } from '../ToastContext';
import { SupabaseAuthProvider, useSupabaseAuth } from '../SupabaseAuthContext';
import { CompetitionProvider, useCompetition } from '../MockCompetitionContext';

// Mock react-native-vector-icons
jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'Icon');

// Mock fetch to prevent network errors
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([]),
  })
);

describe('Context Providers', () => {
  describe('ThemeContext', () => {
    const TestComponent = () => {
      const { theme, isDark, toggleTheme } = useTheme();
      return (
        <View testID="test-component">
          <View testID="theme-colors" style={{ backgroundColor: theme.colors.primary }} />
        </View>
      );
    };

    it('provides theme context with default values', async () => {
      const { getByTestId } = await act(async () => 
        render(
          <ThemeProvider>
            <TestComponent />
          </ThemeProvider>
        )
      );

      expect(getByTestId('test-component')).toBeTruthy();
      expect(getByTestId('theme-colors')).toBeTruthy();
    });

    it('provides light theme by default', async () => {
      const { getByTestId } = await act(async () =>
        render(
          <ThemeProvider>
            <TestComponent />
          </ThemeProvider>
        )
      );

      const themeElement = getByTestId('theme-colors');
      expect(themeElement.props.style.backgroundColor).toBe('#6200ee'); // Default primary color
    });
  });

  describe('ToastContext', () => {
    const TestComponent = () => {
      const toast = useToast();
      return (
        <View>
          <View testID="toast-success" onPress={() => toast.success('Success message')} />
          <View testID="toast-error" onPress={() => toast.error('Error message')} />
          <View testID="toast-info" onPress={() => toast.info('Info message')} />
        </View>
      );
    };

    it('provides toast context methods', async () => {
      const { getByTestId } = await act(async () =>
        render(
          <ThemeProvider>
            <ToastProvider>
              <TestComponent />
            </ToastProvider>
          </ThemeProvider>
        )
      );

      expect(getByTestId('toast-success')).toBeTruthy();
      expect(getByTestId('toast-error')).toBeTruthy();
      expect(getByTestId('toast-info')).toBeTruthy();
    });

    it('handles success toast', async () => {
      const { getByTestId } = await act(async () =>
        render(
          <ThemeProvider>
            <ToastProvider>
              <TestComponent />
            </ToastProvider>
          </ThemeProvider>
        )
      );

      const successButton = getByTestId('toast-success');

      await act(async () => {
        successButton.props.onPress();
      });

      // Toast should be added to state (implementation detail would be tested here)
    });

    it('handles error toast', async () => {
      const { getByTestId } = await act(async () =>
        render(
          <ThemeProvider>
            <ToastProvider>
              <TestComponent />
            </ToastProvider>
          </ThemeProvider>
        )
      );

      const errorButton = getByTestId('toast-error');

      await act(async () => {
        errorButton.props.onPress();
      });

      // Toast should be added to state (implementation detail would be tested here)
    });
  });

  describe('SupabaseAuthContext', () => {
    const TestComponent = () => {
      const { user, login, loading } = useSupabaseAuth();
      return (
        <View testID="auth-component">
          <View testID="user-info">{user ? 'logged-in' : 'logged-out'}</View>
          <View testID="loading-status">{loading ? 'loading' : 'not-loading'}</View>
        </View>
      );
    };

    it('provides auth context with default values', async () => {
      const { getByTestId } = await act(async () =>
        render(
          <SupabaseAuthProvider>
            <TestComponent />
          </SupabaseAuthProvider>
        )
      );

      expect(getByTestId('auth-component')).toBeTruthy();
      expect(getByTestId('user-info')).toBeTruthy();
      expect(getByTestId('loading-status')).toBeTruthy();
    });

    it('shows logged out state by default', async () => {
      const { getByTestId } = await act(async () =>
        render(
          <SupabaseAuthProvider>
            <TestComponent />
          </SupabaseAuthProvider>
        )
      );

      expect(getByTestId('user-info').children[0]).toBe('logged-out');
    });
  });

  describe('CompetitionContext', () => {
    const TestComponent = () => {
      const { competitions, joinCompetition, loading } = useCompetition();
      return (
        <View testID="competition-component">
          <View testID="competitions-count">{competitions.length.toString()}</View>
          <View testID="loading-status">{loading ? 'loading' : 'not-loading'}</View>
        </View>
      );
    };

    it('provides competition context with default values', async () => {
      const { getByTestId } = await act(async () =>
        render(
          <SupabaseAuthProvider>
            <CompetitionProvider>
              <TestComponent />
            </CompetitionProvider>
          </SupabaseAuthProvider>
        )
      );

      expect(getByTestId('competition-component')).toBeTruthy();
      expect(getByTestId('competitions-count')).toBeTruthy();
      expect(getByTestId('loading-status')).toBeTruthy();
    });

    it('shows empty competitions array by default', async () => {
      const { getByTestId } = await act(async () =>
        render(
          <SupabaseAuthProvider>
            <CompetitionProvider>
              <TestComponent />
            </CompetitionProvider>
          </SupabaseAuthProvider>
        )
      );

      expect(getByTestId('competitions-count').children[0]).toBe('0');
    });
  });

  describe('Context Integration', () => {
    const IntegratedTestComponent = () => {
      const { theme } = useTheme();
      const toast = useToast();
      const { user } = useSupabaseAuth();
      const { competitions } = useCompetition();

      return (
        <View testID="integrated-component">
          <View testID="theme-available" style={{ backgroundColor: theme.colors.primary }}>
            Theme: {theme.colors.primary}
          </View>
          <View testID="toast-available" onPress={() => toast.success('Test')}>
            Toast Available
          </View>
          <View testID="auth-available">
            Auth: {user ? 'logged-in' : 'logged-out'}
          </View>
          <View testID="competitions-available">
            Competitions: {competitions.length}
          </View>
        </View>
      );
    };

    it('integrates all contexts properly', async () => {
      const { getByTestId } = await act(async () =>
        render(
          <ThemeProvider>
            <ToastProvider>
              <SupabaseAuthProvider>
                <CompetitionProvider>
                  <IntegratedTestComponent />
                </CompetitionProvider>
              </SupabaseAuthProvider>
            </ToastProvider>
          </ThemeProvider>
        )
      );

      expect(getByTestId('integrated-component')).toBeTruthy();
      expect(getByTestId('theme-available')).toBeTruthy();
      expect(getByTestId('toast-available')).toBeTruthy();
      expect(getByTestId('auth-available')).toBeTruthy();
      expect(getByTestId('competitions-available')).toBeTruthy();
    });
  });
});
