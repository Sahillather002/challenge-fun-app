// src/screens/Payment/CashfreePaymentScreen.tsx

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { Card, Title, Paragraph, Button, TextInput, ActivityIndicator, Snackbar } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';
import { useSupabaseAuth } from '../../context/SupabaseAuthContext'; // Your existing auth context
import { useTheme } from '../../context/ThemeContext'; // Your existing theme context
import { useToast } from '../../context/ToastContext'; // Your existing toast context
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Define payment data types (customize as needed)
interface PaymentData {
  amount: number; // In rupees (e.g., 100 for ₹100)
  currency: string;
  description: string;
}

// Cashfree credentials (use test keys for development; get from Cashfree Dashboard)
const CASHFREE_APP_ID = 'YOUR_TEST_APP_ID'; // Replace with your actual App ID from https://dashboard.cashfree.com
const CASHFREE_SECRET_KEY = 'YOUR_TEST_SECRET_KEY'; // Replace with your actual Secret Key

const CashfreePaymentScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const route = useRoute();
  const { params } = route; // Assuming params contain payment details (e.g., amount, description)
  const { user } = useSupabaseAuth();
  const { theme } = useTheme();
  const { showToast } = useToast();

  // Type the route params to fix TypeScript error
  const { amount: paramAmount, currency: paramCurrency, description: paramDescription } = params as {
    amount?: number;
    currency?: string;
    description?: string;
  };

  // State for payment form
  const [amount, setAmount] = useState<number>(paramAmount || 100); // Default: ₹100
  const [currency, setCurrency] = useState<string>(paramCurrency || 'INR');
  const [description, setDescription] = useState<string>(paramDescription || 'Payment for Challenge Fun App');
  const [loading, setLoading] = useState<boolean>(false);
  const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');

  const handlePayment = async () => {
    if (!amount || amount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount.');
      return;
    }

    setLoading(true);
    try {
      // Simulate payment success (dummy flow - no real API call)
      await new Promise(resolve => setTimeout(resolve, 2000)); // Fake delay
      const mockTransactionId = `txn_${Date.now()}`; // Generate dummy ID

      // Simulate backend response (no real Cashfree call)
      console.log(`Dummy Payment Success: Amount ₹${amount}, ID: ${mockTransactionId}`);

      // Trigger post-payment actions (e.g., update user, show success)
      showToast('Payment successful (Test Mode)!');
      Alert.alert('Success', `Payment of ₹${amount} completed (Test Mode). Transaction ID: ${mockTransactionId}`);

      // Navigate back to Rewards with updated data (e.g., mark a reward as claimed)
      navigation.navigate('Rewards', { newClaim: { id: 'reward_001', amount, claimed: true } });
    } catch (err) {
      console.error('Dummy Payment Error:', err);
      setSnackbarMessage('Payment failed (Test Mode). Please try again.');
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const createCashfreeOrder = async (paymentData: PaymentData): Promise<string> => {
    // Call your backend to create an order and get the order token
    // Replace with your actual backend URL (e.g., Supabase Function)
    const response = await fetch('YOUR_BACKEND_URL/create-cashfree-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentData),
    });
    if (!response.ok) throw new Error('Failed to create order');
    const data = await response.json();
    return data.orderToken; // Cashfree returns an orderToken
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <View style={styles.header}>
            <Icon name="credit-card" size={24} color={theme.colors.primary} />
            <Title style={[styles.title, { color: theme.colors.onSurface }]}>
              Secure Payment (Cashfree)
            </Title>
          </View>

          <Paragraph style={[styles.description, { color: theme.colors.onSurfaceVariant }]}>
            Enter your payment details. Supports UPI, cards, net banking, and more via Cashfree.
          </Paragraph>

          {/* Payment Details Form */}
          <TextInput
            label="Amount (in ₹)"
            value={amount.toString()}
            onChangeText={(text) => setAmount(parseFloat(text) || 0)}
            keyboardType="numeric"
            style={styles.input}
            disabled={loading}
          />

          <TextInput
            label="Description"
            value={description}
            onChangeText={setDescription}
            style={styles.input}
            disabled={loading}
          />

          {/* Payment Button */}
          <Button
            mode="contained"
            onPress={handlePayment}
            loading={loading}
            disabled={loading || !amount}
            style={[styles.payButton, { backgroundColor: theme.colors.primary }]}
            icon="lock"
          >
            {loading ? 'Processing...' : `Pay ₹${amount}`}
          </Button>

          <Paragraph style={[styles.note, { color: theme.colors.onSurfaceVariant }]}>
            Note: Using Cashfree for free, India-optimized payments. Supports multiple payment modes.
          </Paragraph>
        </Card.Content>
      </Card>

      {/* Snackbar for errors */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={4000}
      >
        {snackbarMessage}
      </Snackbar>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  card: { margin: 16, elevation: 4, borderRadius: 12 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 20, marginLeft: 8 },
  description: { marginBottom: 16, textAlign: 'center' },
  input: { marginBottom: 12 },
  payButton: { marginTop: 16, borderRadius: 8 },
  note: { marginTop: 16, fontSize: 12, textAlign: 'center' },
});

export default CashfreePaymentScreen;