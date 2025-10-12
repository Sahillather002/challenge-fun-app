import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Animated,
  Platform,
} from 'react-native';
import { Card, Title, Paragraph, Button, ProgressBar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import GoogleFitService from '../services/GoogleFitService';
import { useTheme } from '../context/ThemeContext';

interface GoogleFitCardProps {
  onStepsUpdate?: (steps: number) => void;
  competitionId?: string;
}

const GoogleFitCard: React.FC<GoogleFitCardProps> = ({
  onStepsUpdate,
  competitionId
}) => {
  const [steps, setSteps] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(10000);
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pulseAnimation] = useState(new Animated.Value(1));
  const { theme } = useTheme();

  const googleFitService = GoogleFitService.getInstance();

  useEffect(() => {
    const initializeConnection = async () => {
      // Check if we're returning from OAuth
      const urlToken = googleFitService.checkUrlForToken();
      const authPending = Platform.OS === 'web' ?
        localStorage.getItem('google_fit_auth_pending') === 'true' : false;

      if (urlToken) {
        console.log('OAuth callback detected, token received');
        if (Platform.OS === 'web') {
          localStorage.removeItem('google_fit_auth_pending');
        }
        setConnected(true);
        await fetchSteps();
        if (Platform.OS === 'web') {
          alert('Google Fit connected successfully!');
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
      const isAuthorized = await googleFitService.isAuthorizedCheck();
      setConnected(isAuthorized);
    } catch (error) {
      console.error('Error checking Google Fit connection:', error);
    }
  };

  const connectGoogleFit = async () => {
    setLoading(true);
    try {
      // Start the OAuth flow - will redirect to Google and back
      const authorized = await googleFitService.authorize();

      if (authorized) {
        setConnected(true);
        if (Platform.OS === 'web') {
          alert('Google Fit connected successfully!');
        } else {
          Alert.alert('Success', 'Google Fit connected successfully!');
        }
        await fetchSteps();
      } else {
        if (Platform.OS === 'web') {
          alert('Failed to connect to Google Fit. Please try again.');
        } else {
          Alert.alert('Error', 'Failed to connect to Google Fit');
        }
      }
    } catch (error: any) {
      console.error('Connection error:', error);
      if (Platform.OS === 'web') {
        alert('Failed to connect to Google Fit: ' + error.message);
      } else {
        Alert.alert('Error', 'Failed to connect to Google Fit: ' + error.message);
      }
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
      setError(errorMessage);
      
      // If authentication failed, disconnect
      if (errorMessage.includes('Authentication failed')) {
        setConnected(false);
      }
      
      if (Platform.OS === 'web') {
        alert('Error fetching steps: ' + errorMessage);
      } else {
        Alert.alert('Error', 'Failed to fetch steps: ' + errorMessage);
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
          <TouchableOpacity
            style={[
              styles.statusDot,
              { backgroundColor: connected ? '#4CAF50' : '#FF5252' }
            ]}
          />
        </View>

        {!connected ? (
          <View style={styles.connectContainer}>
            <Paragraph style={[styles.connectText, { color: theme.colors.onSurfaceVariant }]}>
              Connect Google Fit to track your steps automatically
            </Paragraph>
            {error && (
              <Text style={[styles.errorText, { color: '#FF5252' }]}>
                {error}
              </Text>
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
});

export default GoogleFitCard;