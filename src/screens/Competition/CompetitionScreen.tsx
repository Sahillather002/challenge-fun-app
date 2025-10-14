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
  Button,
  Chip,
  FAB,
  Searchbar,
} from 'react-native-paper';
import { useCompetition } from '../../context/MockCompetitionContext';
import { useSupabaseAuth } from '../../context/SupabaseAuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Competition } from '../../types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const CompetitionScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'active' | 'completed'>('all');
  const [refreshing, setRefreshing] = useState(false);
  const { competitions, loading, joinCompetition } = useCompetition();
  const { user } = useSupabaseAuth();
  const { theme } = useTheme();

  useEffect(() => {
    // Refresh competitions when screen loads
  }, []);

  const filteredCompetitions = competitions.filter(competition => {
    const matchesSearch = competition.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         competition.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filter === 'all' || competition.status === filter;
    
    return matchesSearch && matchesFilter;
  });

  const handleJoinCompetition = async (competitionId: string) => {
    try {
      await joinCompetition(competitionId);
      // Navigate to payment screen
      navigation.navigate('Payment', { competitionId });
    } catch (error: any) {
      console.error('Error joining competition:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    // Refresh logic would go here
    setTimeout(() => setRefreshing(false), 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#4CAF50';
      case 'upcoming':
        return '#FF9800';
      case 'completed':
        return '#9E9E9E';
      default:
        return '#757575';
    }
  };

  const renderCompetition = ({ item }: { item: Competition }) => {
    const isJoined = item.participants.includes(user?.id || '');
    const daysLeft = Math.ceil((new Date(item.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

    return (
      <Card style={[styles.competitionCard, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Title style={styles.competitionName}>{item.name}</Title>
            <Chip
              style={[styles.statusChip, { backgroundColor: getStatusColor(item.status) }]}
              textStyle={{ color: 'white' }}
            >
              {item.status.toUpperCase()}
            </Chip>
          </View>

          <Paragraph style={[styles.description, { color: theme.colors.onSurfaceVariant }]}>
            {item.description}
          </Paragraph>

          <View style={styles.competitionDetails}>
            <View style={styles.detailItem}>
              <Icon name="calendar" size={16} color={theme.colors.primary} />
              <Text style={[styles.detailText, { color: theme.colors.onSurface }]}>
                {item.type === 'weekly' ? 'Weekly' : 'Monthly'}
              </Text>
            </View>

            <View style={styles.detailItem}>
              <Icon name="currency-inr" size={16} color={theme.colors.primary} />
              <Text style={[styles.detailText, { color: theme.colors.onSurface }]}>
                Entry: ₹{item.entryFee}
              </Text>
            </View>

            <View style={styles.detailItem}>
              <Icon name="trophy" size={16} color={theme.colors.primary} />
              <Text style={[styles.detailText, { color: theme.colors.onSurface }]}>
                Prize: ₹{item.entryFee * item.participants.length * 0.6}
              </Text>
            </View>
          </View>

          <View style={styles.participantsInfo}>
            <Icon name="account-group" size={16} color={theme.colors.primary} />
            <Text style={[styles.participantsText, { color: theme.colors.onSurface }]}>
              {item.participants.length} participants
            </Text>
            {item.status === 'active' && (
              <Text style={[styles.daysLeft, { color: theme.colors.primary }]}>
                {daysLeft} days left
              </Text>
            )}
          </View>

          <View style={styles.cardActions}>
            {isJoined ? (
              <Button
                mode="outlined"
                onPress={() => navigation.navigate('Leaderboard', { competitionId: item.id })}
                style={styles.actionButton}
              >
                View Leaderboard
              </Button>
            ) : (
              <Button
                mode="contained"
                onPress={() => handleJoinCompetition(item.id)}
                disabled={item.status !== 'upcoming' && item.status !== 'active'}
                style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
              >
                Join Competition
              </Button>
            )}
          </View>
        </Card.Content>
      </Card>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Searchbar
          placeholder="Search competitions..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={[styles.searchBar, { backgroundColor: theme.colors.surface }]}
        />

        <View style={styles.filterContainer}>
          {['all', 'upcoming', 'active', 'completed'].map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.filterChip,
                filter === status && {
                  backgroundColor: theme.colors.primary,
                },
              ]}
              onPress={() => setFilter(status as any)}
            >
              <Text
                style={[
                  styles.filterText,
                  {
                    color: filter === status
                      ? theme.colors.onPrimary
                      : theme.colors.onSurface,
                  },
                ]}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={filteredCompetitions}
        renderItem={renderCompetition}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="trophy-outline" size={64} color={theme.colors.onSurfaceVariant} />
            <Text style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
              No competitions found
            </Text>
            <Text style={[styles.emptySubtext, { color: theme.colors.onSurfaceVariant }]}>
              {searchQuery ? 'Try a different search term' : 'Create a new competition to get started'}
            </Text>
          </View>
        }
      />

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => navigation.navigate('CreateCompetition')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  searchBar: {
    marginBottom: 12,
    elevation: 2,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
    paddingTop: 0,
  },
  competitionCard: {
    marginBottom: 16,
    elevation: 4,
    borderRadius: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  competitionName: {
    flex: 1,
    fontSize: 18,
    marginRight: 8,
  },
  statusChip: {
    height: 24,
  },
  description: {
    marginBottom: 12,
    fontSize: 14,
  },
  competitionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 12,
  },
  participantsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  participantsText: {
    fontSize: 12,
    marginLeft: 4,
  },
  daysLeft: {
    fontSize: 12,
    fontWeight: '600',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    borderRadius: 8,
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
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default CompetitionScreen;