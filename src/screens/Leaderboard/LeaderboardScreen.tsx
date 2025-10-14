import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Avatar,
  Chip,
  Searchbar,
} from 'react-native-paper';
import { useCompetition } from '../../context/MockCompetitionContext';
import { useSupabaseAuth } from '../../context/SupabaseAuthContext';
import { useTheme } from '../../context/ThemeContext';
import { LeaderboardEntry, Competition } from '../../types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const LeaderboardScreen: React.FC<{ route: any, navigation: any }> = ({ route, navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [competition, setCompetition] = useState<Competition | null>(null);
  const { leaderboard, getLeaderboard, loading } = useCompetition();
  const { user } = useSupabaseAuth();
  const { theme } = useTheme();

  const competitionId = route.params?.competitionId;

  useEffect(() => {
    if (competitionId) {
      loadLeaderboard(competitionId);
    }
  }, [competitionId]);

  const loadLeaderboard = async (id: string) => {
    try {
      await getLeaderboard(id);
      // In a real app, you would fetch the competition details
      // setCompetition(await getCompetitionDetails(id));
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    if (competitionId) {
      await loadLeaderboard(competitionId);
    }
    setRefreshing(false);
  };

  const filteredLeaderboard = leaderboard.filter(entry =>
    entry.userName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRankColor = (rank: number) => {
    switch (rank) {
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

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return 'trophy';
      case 2:
        return 'medal';
      case 3:
        return 'medal-outline';
      default:
        return 'numeric-' + rank;
    }
  };

  const renderLeaderboardItem = ({ item, index }: { item: LeaderboardEntry; index: number }) => {
    const isCurrentUser = item.userId === user?.id;
    const rank = index + 1;

    return (
      <Card
        style={[
          styles.leaderboardItem,
          {
            backgroundColor: isCurrentUser ? theme.colors.primaryContainer : theme.colors.surface,
            borderColor: isCurrentUser ? theme.colors.primary : 'transparent',
            borderWidth: isCurrentUser ? 2 : 0,
          },
        ]}
      >
        <Card.Content>
          <View style={styles.itemHeader}>
            <View style={styles.rankContainer}>
              <View
                style={[
                  styles.rankBadge,
                  { backgroundColor: getRankColor(rank) },
                ]}
              >
                <Icon
                  name={getRankIcon(rank)}
                  size={rank <= 3 ? 24 : 16}
                  color="white"
                />
              </View>
              <Text
                style={[
                  styles.rankText,
                  { color: isCurrentUser ? theme.colors.onPrimaryContainer : theme.colors.onSurface },
                ]}
              >
                #{rank}
              </Text>
            </View>

            <View style={styles.userInfo}>
              <Avatar.Text
                size={40}
                label={item.userName.charAt(0).toUpperCase()}
                style={{
                  backgroundColor: getRankColor(rank),
                }}
              />
              <View style={styles.userDetails}>
                <Text
                  style={[
                    styles.userName,
                    {
                      color: isCurrentUser ? theme.colors.onPrimaryContainer : theme.colors.onSurface,
                      fontWeight: isCurrentUser ? 'bold' : 'normal',
                    },
                  ]}
                >
                  {item.userName}
                  {isCurrentUser && ' (You)'}
                </Text>
                <Text
                  style={[
                    styles.userSteps,
                    { color: isCurrentUser ? theme.colors.onPrimaryContainer : theme.colors.onSurfaceVariant },
                  ]}
                >
                  {item.totalSteps.toLocaleString()} steps
                </Text>
              </View>
            </View>

            {item.prize && (
              <View style={styles.prizeContainer}>
                <Icon name="currency-inr" size={16} color="#4CAF50" />
                <Text style={[styles.prizeText, { color: '#4CAF50' }]}>
                  {item.prize}
                </Text>
              </View>
            )}
          </View>

          {rank <= 3 && (
            <View style={styles.achievementBadges}>
              {rank === 1 && (
                <Chip
                  style={[styles.achievementChip, { backgroundColor: '#FFD700' }]}
                  textStyle={{ color: 'white', fontSize: 10 }}
                >
                  🏆 Champion
                </Chip>
              )}
              {rank === 2 && (
                <Chip
                  style={[styles.achievementChip, { backgroundColor: '#C0C0C0' }]}
                  textStyle={{ color: 'white', fontSize: 10 }}
                >
                  🥈 Runner-up
                </Chip>
              )}
              {rank === 3 && (
                <Chip
                  style={[styles.achievementChip, { backgroundColor: '#CD7F32' }]}
                  textStyle={{ color: 'white', fontSize: 10 }}
                >
                  🥉 Third Place
                </Chip>
              )}
            </View>
          )}
        </Card.Content>
      </Card>
    );
  };

  const renderTopThree = () => {
    const topThree = filteredLeaderboard.slice(0, 3);
    if (topThree.length === 0) return null;

    return (
      <View style={styles.topThreeContainer}>
        {topThree.map((entry, index) => {
          const position = index + 1;
          const isCurrentUser = entry.userId === user?.id;
          
          return (
            <TouchableOpacity
              key={entry.userId}
              style={[
                styles.topThreeItem,
                {
                  backgroundColor: isCurrentUser ? theme.colors.primaryContainer : theme.colors.surface,
                },
              ]}
              onPress={() => {
                // Navigate to user profile or details
              }}
            >
              <View
                style={[
                  styles.topThreeBadge,
                  {
                    backgroundColor: getRankColor(position),
                  },
                ]}
              >
                <Icon
                  name={getRankIcon(position)}
                  size={32}
                  color="white"
                />
              </View>
              
              <Avatar.Text
                size={60}
                label={entry.userName.charAt(0).toUpperCase()}
                style={{
                  backgroundColor: getRankColor(position),
                  marginTop: -20,
                }}
              />
              
              <Text
                style={[
                  styles.topThreeName,
                  {
                    color: isCurrentUser ? theme.colors.onPrimaryContainer : theme.colors.onSurface,
                  },
                ]}
                numberOfLines={1}
              >
                {entry.userName}
                {isCurrentUser && '\n(You)'}
              </Text>
              
              <Text
                style={[
                  styles.topThreeSteps,
                  { color: theme.colors.primary },
                ]}
              >
                {entry.totalSteps.toLocaleString()}
              </Text>
              
              <Text
                style={[
                  styles.topThreeLabel,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                steps
              </Text>
              
              {entry.prize && (
                <View style={styles.topThreePrize}>
                  <Icon name="currency-inr" size={14} color="#4CAF50" />
                  <Text style={[styles.prizeText, { color: '#4CAF50' }]}>
                    {entry.prize}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
        
        <Title style={styles.headerTitle}>Leaderboard</Title>
        
        <TouchableOpacity
          style={styles.shareButton}
          onPress={() => {
            // Share functionality
          }}
        >
          <Icon name="share" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Competition Info */}
      {competition && (
        <Card style={[styles.competitionCard, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text style={styles.competitionName}>{competition.name}</Text>
            <Text style={[styles.competitionInfo, { color: theme.colors.onSurfaceVariant }]}>
              {competition.participants.length} participants • {competition.type}
            </Text>
          </Card.Content>
        </Card>
      )}

      {/* Search */}
      <Searchbar
        placeholder="Search participants..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={[styles.searchBar, { backgroundColor: theme.colors.surface }]}
      />

      {/* Top Three */}
      {filteredLeaderboard.length >= 3 && renderTopThree()}

      {/* Leaderboard List */}
      <FlatList
        data={filteredLeaderboard.slice(3)}
        renderItem={renderLeaderboardItem}
        keyExtractor={(item) => item.userId}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="podium" size={64} color={theme.colors.onSurfaceVariant} />
            <Text style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
              No participants yet
            </Text>
            <Text style={[styles.emptySubtext, { color: theme.colors.onSurfaceVariant }]}>
              Be the first to join this competition!
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 8,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  shareButton: {
    padding: 8,
  },
  competitionCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
  },
  competitionName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  competitionInfo: {
    fontSize: 12,
    marginTop: 4,
  },
  searchBar: {
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
  },
  topThreeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 16,
    marginBottom: 24,
  },
  topThreeItem: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    elevation: 4,
    minWidth: 100,
  },
  topThreeBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  topThreeName: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 8,
  },
  topThreeSteps: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4,
  },
  topThreeLabel: {
    fontSize: 10,
    marginTop: 2,
  },
  topThreePrize: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 2,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  leaderboardItem: {
    marginBottom: 8,
    elevation: 2,
    borderRadius: 8,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rankContainer: {
    alignItems: 'center',
    minWidth: 50,
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  rankText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 16,
  },
  userDetails: {
    marginLeft: 12,
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
  },
  userSteps: {
    fontSize: 14,
    marginTop: 2,
  },
  prizeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  prizeText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  achievementBadges: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 4,
  },
  achievementChip: {
    height: 24,
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
  },
});

export default LeaderboardScreen;