import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Avatar,
  ProgressBar,
} from 'react-native-paper';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { useAuth } from '../../context/AuthContext';
import { useCompetition } from '../../context/MockCompetitionContext';
import { useTheme } from '../../context/ThemeContext';
import GoogleFitCard from '../../components/GoogleFitCard';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

const DashboardScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [currentSteps, setCurrentSteps] = useState(0);
  const [weeklySteps, setWeeklySteps] = useState(0);
  const [stepHistory, setStepHistory] = useState([0, 0, 0, 0, 0, 0, 0]);
  const { user } = useAuth();
  const { competitions, currentCompetition } = useCompetition();
  const { theme } = useTheme();

  useEffect(() => {
    // Initialize dashboard data
    generateMockData();
  }, []);

  const generateMockData = () => {
    // Mock step history for the week
    const mockHistory = Array.from({ length: 7 }, () => 
      Math.floor(Math.random() * 8000) + 4000
    );
    setStepHistory(mockHistory);
    setWeeklySteps(mockHistory.reduce((a, b) => a + b, 0));
  };

  const handleStepsUpdate = (steps: number) => {
    setCurrentSteps(steps);
  };

  const activeCompetitions = competitions.filter(c => c.status === 'active');
  const dailyGoal = 10000;
  const progress = Math.min(currentSteps / dailyGoal, 1);

  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: stepHistory,
        color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: theme.colors.surface,
    backgroundGradientFrom: theme.colors.surface,
    backgroundGradientTo: theme.colors.surface,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(66, 66, 66, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: theme.colors.primary,
    },
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Avatar.Text 
            size={50} 
            label={user?.name?.charAt(0).toUpperCase() || 'U'} 
            style={{ backgroundColor: theme.colors.primary }}
          />
          <View style={styles.userDetails}>
            <Title style={styles.userName}>{user?.name}</Title>
            <Paragraph style={[styles.userCompany, { color: theme.colors.onSurfaceVariant }]}>
              {user?.company} • {user?.department}
            </Paragraph>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.notificationButton, { backgroundColor: theme.colors.surfaceVariant }]}
          onPress={() => navigation.navigate('Notifications')}
        >
          <Icon name="bell" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Google Fit Card */}
      <GoogleFitCard onStepsUpdate={handleStepsUpdate} />

      {/* Today's Progress Card */}
      <Card style={[styles.progressCard, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <View style={styles.progressHeader}>
            <Title style={styles.progressTitle}>Today's Progress</Title>
            <Text style={[styles.progressPercentage, { color: theme.colors.primary }]}>
              {Math.round(progress * 100)}%
            </Text>
          </View>
          
          <View style={styles.stepsDisplay}>
            <Text style={[styles.stepsNumber, { color: theme.colors.primary }]}>
              {currentSteps.toLocaleString()}
            </Text>
            <Text style={[styles.stepsGoal, { color: theme.colors.onSurfaceVariant }]}>
              / {dailyGoal.toLocaleString()} steps
            </Text>
          </View>

          <ProgressBar
            progress={progress}
            color={theme.colors.primary}
            style={styles.progressBar}
          />

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Icon name="fire" size={20} color="#FF6B6B" />
              <Text style={[styles.statText, { color: theme.colors.onSurface }]}>
                {Math.round(currentSteps * 0.04)} cal
              </Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="map-marker-distance" size={20} color="#4ECDC4" />
              <Text style={[styles.statText, { color: theme.colors.onSurface }]}>
                {Math.round(currentSteps * 0.0008)} km
              </Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="clock" size={20} color="#45B7D1" />
              <Text style={[styles.statText, { color: theme.colors.onSurface }]}>
                {Math.round(currentSteps / 100)} min
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Weekly Steps Chart */}
      <Card style={[styles.chartCard, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Title style={styles.chartTitle}>Weekly Steps</Title>
          <Text style={[styles.weeklyTotal, { color: theme.colors.primary }]}>
            Total: {weeklySteps.toLocaleString()} steps
          </Text>
          
          <LineChart
            data={chartData}
            width={width - 48}
            height={200}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </Card.Content>
      </Card>

      {/* Active Competitions */}
      {activeCompetitions.length > 0 && (
        <Card style={[styles.competitionsCard, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <View style={styles.competitionsHeader}>
              <Title style={styles.competitionsTitle}>Active Competitions</Title>
              <TouchableOpacity onPress={() => navigation.navigate('Competition')}>
                <Text style={[styles.viewAllText, { color: theme.colors.primary }]}>
                  View All
                </Text>
              </TouchableOpacity>
            </View>

            {activeCompetitions.slice(0, 3).map((competition) => (
              <TouchableOpacity
                key={competition.id}
                style={[styles.competitionItem, { backgroundColor: theme.colors.surfaceVariant }]}
                onPress={() => navigation.navigate('Leaderboard', { competitionId: competition.id })}
              >
                <View style={styles.competitionInfo}>
                  <Text style={[styles.competitionName, { color: theme.colors.onSurface }]}>
                    {competition.name}
                  </Text>
                  <Text style={[styles.competitionParticipants, { color: theme.colors.onSurfaceVariant }]}>
                    {competition.participants.length} participants
                  </Text>
                </View>
                <Icon name="chevron-right" size={20} color={theme.colors.primary} />
              </TouchableOpacity>
            ))}
          </Card.Content>
        </Card>
      )}

      {/* Quick Actions */}
      <Card style={[styles.actionsCard, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Title style={styles.actionsTitle}>Quick Actions</Title>
          
          <View style={styles.actionsGrid}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: theme.colors.surfaceVariant }]}
              onPress={() => navigation.navigate('Competition')}
            >
              <Icon name="trophy" size={24} color={theme.colors.primary} />
              <Text style={[styles.actionText, { color: theme.colors.onSurface }]}>
                Competitions
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: theme.colors.surfaceVariant }]}
              onPress={() => navigation.navigate('Leaderboard')}
            >
              <Icon name="podium" size={24} color={theme.colors.primary} />
              <Text style={[styles.actionText, { color: theme.colors.onSurface }]}>
                Leaderboard
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: theme.colors.surfaceVariant }]}
              onPress={() => navigation.navigate('Rewards')}
            >
              <Icon name="gift" size={24} color={theme.colors.primary} />
              <Text style={[styles.actionText, { color: theme.colors.onSurface }]}>
                Rewards
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: theme.colors.surfaceVariant }]}
              onPress={() => navigation.navigate('Profile')}
            >
              <Icon name="account" size={24} color={theme.colors.primary} />
              <Text style={[styles.actionText, { color: theme.colors.onSurface }]}>
                Profile
              </Text>
            </TouchableOpacity>
          </View>
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
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userDetails: {
    marginLeft: 12,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  userCompany: {
    fontSize: 14,
  },
  notificationButton: {
    padding: 8,
    borderRadius: 20,
  },
  progressCard: {
    marginBottom: 16,
    elevation: 4,
    borderRadius: 12,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 18,
  },
  progressPercentage: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  stepsDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  stepsNumber: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  stepsGoal: {
    fontSize: 16,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    fontWeight: '600',
  },
  chartCard: {
    marginBottom: 16,
    elevation: 4,
    borderRadius: 12,
  },
  chartTitle: {
    fontSize: 18,
    marginBottom: 8,
  },
  weeklyTotal: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  competitionsCard: {
    marginBottom: 16,
    elevation: 4,
    borderRadius: 12,
  },
  competitionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  competitionsTitle: {
    fontSize: 18,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  competitionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  competitionInfo: {
    flex: 1,
  },
  competitionName: {
    fontSize: 16,
    fontWeight: '600',
  },
  competitionParticipants: {
    fontSize: 12,
    marginTop: 2,
  },
  actionsCard: {
    marginBottom: 16,
    elevation: 4,
    borderRadius: 12,
  },
  actionsTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
  },
});

export default DashboardScreen;