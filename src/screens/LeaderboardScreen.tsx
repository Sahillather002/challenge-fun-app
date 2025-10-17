// src/screens/LeaderboardScreen.tsx

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Card, Title, Paragraph, List, Button } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';

interface LeaderboardItem {
  id: number;
  name: string;
  points: number;
  rank: number;
}

const LeaderboardScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const route = useRoute();
  const { theme } = useTheme();

  // Mock leaderboard data (update based on payments/challenges)
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([
    { id: 1, name: 'User A', points: 150, rank: 1 },
    { id: 2, name: 'User B', points: 120, rank: 2 },
  ]);

  useEffect(() => {
    // Simulate updating leaderboard after payment (e.g., add user)
    setLeaderboard(prev => [...prev, { id: 3, name: 'You', points: 100, rank: 3 }].sort((a, b) => b.points - a.points));
  }, []);

  const renderItem = ({ item }: { item: LeaderboardItem }) => (
    <List.Item
      title={`${item.rank}. ${item.name}`}
      description={`${item.points} points`}
      left={props => <List.Icon {...props} icon="trophy" />}
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Card>
        <Card.Content>
          <Title>Leaderboard</Title>
          <Paragraph>Rankings based on challenges and payments.</Paragraph>
          <FlatList data={leaderboard} renderItem={renderItem} keyExtractor={item => item.id.toString()} />
          <Button onPress={() => navigation.navigate('Rewards')}>Claim Rewards</Button>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
});

export default LeaderboardScreen;
