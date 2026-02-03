import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import { Avatar } from 'react-native-paper';
import { useSupabaseAuth } from '../../context/SupabaseAuthContext';
import { useTheme } from '../../context/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ProfileScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user, signOut } = useSupabaseAuth();
  const { theme, assets, mode, toggleTheme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Profile Header */}
        <View style={[styles.header, { backgroundColor: theme.card }]}>
          <Avatar.Image size={80} source={{ uri: assets.avatar }} style={styles.avatar} />
          <Text style={[styles.name, { color: theme.textPrimary }]}>{user?.userName || 'James Aditya'}</Text>
          <Text style={[styles.email, { color: theme.textSecondary }]}>{user?.email || 'james@example.com'}</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={[styles.statBox, { backgroundColor: theme.card }]}>
            <Text style={[styles.statVal, { color: theme.textPrimary }]}>12.4k</Text>
            <Text style={[styles.statLab, { color: theme.textSecondary }]}>Steps</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: theme.card }]}>
            <Text style={[styles.statVal, { color: theme.textPrimary }]}>8</Text>
            <Text style={[styles.statLab, { color: theme.textSecondary }]}>Challenges</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: theme.card }]}>
            <Text style={[styles.statVal, { color: theme.textPrimary }]}>#12</Text>
            <Text style={[styles.statLab, { color: theme.textSecondary }]}>Rank</Text>
          </View>
        </View>

        {/* Settings */}
        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Settings</Text>

        <View style={[styles.settingItem, { backgroundColor: theme.card }]}>
          <MaterialCommunityIcons name="theme-light-dark" size={20} color={theme.textPrimary} />
          <Text style={[styles.settingLabel, { color: theme.textPrimary }]}>Dark Mode</Text>
          <Switch value={mode === 'dark'} onValueChange={toggleTheme} trackColor={{ true: theme.success }} />
        </View>

        <TouchableOpacity style={[styles.settingItem, { backgroundColor: theme.card }]}>
          <MaterialCommunityIcons name="bell-outline" size={20} color={theme.textPrimary} />
          <Text style={[styles.settingLabel, { color: theme.textPrimary }]}>Notifications</Text>
          <MaterialCommunityIcons name="chevron-right" size={20} color={theme.textTertiary} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.settingItem, { backgroundColor: theme.card }]}>
          <MaterialCommunityIcons name="lock-outline" size={20} color={theme.textPrimary} />
          <Text style={[styles.settingLabel, { color: theme.textPrimary }]}>Privacy</Text>
          <MaterialCommunityIcons name="chevron-right" size={20} color={theme.textTertiary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.logoutBtn, { backgroundColor: theme.error + '20', borderColor: theme.error }]}
          onPress={signOut}
        >
          <MaterialCommunityIcons name="logout" size={20} color={theme.error} />
          <Text style={[styles.logoutText, { color: theme.error }]}>Sign Out</Text>
        </TouchableOpacity>

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    padding: 24,
    marginHorizontal: 20,
    borderRadius: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  avatar: {
    marginBottom: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: '800',
  },
  email: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  statBox: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statVal: {
    fontSize: 18,
    fontWeight: '800',
  },
  statLab: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginHorizontal: 20,
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 8,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  settingLabel: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    fontWeight: '600',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginTop: 24,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 8,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '700',
  },
});

export default ProfileScreen;

