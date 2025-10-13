import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
} from 'react-native';
import { Card, Title, Paragraph, Button, ProgressBar, Snackbar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import GoogleFitService from '../services/GoogleFitService';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { firebaseHelpers } from '../utils/firebaseHelpers';

interface GoogleFitCardProps {
  onStepsUpdate?: (steps: number) => void;
  competitionId?: string;
  navigation?: any;
}

const GoogleFitCard: React.FC<GoogleFitCardProps> = ({
  onStepsUpdate,
  competitionId,
  navigation
}) => {
  const [steps, setSteps] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(10000);
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [pulseAnimation] = useState(new Animated.Value(1));
  const { theme } = useTheme();
  const { user } = useAuth();

  const showToast = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const googleFitService = GoogleFitService.getInstance();
  
  // Enable mock data for development/testing without Android device
  // Set to false when testing with real Android device
  const USE_MOCK_DATA = true; // Change to false for production
  
  useEffect(() => {
    googleFitService.enableMockData(USE_MOCK_DATA);
  }, []);

  useEffect(() => {
    const initializeConnection = async () => {
      // Check if we're returning from OAuth
      const urlToken = googleFitService.checkUrlForToken();
      const authPending = Platform.OS === 'web' ?
        localStorage.getItem('google_fit_auth_pending') === 'true' : false;

      if (urlToken) {
        console.log('OAuth callback detected, token received:', urlToken.substring(0, 20) + '...');
        
        // IMPORTANT: Save the token to storage
        try {
          if (Platform.OS === 'web') {
            localStorage.setItem('google_fit_token', urlToken);
            localStorage.removeItem('google_fit_auth_pending');
          }
          
          // Update the service instance with the token
          googleFitService.setAccessToken(urlToken);
          
          // Close this window if it was opened as a popup/tab
          if (Platform.OS === 'web' && window.opener) {
            // This is the OAuth callback window - notify parent and close
            try {
              window.opener.postMessage({ type: 'GOOGLE_FIT_AUTH_SUCCESS' }, window.location.origin);
              setTimeout(() => window.close(), 500); // Small delay to ensure message is sent
            } catch (e) {
              console.log('Could not close window, user will need to manually close it');
            }
          }
          
          setConnected(true);
          await fetchSteps();
          
          if (Platform.OS === 'web' && !window.opener) {
            showToast('Google Fit connected successfully!');
          }
        } catch (error) {
          console.error('Error saving token:', error);
        }
      } else if (authPending) {
        // We expected a token but didn't get one - auth was cancelled
        if (Platform.OS === 'web') {
          localStorage.removeItem('google_fit_auth_pending');
          console.log('OAuth flow was cancelled or failed');
        }
      } else {
        // Normal connection check
        await checkConnection();
      }
    };

    initializeConnection();

    // Listen for messages from OAuth callback window
    if (Platform.OS === 'web') {
      const handleMessage = async (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;
        
        if (event.data.type === 'GOOGLE_FIT_AUTH_SUCCESS') {
          console.log('Received auth success message from OAuth tab');
          
          // Reload token from storage (it was saved in the other tab)
          const storedToken = localStorage.getItem('google_fit_token');
          if (storedToken) {
            googleFitService.setAccessToken(storedToken);
          }
          
          setConnected(true);
          setError(null);
          await fetchSteps();
          showToast('Google Fit connected successfully!');
        }
      };

      window.addEventListener('message', handleMessage);
      return () => window.removeEventListener('message', handleMessage);
    }
  }, []);

  useEffect(() => {
    if (connected) {
      fetchSteps();
      const interval = setInterval(fetchSteps, 60000); // Update every minute
      return () => clearInterval(interval);
    }
  }, [connected]);

  const checkConnection = async () => {
    try {
      console.log('🔍 Checking Google Fit connection...');
      
      // Check local token only (Firestore has issues)
      const isAuthorized = await googleFitService.isAuthorizedCheck();
      console.log('Is authorized (local token):', isAuthorized);
      
      setConnected(isAuthorized);
      
      if (isAuthorized) {
        console.log('✅ Connected via local token');
        // Auto-fetch steps if connected
        await fetchSteps();
      }
    } catch (error) {
      console.error('Error checking Google Fit connection:', error);
    }
  };

  const connectGoogleFit = async () => {
    setLoading(true);
    setError(null);
    try {
      // Start the OAuth flow - will open new tab for web
      const authorized = await googleFitService.authorize();

      // For web with new tab flow, authorized will be false (auth happens in new tab)
      // For native, authorized will be true/false immediately
      if (Platform.OS === 'web' && !authorized) {
        // Web: New tab opened, waiting for callback
        console.log('OAuth window opened, waiting for user to complete authentication...');
        setError('Please complete authentication in the new tab...');
        // Don't show error - the message listener will handle success
        setLoading(false);
        return;
      }

      // Native or immediate success
      if (authorized) {
        // Save connection to Firestore
        if (user?.id) {
          await firebaseHelpers.firestore.setDoc('users', user.id, {
            googleFit: {
              connected: true,
              connectedAt: new Date().toISOString(),
              email: user.email,
              autoSync: true,
            }
          });
        }
        
        setConnected(true);
        showToast('Google Fit connected successfully!');
        await fetchSteps();
      }
    } catch (error: any) {
      console.error('Connection error:', error);
      setError(error.message);
      showToast('Failed to connect: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSteps = async () => {
    try {
      setError(null);
      console.log('Fetching steps from Google Fit...');
      const todaySteps = await googleFitService.getTodaySteps();
      console.log('Steps fetched successfully:', todaySteps);
      setSteps(todaySteps);
      setLastSync(new Date());
      onStepsUpdate?.(todaySteps);

      // Animate the step counter
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1.2,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } catch (error: any) {
      console.error('Error fetching steps:', error);
      const errorMessage = error.message || 'Failed to fetch steps';
      
      // Handle token expiration
      if (errorMessage === 'TOKEN_EXPIRED') {
        console.log('🔄 Token expired, need to reconnect');
        setConnected(false);
        setError('Session expired. Please reconnect to Google Fit.');
        showToast('Session expired. Please reconnect to Google Fit.');
      } else {
        setError(errorMessage);
        showToast('Error fetching steps: ' + errorMessage);
        
        // If authentication failed, disconnect
        if (errorMessage.includes('Authentication failed')) {
          setConnected(false);
        }
      }
    }
  };

  const syncSteps = async () => {
    setLoading(true);
    await fetchSteps();
    setLoading(false);
  };

  const progress = Math.min(steps / dailyGoal, 1);
  const progressPercentage = Math.round(progress * 100);

  return (
    <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
      <Card.Content>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Icon
              name="google-fit"
              size={24}
              color={theme.colors.primary}
            />
            <Title style={[styles.title, { color: theme.colors.onSurface }]}>
              Google Fit
            </Title>
          </View>
          <View style={styles.headerRight}>
            {navigation && (
              <TouchableOpacity
                onPress={() => navigation.navigate('GoogleFitAccount')}
                style={styles.settingsButton}
              >
                <Icon name="cog" size={20} color={theme.colors.onSurfaceVariant} />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[
                styles.statusDot,
                { backgroundColor: connected ? '#4CAF50' : '#FF5252' }
              ]}
            />
          </View>
        </View>

        {!connected ? (
          <View style={styles.connectContainer}>
            <Paragraph style={[styles.connectText, { color: theme.colors.onSurfaceVariant }]}>
              Connect Google Fit to track your steps automatically
            </Paragraph>
            {error && (
              <View style={[
                styles.messageContainer,
                { backgroundColor: error.includes('Please complete') ? '#E3F2FD' : '#FFEBEE' }
              ]}>
                <Icon 
                  name={error.includes('Please complete') ? 'information' : 'alert-circle'} 
                  size={20} 
                  color={error.includes('Please complete') ? '#1976D2' : '#FF5252'} 
                />
                <Text style={[
                  styles.messageText, 
                  { color: error.includes('Please complete') ? '#1976D2' : '#FF5252' }
                ]}>
                  {error}
                </Text>
              </View>
            )}
            <Button
              mode="contained"
              onPress={connectGoogleFit}
              loading={loading}
              disabled={loading}
              style={[styles.connectButton, { backgroundColor: theme.colors.primary }]}
            >
              {loading ? 'Connecting...' : 'Connect Google Fit'}
            </Button>
          </View>
        ) : (
          <View style={styles.connectedContainer}>
            {error && (
              <View style={styles.errorContainer}>
                <Icon name="alert-circle" size={20} color="#FF5252" />
                <Text style={[styles.errorText, { color: '#FF5252' }]}>
                  {error}
                </Text>
              </View>
            )}
            <View style={styles.stepsContainer}>
              <Animated.View style={{ transform: [{ scale: pulseAnimation }] }}>
                <Text style={[styles.stepsNumber, { color: theme.colors.primary }]}>
                  {steps.toLocaleString()}
                </Text>
              </Animated.View>
              <Text style={[styles.stepsLabel, { color: theme.colors.onSurfaceVariant }]}>
                steps today
              </Text>
            </View>

            <View style={styles.progressContainer}>
              <View style={styles.progressHeader}>
                <Text style={[styles.progressText, { color: theme.colors.onSurfaceVariant }]}>
                  Daily Goal
                </Text>
                <Text style={[styles.progressPercentage, { color: theme.colors.primary }]}>
                  {progressPercentage}%
                </Text>
              </View>
              <ProgressBar
                progress={progress}
                color={theme.colors.primary}
                style={styles.progressBar}
              />
              <Text style={[styles.goalText, { color: theme.colors.onSurfaceVariant }]}>
                {steps.toLocaleString()} / {dailyGoal.toLocaleString()} steps
              </Text>
            </View>

            <View style={styles.syncContainer}>
              <TouchableOpacity
                style={[styles.syncButton, { backgroundColor: theme.colors.surfaceVariant }]}
                onPress={syncSteps}
                disabled={loading}
              >
                <Icon
                  name="refresh"
                  size={20}
                  color={theme.colors.primary}
                />
                <Text style={[styles.syncText, { color: theme.colors.primary }]}>
                  {loading ? 'Syncing...' : 'Sync Now'}
                </Text>
              </TouchableOpacity>

              {lastSync && (
                <Text style={[styles.lastSyncText, { color: theme.colors.onSurfaceVariant }]}>
                  Last sync: {lastSync.toLocaleTimeString()}
                </Text>
              )}
            </View>
          </View>
        )}
      </Card.Content>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        action={{
          label: 'OK',
          onPress: () => setSnackbarVisible(false),
        }}
        style={{ backgroundColor: theme.colors.surface }}
      >
        {snackbarMessage}
      </Snackbar>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 16,
    elevation: 4,
    borderRadius: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    marginLeft: 8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingsButton: {
    padding: 4,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  connectContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  connectText: {
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 16,
  },
  connectButton: {
    borderRadius: 8,
  },
  connectedContainer: {
    paddingVertical: 8,
  },
  stepsContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  stepsNumber: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  stepsLabel: {
    fontSize: 16,
    marginTop: 4,
  },
  progressContainer: {
    marginVertical: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  goalText: {
    fontSize: 12,
    textAlign: 'center',
  },
  syncContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  syncButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  syncText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  lastSyncText: {
    fontSize: 12,
    marginTop: 8,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
    marginLeft: 8,
    textAlign: 'center',
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginVertical: 12,
  },
  messageText: {
    fontSize: 14,
    marginLeft: 8,
    textAlign: 'center',
    flex: 1,
  },
});

export default GoogleFitCard;