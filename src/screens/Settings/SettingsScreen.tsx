import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Switch,
  List,
  Divider,
} from 'react-native-paper';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const SettingsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [settings, setSettings] = useState({
    notifications: {
      push: true,
      email: true,
      competition: true,
      achievement: true,
      reminder: true,
    },
    privacy: {
      profileVisible: true,
      shareStats: true,
      allowChallenges: true,
    },
    data: {
      autoSync: true,
      syncWifi: false,
      lowDataMode: false,
    },
    app: {
      hapticFeedback: true,
      soundEffects: true,
      animations: true,
    },
  });

  const { user, logout } = useAuth();
  const { theme, isDark, toggleTheme } = useTheme();

  const updateSetting = (category: string, key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value,
      },
    }));
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // In a real app, you would call your backend to delete the account
            Alert.alert('Account Deleted', 'Your account has been deleted successfully.');
          },
        },
      ]
    );
  };

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'This will clear all cached data. You may need to login again.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          onPress: () => {
            // Clear cache logic
            Alert.alert('Cache Cleared', 'Cache has been cleared successfully.');
          },
        },
      ]
    );
  };

  const openLink = (url: string) => {
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Unable to open the link.');
    });
  };

  const renderSettingItem = (
    icon: string,
    title: string,
    description: string,
    value: boolean,
    onToggle: (value: boolean) => void,
    lastItem: boolean = false
  ) => (
    <View>
      <List.Item
        title={title}
        description={description}
        left={(props) => <List.Icon {...props} icon={icon} />}
        right={() => (
          <Switch
            value={value}
            onValueChange={onToggle}
            color={theme.colors.primary}
          />
        )}
        titleStyle={{ color: theme.colors.onSurface }}
        descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
      />
      {!lastItem && <Divider />}
    </View>
  );

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Header */}
      <View style={styles.header}>
        <Title style={styles.headerTitle}>Settings</Title>
      </View>

      {/* Account Settings */}
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Title style={styles.cardTitle}>Account</Title>
          
          <List.Item
            title="Edit Profile"
            description="Update your personal information"
            left={(props) => <List.Icon {...props} icon="account-edit" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => navigation.navigate('Profile')}
            titleStyle={{ color: theme.colors.onSurface }}
            descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
          />
          <Divider />
          
          <List.Item
            title="Change Password"
            description="Update your password"
            left={(props) => <List.Icon {...props} icon="lock" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => Alert.alert('Info', 'Change password feature coming soon!')}
            titleStyle={{ color: theme.colors.onSurface }}
            descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
          />
          <Divider />
          
          <List.Item
            title="Payment Methods"
            description="Manage your payment options"
            left={(props) => <List.Icon {...props} icon="credit-card" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => Alert.alert('Info', 'Payment methods feature coming soon!')}
            titleStyle={{ color: theme.colors.onSurface }}
            descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
          />
        </Card.Content>
      </Card>

      {/* Notification Settings */}
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Title style={styles.cardTitle}>Notifications</Title>
          
          {renderSettingItem(
            'bell',
            'Push Notifications',
            'Receive push notifications on your device',
            settings.notifications.push,
            (value) => updateSetting('notifications', 'push', value)
          )}
          
          {renderSettingItem(
            'email',
            'Email Notifications',
            'Receive updates via email',
            settings.notifications.email,
            (value) => updateSetting('notifications', 'email', value)
          )}
          
          {renderSettingItem(
            'trophy',
            'Competition Updates',
            'Get notified about competition events',
            settings.notifications.competition,
            (value) => updateSetting('notifications', 'competition', value)
          )}
          
          {renderSettingItem(
            'star',
            'Achievement Alerts',
            'Celebrate your milestones',
            settings.notifications.achievement,
            (value) => updateSetting('notifications', 'achievement', value)
          )}
          
          {renderSettingItem(
            'clock',
            'Daily Reminders',
            'Remind to sync your steps',
            settings.notifications.reminder,
            (value) => updateSetting('notifications', 'reminder', value),
            true
          )}
        </Card.Content>
      </Card>

      {/* Privacy Settings */}
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Title style={styles.cardTitle}>Privacy</Title>
          
          {renderSettingItem(
            'account-eye',
            'Profile Visibility',
            'Others can see your profile',
            settings.privacy.profileVisible,
            (value) => updateSetting('privacy', 'profileVisible', value)
          )}
          
          {renderSettingItem(
            'chart-line',
            'Share Statistics',
            'Include you in public leaderboards',
            settings.privacy.shareStats,
            (value) => updateSetting('privacy', 'shareStats', value)
          )}
          
          {renderSettingItem(
            'sword-cross',
            'Allow Challenges',
            'Others can challenge you to competitions',
            settings.privacy.allowChallenges,
            (value) => updateSetting('privacy', 'allowChallenges', value),
            true
          )}
        </Card.Content>
      </Card>

      {/* Data & Storage */}
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Title style={styles.cardTitle}>Data & Storage</Title>
          
          {renderSettingItem(
            'sync',
            'Auto Sync',
            'Automatically sync your fitness data',
            settings.data.autoSync,
            (value) => updateSetting('data', 'autoSync', value)
          )}
          
          {renderSettingItem(
            'wifi',
            'WiFi Only Sync',
            'Sync only when connected to WiFi',
            settings.data.syncWifi,
            (value) => updateSetting('data', 'syncWifi', value)
          )}
          
          {renderSettingItem(
            'database',
            'Low Data Mode',
            'Reduce data usage',
            settings.data.lowDataMode,
            (value) => updateSetting('data', 'lowDataMode', value),
            true
          )}
          
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.colors.surfaceVariant }]}
            onPress={handleClearCache}
          >
            <Icon name="broom" size={20} color={theme.colors.primary} />
            <Text style={[styles.actionButtonText, { color: theme.colors.onSurface }]}>
              Clear Cache
            </Text>
          </TouchableOpacity>
        </Card.Content>
      </Card>

      {/* App Settings */}
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Title style={styles.cardTitle}>App Preferences</Title>
          
          {renderSettingItem(
            'vibrate',
            'Haptic Feedback',
            'Vibrate on interactions',
            settings.app.hapticFeedback,
            (value) => updateSetting('app', 'hapticFeedback', value)
          )}
          
          {renderSettingItem(
            'volume-high',
            'Sound Effects',
            'Play sounds in the app',
            settings.app.soundEffects,
            (value) => updateSetting('app', 'soundEffects', value)
          )}
          
          {renderSettingItem(
            'animation',
            'Animations',
            'Enable UI animations',
            settings.app.animations,
            (value) => updateSetting('app', 'animations', value)
          )}
          
          <List.Item
            title="Dark Mode"
            description="Toggle dark theme"
            left={(props) => <List.Icon {...props} icon="theme-light-dark" />}
            right={() => (
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                color={theme.colors.primary}
              />
            )}
            titleStyle={{ color: theme.colors.onSurface }}
            descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
          />
        </Card.Content>
      </Card>

      {/* Support */}
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Title style={styles.cardTitle}>Support</Title>
          
          <List.Item
            title="Help Center"
            description="Get help and support"
            left={(props) => <List.Icon {...props} icon="help-circle" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => openLink('https://support.example.com')}
            titleStyle={{ color: theme.colors.onSurface }}
            descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
          />
          <Divider />
          
          <List.Item
            title="Terms of Service"
            description="Read our terms and conditions"
            left={(props) => <List.Icon {...props} icon="file-document" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => openLink('https://example.com/terms')}
            titleStyle={{ color: theme.colors.onSurface }}
            descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
          />
          <Divider />
          
          <List.Item
            title="Privacy Policy"
            description="Learn how we protect your data"
            left={(props) => <List.Icon {...props} icon="shield" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => openLink('https://example.com/privacy')}
            titleStyle={{ color: theme.colors.onSurface }}
            descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
          />
        </Card.Content>
      </Card>

      {/* About */}
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Title style={styles.cardTitle}>About</Title>
          
          <View style={styles.aboutInfo}>
            <Text style={[styles.aboutText, { color: theme.colors.onSurface }]}>
              Health Competition App
            </Text>
            <Text style={[styles.aboutVersion, { color: theme.colors.onSurfaceVariant }]}>
              Version 1.0.0
            </Text>
            <Text style={[styles.aboutText, { color: theme.colors.onSurfaceVariant }]}>
              © 2024 Health Competition Inc.
            </Text>
          </View>
          
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.colors.surfaceVariant }]}
            onPress={() => openLink('https://example.com/rate')}
          >
            <Icon name="star" size={20} color={theme.colors.primary} />
            <Text style={[styles.actionButtonText, { color: theme.colors.onSurface }]}>
              Rate Us
            </Text>
          </TouchableOpacity>
        </Card.Content>
      </Card>

      {/* Danger Zone */}
      <Card style={[styles.dangerCard, { backgroundColor: '#FF5252' }]}>
        <Card.Content>
          <Title style={styles.dangerTitle}>Danger Zone</Title>
          
          <TouchableOpacity
            style={[styles.dangerButton, { backgroundColor: 'rgba(255,255,255,0.2)' }]}
            onPress={handleLogout}
          >
            <Icon name="logout" size={20} color="white" />
            <Text style={styles.dangerButtonText}>Logout</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.dangerButton, { backgroundColor: 'rgba(255,255,255,0.2)' }]}
            onPress={handleDeleteAccount}
          >
            <Icon name="delete" size={20} color="white" />
            <Text style={styles.dangerButtonText}>Delete Account</Text>
          </TouchableOpacity>
        </Card.Content>
      </Card>

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: theme.colors.onSurfaceVariant }]}>
          Made with ❤️ for healthy competition
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  card: {
    marginBottom: 16,
    elevation: 4,
    borderRadius: 12,
  },
  cardTitle: {
    fontSize: 18,
    marginBottom: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  aboutInfo: {
    alignItems: 'center',
    marginVertical: 16,
  },
  aboutText: {
    fontSize: 14,
    textAlign: 'center',
  },
  aboutVersion: {
    fontSize: 12,
    marginVertical: 4,
  },
  dangerCard: {
    marginBottom: 16,
    elevation: 4,
    borderRadius: 12,
  },
  dangerTitle: {
    fontSize: 18,
    color: 'white',
    marginBottom: 16,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    gap: 8,
  },
  dangerButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 12,
  },
});

export default SettingsScreen;