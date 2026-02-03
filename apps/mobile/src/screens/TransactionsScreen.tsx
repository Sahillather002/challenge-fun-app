// src/screens/TransactionsScreen.tsx

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Card, Title, Paragraph, List, Button, FAB } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useSupabaseAuth } from '../context/SupabaseAuthContext';
import { useToast } from '../context/ToastContext';

interface Transaction {
  id: string;
  amount: number;
  status: string;
  date: string;
  description: string;
}

const TransactionsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const route = useRoute();
  const { theme } = useTheme();
  const { user } = useSupabaseAuth();
  const { showToast } = useToast();
  const { newTransaction } = route.params as { newTransaction?: Transaction } || {};

  // Mock transactions (replace with real data from storage/API)
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 'txn_001', amount: 100, status: 'Success', date: '2023-10-01', description: 'Challenge Entry' },
  ]);

  useEffect(() => {
    if (newTransaction) {
      setTransactions(prev => [newTransaction, ...prev]);
      showToast('New transaction added!');
    }
  }, [newTransaction]);

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <List.Item
      title={`₹${item.amount} - ${item.description}`}
      description={`Status: ${item.status} | Date: ${item.date}`}
      left={props => <List.Icon {...props} icon="credit-card" />}
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Transaction History</Title>
          <Paragraph>Your payment records (Test Mode).</Paragraph>
          <FlatList
            data={transactions}
            renderItem={renderTransaction}
            keyExtractor={item => item.id}
          />
          <Button onPress={() => navigation.navigate('Leaderboard')}>View Leaderboard</Button>
        </Card.Content>
      </Card>
      <FAB
        icon="plus"
        onPress={() => navigation.navigate('CashfreePayment')}
        style={styles.fab}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: { marginBottom: 16 },
  fab: { position: 'absolute', margin: 16, right: 0, bottom: 0 },
});

export default TransactionsScreen;



