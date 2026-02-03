import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Avatar } from 'react-native-paper';
import { useCompetition } from '../../context/MockCompetitionContext';
import { useSupabaseAuth } from '../../context/SupabaseAuthContext';
import { useTheme } from '../../context/ThemeContext';
import { LeaderboardEntry } from '../../types';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const LeaderboardScreen: React.FC<{ route: any, navigation: any }> = ({ route, navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const { leaderboard, getLeaderboard } = useCompetition();
  const { user } = useSupabaseAuth();
  const { theme } = useTheme();

  const competitionId = route.params?.competitionId;

  useEffect(() => {
    if (competitionId) getLeaderboard(competitionId);
  }, [competitionId]);

  const handleRefresh = async () => {
    setRefreshing(true);
    if (competitionId) await getLeaderboard(competitionId);
    setRefreshing(false);
  };

  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  const renderPodiumItem = (item: LeaderboardEntry, rank: number) => {
    const podiumColors = {
      1: { bg: theme.trophy + '30', border: theme.trophy },
      2: { bg: '#C0C0C0' + '30', border: '#C0C0C0' },
      3: { bg: '#CD7F32' + '30', border: '#CD7F32' },
    };
    const colors = podiumColors[rank as 1 | 2 | 3];

    return (
      <View className="items-center flex-1" key={item.userId}>
        <View style={{ backgroundColor: colors.border }} className="w-6 h-6 rounded-xl justify-center items-center mb-2">
          <Text className="text-white text-xs font-black">{rank}</Text>
        </View>
        <View style={{ borderColor: colors.border, backgroundColor: colors.bg }} className="border-[3px] rounded-full p-1 mb-2">
          <Avatar.Text
            size={64}
            label={item.userName?.charAt(0) || 'U'}
            style={{ backgroundColor: 'transparent' }}
            labelStyle={{ color: theme.textPrimary, fontWeight: '900', fontSize: 24 }}
          />
        </View>
        <Text className="text-sm font-bold text-center text-foreground">{item.userName || 'User'}</Text>
        <Text className="text-[10px] font-medium text-center mt-0.5 text-text-secondary">
          {rank === 1 ? 'HR Staff' : rank === 2 ? 'Marketing' : 'Sales'}
        </Text>
        <View style={{ backgroundColor: colors.bg }} className="px-3 py-1 rounded-xl mt-2">
          <Text style={{ color: colors.border }} className="text-xs font-bold">{item.totalSteps}pts</Text>
        </View>
      </View>
    );
  };

  const renderListItem = ({ item, index }: { item: LeaderboardEntry; index: number }) => {
    const rank = index + 4;
    const isMe = item.userId === user?.id;

    return (
      <View className="flex-row items-center p-3 rounded-2xl mb-2 shadow-sm elevation-2 bg-card">
        <Text className="text-sm font-bold w-6 text-center text-text-secondary">{rank}</Text>
        <Avatar.Text
          size={40}
          label={item.userName?.charAt(0) || 'U'}
          style={{ backgroundColor: theme.cardSecondary }}
          labelStyle={{ color: theme.textPrimary, fontWeight: '700', fontSize: 16 }}
        />
        <View className="flex-1 ml-3">
          <Text className="text-sm font-bold text-foreground">{item.userName || 'User'}</Text>
          <Text className="text-[10px] font-medium mt-0.5 text-text-secondary">
            {rank % 3 === 0 ? 'IT Staff' : rank % 2 === 0 ? 'Sales' : 'Product Designer'}
          </Text>
        </View>
        <Text className="text-sm font-bold text-foreground">{item.totalSteps}pts</Text>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View className="flex-row justify-between items-center px-5 pt-[60px] pb-5">
        <Text className="text-2xl font-extrabold text-foreground">Leaderboard!</Text>
        <TouchableOpacity className="flex-row items-center px-3 py-2 rounded-xl gap-1 bg-card">
          <Text className="text-sm font-semibold text-foreground">All Time</Text>
          <MaterialCommunityIcons name="chevron-down" size={16} color={theme.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Top 3 Podium */}
      <View className="flex-row justify-center items-end px-5 mb-6 gap-3">
        {top3.length >= 2 && renderPodiumItem(top3[1], 2)}
        {top3.length >= 1 && renderPodiumItem(top3[0], 1)}
        {top3.length >= 3 && renderPodiumItem(top3[2], 3)}
      </View>

      {/* Rest of List */}
      <FlatList
        data={rest}
        renderItem={renderListItem}
        keyExtractor={(item, index) => item.userId + index}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  // Kept minimal
  list: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
});

export default LeaderboardScreen;

