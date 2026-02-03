import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import DashboardScreen from '../screens/Dashboard/DashboardScreen';
import CompetitionScreen from '../screens/Competition/CompetitionScreen';
import LeaderboardScreen from '../screens/Leaderboard/LeaderboardScreen';
import RewardsScreen from '../screens/Rewards/RewardsScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import { useTheme } from '../context/ThemeContext';

const Tab = createBottomTabNavigator();

// Simple emoji fallback if icons don't load
const getEmoji = (routeName: string) => {
  const emojis: Record<string, string> = {
    Dashboard: '🏠',
    Competition: '🏆',
    Leaderboard: '📊',
    Rewards: '🎁',
    Profile: '👤',
  };
  return emojis[routeName] || '⭐';
};

export default function MainTabNavigator() {
  const { theme, mode } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginTop: -5,
        },
        tabBarActiveTintColor: theme.textPrimary,
        tabBarInactiveTintColor: theme.textTertiary,
        tabBarIcon: ({ color, focused, size }) => {
          // Use emoji as reliable fallback
          return (
            <Text style={{ fontSize: 24 }}>
              {getEmoji(route.name)}
            </Text>
          );
        },
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 70,
          backgroundColor: mode === 'light' ? '#FFFFFF' : theme.card,
          borderTopWidth: 1,
          borderTopColor: mode === 'light' ? 'rgba(0,0,0,0.1)' : theme.border,
          paddingBottom: 10,
          paddingTop: 10,
          zIndex: 1000,
          elevation: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Competition" component={CompetitionScreen} />
      <Tab.Screen name="Leaderboard" component={LeaderboardScreen} />
      <Tab.Screen name="Rewards" component={RewardsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
