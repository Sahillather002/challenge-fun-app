import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import { Card, Button, List, Divider, Switch, ActivityIndicator } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import GoogleFitService from '../../services/GoogleFitService';
import { firebaseHelpers } from '../../utils/firebaseHelpers';

const GoogleFitAccountScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [autoSync, setAutoSync] = useState(true);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [accountEmail, setAccountEmail] = useState<string | null>(null);

  const googleFitService = GoogleFitService.getInstance();

  useEffect(() => {
    loadGoogleFitStatus();

    // Listen for OAuth success message from popup (web only)
    const handleMessage = async (event: MessageEvent) => {
      if (event.data?.type === 'GOOGLE_FIT_AUTH_SUCCESS') {
        console.log('✅ OAuth success received in GoogleFitAccountScreen');
        setConnected(true);
        setAccountEmail(user?.email || null);
        setLastSync(new Date());
        setConnecting(false);
      }
    };

    if (Platform.OS === 'web') {
      window.addEventListener('message', handleMessage);
      return () => window.removeEventListener('message', handleMessage);
    }
  }, []);

  const loadGoogleFitStatus = async () => {
    try {
      setLoading(true);
      
      // Check if Google Fit is connected (localStorage only)
      const isAuthorized = await googleFitService.isAuthorizedCheck();
      setConnected(isAuthorized);

      if (isAuthorized && user?.email) {
        setAccountEmail(user.email);
      }
    } catch (error) {
      console.error('Error loading Google Fit status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    try {
      setConnecting(true);
      
      // Start OAuth flow (web opens popup, native handles directly)
      const authorized = await googleFitService.authorize();
      
      // For native, update state immediately
      if (Platform.OS !== 'web' && authorized) {
        setConnected(true);
        setAccountEmail(user?.email || null);
        setLastSync(new Date());
        setConnecting(false);
      }
      // For web, the message listener will handle state update
    } catch (error: any) {
      console.error('Connection error:', error);
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      setConnecting(true);
      
      // Disconnect from Google Fit (removes localStorage token)
      await googleFitService.disconnect();

      setConnected(false);
      setAccountEmail(null);
      setLastSync(null);
    } catch (error) {
      console.error('Disconnect error:', error);
    } finally {
      setConnecting(false);
    }
  };

  const handleSyncNow = async () => {
    try {
      setConnecting(true);
      const steps = await googleFitService.getTodaySteps();
      
      // Update last sync time locally
      const now = new Date();
      setLastSync(now);
      
      console.log('Synced steps:', steps);
    } catch (error: any) {
      console.error('Sync error:', error);
      
      // Handle token expiration
      if (error.message === 'TOKEN_EXPIRED') {
        console.log('🔄 Token expired, disconnecting');
        setConnected(false);
        setAccountEmail(null);
        setLastSync(null);
      }
    } finally {
      setConnecting(false);
    }
  };

  const handleToggleAutoSync = async (value: boolean) => {
    setAutoSync(value);
    console.log('Auto-sync toggled:', value);
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <View style={styles.header}>
            <Icon name="google-fit" size={48} color={theme.colors.primary} />
            <Text style={[styles.title, { color: theme.colors.onSurface }]}>
              Google Fit Account
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
              Manage your Google Fit integration
            </Text>
          </View>
        </Card.Content>
      </Card>

      {/* Connection Status */}
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <View style={styles.statusContainer}>
            <View style={styles.statusRow}>
              <Text style={[styles.statusLabel, { color: theme.colors.onSurface }]}>
                Status
              </Text>
              <View style={styles.statusBadge}>
                <View
                  style={[
                    styles.statusDot,
                    { backgroundColor: connected ? '#4CAF50' : '#FF5252' }
                  ]}
                />
                <Text style={[styles.statusText, { color: connected ? '#4CAF50' : '#FF5252' }]}>
                  {connected ? 'Connected' : 'Not Connected'}
                </Text>
              </View>
            </View>

            {connected && accountEmail && (
              <View style={styles.statusRow}>
                <Text style={[styles.statusLabel, { color: theme.colors.onSurface }]}>
                  Account
                </Text>
                <Text style={[styles.statusValue, { color: theme.colors.onSurfaceVariant }]}>
                  {accountEmail}
                </Text>
              </View>
            )}

            {connected && lastSync && (
              <View style={styles.statusRow}>
                <Text style={[styles.statusLabel, { color: theme.colors.onSurface }]}>
                  Last Sync
                </Text>
                <Text style={[styles.statusValue, { color: theme.colors.onSurfaceVariant }]}>
                  {lastSync.toLocaleString()}
                </Text>
              </View>
            )}
          </View>

          <Divider style={styles.divider} />

          {!connected ? (
            <Button
              mode="contained"
              onPress={handleConnect}
              loading={connecting}
              disabled={connecting}
              icon="link"
              style={styles.button}
            >
              Connect Google Fit
            </Button>
          ) : (
            <View style={styles.buttonGroup}>
              <Button
                mode="outlined"
                onPress={handleSyncNow}
                loading={connecting}
                disabled={connecting}
                icon="refresh"
                style={[styles.button, styles.halfButton]}
              >
                Sync Now
              </Button>
              <Button
                mode="outlined"
                onPress={handleDisconnect}
                loading={connecting}
                disabled={connecting}
                icon="link-off"
                style={[styles.button, styles.halfButton]}
                textColor="#FF5252"
              >
                Disconnect
              </Button>
            </View>
          )}
        </Card.Content>
      </Card>

      {/* Settings */}
      {connected && (
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Settings
            </Text>

            <List.Item
              title="Auto-sync steps"
              description="Automatically sync your steps every hour"
              left={props => <List.Icon {...props} icon="sync" />}
              right={() => (
                <Switch
                  value={autoSync}
                  onValueChange={handleToggleAutoSync}
                  color={theme.colors.primary}
                />
              )}
            />
          </Card.Content>
        </Card>
      )}

      {/* Information */}
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
            About Google Fit Integration
          </Text>

          <List.Item
            title="Automatic step tracking"
            description="Your steps are automatically tracked and synced"
            left={props => <List.Icon {...props} icon="shoe-print" />}
          />

          <List.Item
            title="Privacy & Security"
            description="Your data is encrypted and secure"
            left={props => <List.Icon {...props} icon="shield-check" />}
          />

          <List.Item
            title="Disconnect anytime"
            description="You can disconnect your account at any time"
            left={props => <List.Icon {...props} icon="information" />}
          />
        </Card.Content>
      </Card>

      {/* Platform Note */}
      {Platform.OS !== 'android' && (
        <Card style={[styles.card, { backgroundColor: '#FFF3E0' }]}>
          <Card.Content>
            <View style={styles.noteContainer}>
              <Icon name="information" size={24} color="#F57C00" />
              <Text style={[styles.noteText, { color: '#E65100' }]}>
                Note: Google Fit requires an Android device to record steps. 
                Web and iOS can only view data recorded on Android.
              </Text>
            </View>
          </Card.Content>
        </Card>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    margin: 16,
    elevation: 2,
    borderRadius: 12,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  statusContainer: {
    marginBottom: 16,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
  },
  statusValue: {
    fontSize: 14,
  },
  divider: {
    marginVertical: 16,
  },
  button: {
    marginTop: 8,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  noteText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    lineHeight: 20,
  },
});

export default GoogleFitAccountScreen;
