import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Searchbar, FAB } from 'react-native-paper';
import { useCompetition } from '../../context/MockCompetitionContext';
import { useSupabaseAuth } from '../../context/SupabaseAuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Competition } from '../../types';
import { Feather } from '@expo/vector-icons';

const CompetitionScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'active'>('all');
  const [refreshing, setRefreshing] = useState(false);
  const { competitions } = useCompetition();
  const { user } = useSupabaseAuth();
  const { theme } = useTheme();

  const filtered = competitions.filter(c =>
    (c.name?.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (filter === 'all' || c.status === filter)
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const renderMission = ({ item }: { item: Competition }) => {
    const isJoined = item.participants.includes(user?.id || '');
    return (
      <View className="p-4 rounded-xl border mb-3 bg-glass border-glassBorder">
        <View className="flex-row justify-between items-center mb-3">
          <View className="px-2 py-1 rounded-md bg-muted">
            <Text className="text-[9px] font-black tracking-widest text-primary">COMP-{item.id.slice(0, 4).toUpperCase()}</Text>
          </View>
          {isJoined && (
            <View className="flex-row items-center gap-1 px-2 py-1 rounded-lg bg-primary-container">
              <Feather name="check-circle" size={12} color={theme.primary} />
              <Text className="text-[8px] font-black text-primary">ACTIVE</Text>
            </View>
          )}
        </View>

        <Text className="text-base font-black tracking-tighter text-foreground">{item.name}</Text>
        <Text className="text-xs mt-1.5 leading-4 font-semibold text-muted-foreground" numberOfLines={2}>{item.description}</Text>

        <View className="flex-row gap-4 mt-4 mb-4">
          <View className="flex-row items-center gap-1.5">
            <Feather name="users" size={14} color={theme.mutedForeground} />
            <Text className="text-[11px] font-extrabold text-foreground">{item.participants.length} Participants</Text>
          </View>
          <View className="flex-row items-center gap-1.5">
            <Feather name="dollar-sign" size={14} color={theme.tertiary} />
            <Text className="text-[11px] font-extrabold text-foreground">₹{item.prize_pool}</Text>
          </View>
        </View>

        <View className="flex-row gap-2">
          {isJoined ? (
            <>
              <TouchableOpacity
                className="flex-1 h-11 rounded-xl flex-row justify-center items-center gap-2 bg-primary"
                onPress={() => navigation.navigate('Workout', { competitionId: item.id })}
              >
                <Feather name="activity" size={16} color="#fff" />
                <Text className="text-[11px] font-black text-white tracking-widest">TRACK WORKOUT</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="w-11 h-11 rounded-xl justify-center items-center bg-muted"
                onPress={() => navigation.navigate('Leaderboard', { competitionId: item.id })}
              >
                <Feather name="bar-chart-2" size={16} color={theme.foreground} />
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              className="w-full h-11 rounded-xl flex-row justify-center items-center gap-2 bg-primary"
              onPress={() => navigation.navigate('Payment', { competitionId: item.id })}
            >
              <Text className="text-xs font-black text-white tracking-widest">JOIN COMPETITION</Text>
              <Feather name="arrow-right" size={16} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-background">
      <View className="px-4 pt-[60px] pb-4">
        <Text className="text-2xl font-black mb-4 tracking-tighter text-foreground">Competitions</Text>
        <Searchbar
          placeholder="Search competitions..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={{ backgroundColor: theme.surface, borderColor: theme.outline, borderRadius: 12, height: 48, marginBottom: 16, borderWidth: 1, elevation: 0 }}
          iconColor={theme.primary}
          placeholderTextColor={theme.mutedForeground}
          inputStyle={{ fontSize: 14, color: theme.foreground, fontWeight: '700' }}
        />
        <View className="flex-row gap-2">
          {['all', 'active', 'upcoming'].map(f => (
            <TouchableOpacity
              key={f}
              onPress={() => setFilter(f as any)}
              className={`px-3 py-2 rounded-xl border ${filter === f ? 'bg-primary-container border-primary' : 'bg-surface border-outline'}`}
            >
              <Text className={`text-[10px] font-black tracking-widest ${filter === f ? 'text-primary' : 'text-muted-foreground'}`}>{f.toUpperCase()}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={filtered}
        renderItem={renderMission}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 16, paddingTop: 0, paddingBottom: 140 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        showsVerticalScrollIndicator={false}
      />

      <FAB
        icon="plus"
        style={{ position: 'absolute', right: 16, bottom: 100, borderRadius: 12, backgroundColor: theme.primary }}
        color="#fff"
        onPress={() => navigation.navigate('CreateCompetition')}
      />
    </View>
  );
};

// ... styles removed as they are now inline ...
const styles = StyleSheet.create({
  // Kept for refresh control or non-tailwind props if needed, but mostly empty
  list: {
    paddingBottom: 140,
  },
});

export default CompetitionScreen;

