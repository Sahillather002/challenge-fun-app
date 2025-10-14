import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Chip,
  Avatar,
} from 'react-native-paper';
import { useSupabaseAuth } from '../../context/SupabaseAuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Reward } from '../../types';
import { supabaseHelpers } from '../../config/supabase';
import { useToast } from '../../context/ToastContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const RewardsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'claimed' | 'unclaimed'>('all');
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useSupabaseAuth();
  const { theme } = useTheme();
  const toast = useToast();

  useEffect(() => {
    loadRewards();
  }, [user]);

  const loadRewards = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const rewardsData = await supabaseHelpers.rewards.getByUser(user.id);
      setRewards(rewardsData || []);

      const total = rewardsData?.reduce((sum, reward) => sum + reward.amount, 0) || 0;
      setTotalEarnings(total);
    } catch (error: any) {
      console.error('Error loading rewards:', error);
      toast.error('Failed to load rewards');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadRewards();
    setRefreshing(false);
  };

  const claimReward = async (rewardId: string) => {
    try {
      setLoading(true);
      await supabaseHelpers.rewards.claimReward(rewardId);
      await loadRewards(); // Refresh the rewards list
      toast.success('Reward claimed successfully! The amount will be transferred to your account within 24-48 hours.');
    } catch (error: any) {
      console.error('Error claiming reward:', error);
      toast.error('Failed to claim reward. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredRewards = rewards.filter(reward => {
    if (filter === 'claimed') return reward.claimed;
    if (filter === 'unclaimed') return !reward.claimed;
    return true;
  });

  const unclaimedAmount = rewards
    .filter(reward => !reward.claimed)
    .reduce((sum, reward) => sum + reward.amount, 0);

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1:
        return 'trophy';
      case 2:
        return 'medal';
      case 3:
        return 'medal-outline';
      default:
        return 'certificate';
    }
  };

  const getPositionColor = (position: number) => {
    switch (position) {
      case 1:
        return '#FFD700';
      case 2:
        return '#C0C0C0';
      case 3:
        return '#CD7F32';
      default:
        return theme.colors.primary;
    }
  };

  const getPositionText = (position: number) => {
    switch (position) {
      case 1:
        return '1st Place';
      case 2:
        return '2nd Place';
      case 3:
        return '3rd Place';
      default:
        return `${position}th Place`;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const renderReward = ({ item }: { item: Reward }) => (
    <Card
      style={[
        styles.rewardCard,
        {
          backgroundColor: item.claimed
            ? theme.colors.surface
            : theme.colors.primaryContainer,
          borderLeftWidth: 4,
          borderLeftColor: getPositionColor(item.position),
        },
      ]}
    >
      <Card.Content>
        <View style={styles.rewardHeader}>
          <View style={styles.positionContainer}>
            <View
              style={[
                styles.positionBadge,
                { backgroundColor: getPositionColor(item.position) },
              ]}
            >
              <Icon
                name={getPositionIcon(item.position)}
                size={24}
                color="white"
              />
            </View>
            <View style={styles.positionInfo}>
              <Text
                style={[
                  styles.positionText,
                  { color: theme.colors.onSurface },
                ]}
              >
                {getPositionText(item.position)}
              </Text>
              <Text
                style={[
                  styles.competitionText,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                Competition #{item.competitionId.slice(-4)}
              </Text>
            </View>
          </View>

          <View style={styles.amountContainer}>
            <Text
              style={[
                styles.amountText,
                {
                  color: item.claimed
                    ? theme.colors.onSurface
                    : theme.colors.primary,
                },
              ]}
            >
              ₹{item.amount}
            </Text>
            <Chip
              style={[
                styles.statusChip,
                {
                  backgroundColor: item.claimed
                    ? '#4CAF50'
                    : '#FF9800',
                },
              ]}
              textStyle={{ color: 'white', fontSize: 10 }}
            >
              {item.claimed ? 'Claimed' : 'Pending'}
            </Chip>
          </View>
        </View>

        {item.claimed && item.claimedDate && (
          <View style={styles.claimedInfo}>
            <Icon name="check-circle" size={16} color="#4CAF50" />
            <Text
              style={[
                styles.claimedDate,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              Claimed on {formatDate(item.claimedDate)}
            </Text>
          </View>
        )}

        {!item.claimed && (
          <View style={styles.claimSection}>
            <Text
              style={[
                styles.claimInfo,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              🎉 Congratulations! You've won this prize. Claim it now to receive your reward.
            </Text>
            <Button
              mode="contained"
              onPress={() => claimReward(item.id)}
              style={[styles.claimButton, { backgroundColor: theme.colors.primary }]}
              contentStyle={styles.claimButtonContent}
            >
              Claim Reward
            </Button>
          </View>
        )}
      </Card.Content>
    </Card>
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Title style={styles.headerTitle}>My Rewards</Title>
        <TouchableOpacity
          style={[styles.historyButton, { backgroundColor: theme.colors.surfaceVariant }]}
          onPress={() => navigation.navigate('RewardHistory')}
        >
          <Icon name="history" size={20} color={theme.colors.primary} />
          <Text style={[styles.historyButtonText, { color: theme.colors.primary }]}>
            History
          </Text>
        </TouchableOpacity>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <Card style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
          <Card.Content style={styles.statContent}>
            <Icon name="currency-inr" size={32} color="#4CAF50" />
            <View style={styles.statInfo}>
              <Text
                style={[
                  styles.statValue,
                  { color: theme.colors.onSurface },
                ]}
              >
                ₹{totalEarnings}
              </Text>
              <Text
                style={[
                  styles.statLabel,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                Total Earnings
              </Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
          <Card.Content style={styles.statContent}>
            <Icon name="gift-outline" size={32} color="#FF9800" />
            <View style={styles.statInfo}>
              <Text
                style={[
                  styles.statValue,
                  { color: theme.colors.onSurface },
                ]}
              >
                ₹{unclaimedAmount}
              </Text>
              <Text
                style={[
                  styles.statLabel,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                Pending Claims
              </Text>
            </View>
          </Card.Content>
        </Card>
      </View>

      {/* Achievement Summary */}
      <Card style={[styles.achievementCard, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Title style={styles.achievementTitle}>Achievement Summary</Title>
          
          <View style={styles.achievementStats}>
            <View style={styles.achievementItem}>
              <View
                style={[
                  styles.achievementBadge,
                  { backgroundColor: '#FFD700' },
                ]}
              >
                <Text style={styles.achievementBadgeText}>
                  {rewards.filter(r => r.position === 1).length}
                </Text>
              </View>
              <Text
                style={[
                  styles.achievementLabel,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                1st Places
              </Text>
            </View>

            <View style={styles.achievementItem}>
              <View
                style={[
                  styles.achievementBadge,
                  { backgroundColor: '#C0C0C0' },
                ]}
              >
                <Text style={styles.achievementBadgeText}>
                  {rewards.filter(r => r.position === 2).length}
                </Text>
              </View>
              <Text
                style={[
                  styles.achievementLabel,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                2nd Places
              </Text>
            </View>

            <View style={styles.achievementItem}>
              <View
                style={[
                  styles.achievementBadge,
                  { backgroundColor: '#CD7F32' },
                ]}
              >
                <Text style={styles.achievementBadgeText}>
                  {rewards.filter(r => r.position === 3).length}
                </Text>
              </View>
              <Text
                style={[
                  styles.achievementLabel,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                3rd Places
              </Text>
            </View>

            <View style={styles.achievementItem}>
              <View
                style={[
                  styles.achievementBadge,
                  { backgroundColor: theme.colors.primary },
                ]}
              >
                <Text style={styles.achievementBadgeText}>
                  {rewards.length}
                </Text>
              </View>
              <Text
                style={[
                  styles.achievementLabel,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                Total Wins
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Filters */}
      <View style={styles.filters}>
        {['all', 'unclaimed', 'claimed'].map((filterType) => (
          <TouchableOpacity
            key={filterType}
            style={[
              styles.filterChip,
              filter === filterType && {
                backgroundColor: theme.colors.primary,
              },
            ]}
            onPress={() => setFilter(filterType as any)}
          >
            <Text
              style={[
                styles.filterText,
                {
                  color: filter === filterType
                    ? theme.colors.onPrimary
                    : theme.colors.onSurface,
                },
              ]}
            >
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              {filterType === 'unclaimed' && ` (${rewards.filter(r => !r.claimed).length})`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Rewards List */}
      <FlatList
        data={filteredRewards}
        renderItem={renderReward}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        scrollEnabled={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="trophy-outline" size={64} color={theme.colors.onSurfaceVariant} />
            <Text style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
              {filter === 'unclaimed' ? 'No pending rewards' : 'No rewards yet'}
            </Text>
            <Text style={[styles.emptySubtext, { color: theme.colors.onSurfaceVariant }]}>
              {filter === 'unclaimed'
                ? 'All your rewards have been claimed!'
                : 'Start competing to earn rewards!'}
            </Text>
          </View>
        }
      />

      {/* Info Section */}
      <Card style={[styles.infoCard, { backgroundColor: theme.colors.surfaceVariant }]}>
        <Card.Content>
          <View style={styles.infoHeader}>
            <Icon name="information" size={20} color={theme.colors.primary} />
            <Text style={[styles.infoTitle, { color: theme.colors.onSurface }]}>
              How Rewards Work
            </Text>
          </View>
          
          <Text style={[styles.infoText, { color: theme.colors.onSurfaceVariant }]}>
            • Win top 3 positions in competitions to earn rewards
          </Text>
          <Text style={[styles.infoText, { color: theme.colors.onSurfaceVariant }]}>
            • Prize money is distributed from the competition entry fees
          </Text>
          <Text style={[styles.infoText, { color: theme.colors.onSurfaceVariant }]}>
            • Claim your rewards within 30 days of winning
          </Text>
          <Text style={[styles.infoText, { color: theme.colors.onSurfaceVariant }]}>
            • Rewards are transferred to your registered payment method
          </Text>
        </Card.Content>
      </Card>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  historyButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    elevation: 4,
    borderRadius: 12,
  },
  statContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statInfo: {
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  achievementCard: {
    marginBottom: 20,
    elevation: 4,
    borderRadius: 12,
  },
  achievementTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  achievementStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  achievementItem: {
    alignItems: 'center',
  },
  achievementBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  achievementBadgeText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  achievementLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  filters: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
  },
  listContainer: {
    paddingBottom: 16,
  },
  rewardCard: {
    marginBottom: 12,
    elevation: 4,
    borderRadius: 12,
  },
  rewardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  positionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  positionBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  positionInfo: {
    flex: 1,
  },
  positionText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  competitionText: {
    fontSize: 12,
    marginTop: 2,
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statusChip: {
    height: 24,
    marginTop: 4,
  },
  claimedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  claimedDate: {
    fontSize: 12,
  },
  claimSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  claimInfo: {
    fontSize: 12,
    marginBottom: 12,
    lineHeight: 16,
  },
  claimButton: {
    borderRadius: 8,
  },
  claimButtonContent: {
    paddingVertical: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  infoCard: {
    marginTop: 16,
    elevation: 2,
    borderRadius: 12,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  infoText: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 4,
  },
});

export default RewardsScreen;