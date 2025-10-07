import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Avatar,
  TextInput,
  Switch,
  Divider,
} from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../context/MockAuthContext';
import { useTheme } from '../../context/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ProfileScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    department: '',
    phone: '',
    bio: '',
  });
  const [notifications, setNotifications] = useState({
    push: true,
    email: true,
    competition: true,
    achievement: true,
  });
  const { user, updateUser, logout } = useAuth();
  const { theme, isDark, toggleTheme } = useTheme();

  React.useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        company: user.company || '',
        department: user.department || '',
        phone: '',
        bio: '',
      });
    }
  }, [user]);

  const handleUpdateProfile = async () => {
    try {
      await updateUser(formData);
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error: any) {
      Alert.alert('Error', 'Failed to update profile: ' + error.message);
    }
  };

  const handleImageUpload = async () => {
    try {
      // Request permission
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Please grant camera roll permissions to upload a profile picture.');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        // In a real app, you would upload this to your backend
        Alert.alert('Success', 'Profile picture updated!');
        console.log('Selected image:', result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
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

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateNotificationSetting = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  const stats = [
    { label: 'Total Steps', value: user?.totalSteps?.toLocaleString() || '0', icon: 'walk' },
    { label: 'Competitions Won', value: user?.competitionsWon?.toString() || '0', icon: 'trophy' },
    { label: 'Member Since', value: user?.joinedDate ? new Date(user.joinedDate).getFullYear().toString() : '2024', icon: 'calendar' },
    { label: 'Current Rank', value: '#12', icon: 'podium' },
  ];

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Profile Header */}
      <Card style={[styles.headerCard, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <View style={styles.profileHeader}>
            <TouchableOpacity onPress={handleImageUpload}>
              <Avatar.Text
                size={80}
                label={user?.name?.charAt(0).toUpperCase() || 'U'}
                style={{ backgroundColor: theme.colors.primary }}
              />
              <View style={styles.cameraIcon}>
                <Icon name="camera" size={20} color="white" />
              </View>
            </TouchableOpacity>
            
            <View style={styles.profileInfo}>
              <Title style={styles.profileName}>{user?.name}</Title>
              <Paragraph style={[styles.profileEmail, { color: theme.colors.onSurfaceVariant }]}>
                {user?.email}
              </Paragraph>
              <Paragraph style={[styles.profileCompany, { color: theme.colors.onSurfaceVariant }]}>
                {user?.company} • {user?.department}
              </Paragraph>
            </View>
          </View>

          <View style={styles.statsContainer}>
            {stats.map((stat, index) => (
              <View key={index} style={styles.statItem}>
                <Icon name={stat.icon} size={24} color={theme.colors.primary} />
                <Text style={[styles.statValue, { color: theme.colors.onSurface }]}>
                  {stat.value}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                  {stat.label}
                </Text>
              </View>
            ))}
          </View>
        </Card.Content>
      </Card>

      {/* Edit Profile Form */}
      <Card style={[styles.formCard, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Title style={styles.cardTitle}>Profile Information</Title>
            <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
              <Icon name={isEditing ? 'close' : 'pencil'} size={24} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>

          {isEditing ? (
            <View style={styles.editForm}>
              <TextInput
                label="Full Name"
                value={formData.name}
                onChangeText={(value) => updateFormData('name', value)}
                mode="outlined"
                style={styles.input}
              />

              <TextInput
                label="Email"
                value={formData.email}
                onChangeText={(value) => updateFormData('email', value)}
                mode="outlined"
                keyboardType="email-address"
                style={styles.input}
                editable={false} // Email typically shouldn't be editable
              />

              <TextInput
                label="Company"
                value={formData.company}
                onChangeText={(value) => updateFormData('company', value)}
                mode="outlined"
                style={styles.input}
              />

              <TextInput
                label="Department"
                value={formData.department}
                onChangeText={(value) => updateFormData('department', value)}
                mode="outlined"
                style={styles.input}
              />

              <TextInput
                label="Phone Number"
                value={formData.phone}
                onChangeText={(value) => updateFormData('phone', value)}
                mode="outlined"
                keyboardType="phone-pad"
                style={styles.input}
              />

              <TextInput
                label="Bio"
                value={formData.bio}
                onChangeText={(value) => updateFormData('bio', value)}
                mode="outlined"
                multiline
                numberOfLines={3}
                style={styles.input}
              />

              <View style={styles.formActions}>
                <Button
                  mode="outlined"
                  onPress={() => setIsEditing(false)}
                  style={styles.cancelButton}
                >
                  Cancel
                </Button>
                <Button
                  mode="contained"
                  onPress={handleUpdateProfile}
                  style={[styles.saveButton, { backgroundColor: theme.colors.primary }]}
                >
                  Save Changes
                </Button>
              </View>
            </View>
          ) : (
            <View style={styles.profileDetails}>
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: theme.colors.onSurfaceVariant }]}>
                  Name
                </Text>
                <Text style={[styles.detailValue, { color: theme.colors.onSurface }]}>
                  {user?.name}
                </Text>
              </View>
              
              <Divider style={styles.divider} />
              
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: theme.colors.onSurfaceVariant }]}>
                  Email
                </Text>
                <Text style={[styles.detailValue, { color: theme.colors.onSurface }]}>
                  {user?.email}
                </Text>
              </View>
              
              <Divider style={styles.divider} />
              
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: theme.colors.onSurfaceVariant }]}>
                  Company
                </Text>
                <Text style={[styles.detailValue, { color: theme.colors.onSurface }]}>
                  {user?.company}
                </Text>
              </View>
              
              <Divider style={styles.divider} />
              
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: theme.colors.onSurfaceVariant }]}>
                  Department
                </Text>
                <Text style={[styles.detailValue, { color: theme.colors.onSurface }]}>
                  {user?.department}
                </Text>
              </View>
            </View>
          )}
        </Card.Content>
      </Card>

      {/* Settings */}
      <Card style={[styles.settingsCard, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Title style={styles.cardTitle}>Settings</Title>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Icon name="bell" size={24} color={theme.colors.primary} />
              <Text style={[styles.settingLabel, { color: theme.colors.onSurface }]}>
                Push Notifications
              </Text>
            </View>
            <Switch
              value={notifications.push}
              onValueChange={(value) => updateNotificationSetting('push', value)}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Icon name="email" size={24} color={theme.colors.primary} />
              <Text style={[styles.settingLabel, { color: theme.colors.onSurface }]}>
                Email Notifications
              </Text>
            </View>
            <Switch
              value={notifications.email}
              onValueChange={(value) => updateNotificationSetting('email', value)}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Icon name="trophy" size={24} color={theme.colors.primary} />
              <Text style={[styles.settingLabel, { color: theme.colors.onSurface }]}>
                Competition Updates
              </Text>
            </View>
            <Switch
              value={notifications.competition}
              onValueChange={(value) => updateNotificationSetting('competition', value)}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Icon name="theme-light-dark" size={24} color={theme.colors.primary} />
              <Text style={[styles.settingLabel, { color: theme.colors.onSurface }]}>
                Dark Mode
              </Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
            />
          </View>
        </Card.Content>
      </Card>

      {/* Actions */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.colors.surfaceVariant }]}
          onPress={() => navigation.navigate('Rewards')}
        >
          <Icon name="gift" size={24} color={theme.colors.primary} />
          <Text style={[styles.actionButtonText, { color: theme.colors.onSurface }]}>
            My Rewards
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.colors.surfaceVariant }]}
          onPress={() => navigation.navigate('Settings')}
        >
          <Icon name="cog" size={24} color={theme.colors.primary} />
          <Text style={[styles.actionButtonText, { color: theme.colors.onSurface }]}>
            Settings
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#FF5252' }]}
          onPress={handleLogout}
        >
          <Icon name="logout" size={24} color="white" />
          <Text style={[styles.actionButtonText, { color: 'white' }]}>
            Logout
          </Text>
        </TouchableOpacity>
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
  headerCard: {
    marginBottom: 16,
    elevation: 4,
    borderRadius: 12,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#6200EE',
    borderRadius: 12,
    padding: 4,
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileEmail: {
    fontSize: 14,
    marginTop: 2,
  },
  profileCompany: {
    fontSize: 14,
    marginTop: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  formCard: {
    marginBottom: 16,
    elevation: 4,
    borderRadius: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
  },
  editForm: {
    gap: 12,
  },
  input: {
    marginBottom: 8,
  },
  formActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
  },
  saveButton: {
    flex: 1,
  },
  profileDetails: {
    gap: 4,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
  },
  divider: {
    marginVertical: 4,
  },
  settingsCard: {
    marginBottom: 16,
    elevation: 4,
    borderRadius: 12,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingLabel: {
    fontSize: 16,
  },
  actionButtons: {
    gap: 12,
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileScreen;