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
    <ScrollView className="flex-1 bg-background">
      <Card style={{ margin: 16, elevation: 4, borderRadius: 12, backgroundColor: theme.surface }}>
        <Card.Content>
          <View className="flex-row items-center mb-4">
            <Icon name="credit-card" size={24} color={theme.primary} />
            <Title className="text-xl ml-2 text-foreground">
              Secure Payment (Cashfree)
            </Title>
          </View>

          <Paragraph className="mb-4 text-center text-text-secondary">
            Enter your payment details. Supports UPI, cards, net banking, and more via Cashfree.
          </Paragraph>

          {/* Payment Details Form */}
          <TextInput
            label="Amount (in ₹)"
            value={amount.toString()}
            onChangeText={(text) => setAmount(parseFloat(text) || 0)}
            keyboardType="numeric"
            style={{ marginBottom: 12 }}
            disabled={loading}
          />

          <TextInput
            label="Description"
            value={description}
            onChangeText={setDescription}
            style={{ marginBottom: 12 }}
            disabled={loading}
          />

          {/* Payment Button */}
          <Button
            mode="contained"
            onPress={handlePayment}
            loading={loading}
            disabled={loading || !amount}
            style={{ marginTop: 16, borderRadius: 8, backgroundColor: theme.primary }}
            icon="lock"
          >
            {loading ? 'Processing...' : `Pay ₹${amount}`}
          </Button>

          <Paragraph className="mt-4 text-xs text-center text-text-secondary">
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
  // Kept minimal
});

export default CashfreePaymentScreen;

