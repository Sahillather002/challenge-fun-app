import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  TextInput,
  RadioButton,
} from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSupabaseAuth } from '../../context/SupabaseAuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { Payment } from '../../types';
import { supabaseHelpers } from '../../config/supabase';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const PaymentScreen = () => {
  const route = useRoute();
  const { competitionId } = route.params as { competitionId: string };
  const navigation = useNavigation();

  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [formData, setFormData] = useState({
    upiId: '',
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
    bankName: '',
  });
  const [loading, setLoading] = useState(false);
  const { user } = useSupabaseAuth();
  const { theme } = useTheme();
  const toast = useToast();

  const entryFee = 50; // Default entry fee
  const convenienceFee = 2;
  const totalAmount = entryFee + convenienceFee;

  const handlePayment = async () => {
    // Validate form based on payment method
    if (paymentMethod === 'upi' && !formData.upiId) {
      toast.error('Please enter your UPI ID');
      return;
    }

    if (paymentMethod === 'card') {
      if (!formData.cardNumber || !formData.cardHolder || !formData.expiryDate || !formData.cvv) {
        toast.error('Please fill in all card details');
        return;
      }
    }

    if (paymentMethod === 'netbanking' && !formData.bankName) {
      toast.error('Please select your bank');
      return;
    }

    setLoading(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create and save payment record
      const paymentData = {
        user_id: user?.id || '',
        competition_id: competitionId,
        amount: totalAmount,
        status: 'completed',
        payment_method: paymentMethod,
        created_at: new Date().toISOString(),
      };

      await supabaseHelpers.payments.create(paymentData);
      console.log('Payment processed and saved:', paymentData);

      toast.success(`Payment successful! ₹${totalAmount} paid.`);
      setTimeout(() => {
        navigation.navigate('Main' as never);
      }, 1000);
    } catch (error: any) {
      toast.error('Payment failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const renderUPIForm = () => (
    <View style={styles.paymentForm}>
      <TextInput
        label="UPI ID"
        value={formData.upiId}
        onChangeText={(value) => updateFormData('upiId', value)}
        mode="outlined"
        placeholder="username@upi"
        keyboardType="email-address"
        style={styles.input}
        right={
          <TextInput.Icon
            icon="account-search"
            onPress={() => toast.info('UPI verification feature coming soon!')}
          />
        }
      />

      <View style={styles.upiApps}>
        <Text style={[styles.upiAppsLabel, { color: theme.onSurface }]}>
          Popular UPI Apps:
        </Text>
        <View style={styles.upiAppButtons}>
          {['GPay', 'PhonePe', 'Paytm'].map((app) => (
            <TouchableOpacity
              key={app}
              style={[styles.upiAppButton, { backgroundColor: theme.surfaceVariant }]}
              onPress={() => toast.info(`${app} integration coming soon!`)}
            >
              <Text style={[styles.upiAppText, { color: theme.onSurface }]}>
                {app}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  const renderCardForm = () => (
    <View style={styles.paymentForm}>
      <TextInput
        label="Card Number"
        value={formData.cardNumber}
        onChangeText={(value) => updateFormData('cardNumber', value)}
        mode="outlined"
        placeholder="1234 5678 9012 3456"
        keyboardType="numeric"
        maxLength={19}
        style={styles.input}
        right={<TextInput.Icon icon="credit-card" />}
      />

      <TextInput
        label="Cardholder Name"
        value={formData.cardHolder}
        onChangeText={(value) => updateFormData('cardHolder', value)}
        mode="outlined"
        placeholder="John Doe"
        style={styles.input}
      />

      <View style={styles.cardRow}>
        <TextInput
          label="Expiry Date"
          value={formData.expiryDate}
          onChangeText={(value) => updateFormData('expiryDate', value)}
          mode="outlined"
          placeholder="MM/YY"
          keyboardType="numeric"
          maxLength={5}
          style={[styles.input, styles.halfInput]}
        />
        <TextInput
          label="CVV"
          value={formData.cvv}
          onChangeText={(value) => updateFormData('cvv', value)}
          mode="outlined"
          placeholder="123"
          keyboardType="numeric"
          maxLength={3}
          secureTextEntry
          style={[styles.input, styles.halfInput]}
        />
      </View>

      <View style={styles.cardIcons}>
        <Icon name="visa" size={32} color="#1A1F71" />
        <Icon name="mastercard" size={32} color="#EB001B" />
        <Icon name="amex" size={32} color="#006FCF" />
      </View>
    </View>
  );

  const renderNetBankingForm = () => (
    <View style={styles.paymentForm}>
      <Text style={[styles.bankLabel, { color: theme.onSurface }]}>
        Select Your Bank:
      </Text>

      <View style={styles.banksList}>
        {[
          'State Bank of India',
          'HDFC Bank',
          'ICICI Bank',
          'Axis Bank',
          'Kotak Bank',
          'PNB Bank',
        ].map((bank) => (
          <TouchableOpacity
            key={bank}
            style={[
              styles.bankOption,
              formData.bankName === bank && {
                backgroundColor: theme.primaryContainer,
                borderColor: theme.primary,
              },
            ]}
            onPress={() => updateFormData('bankName', bank)}
          >
            <RadioButton
              value={bank}
              status={formData.bankName === bank ? 'checked' : 'unchecked'}
              onPress={() => updateFormData('bankName', bank)}
            />
            <Text style={[styles.bankName, { color: theme.onSurface }]}>
              {bank}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color={theme.primary} />
        </TouchableOpacity>
        <Title style={styles.headerTitle}>Payment</Title>
        <View style={styles.placeholder} />
      </View>

      {/* Payment Summary */}
      <Card style={[styles.summaryCard, { backgroundColor: theme.surface }]}>
        <Card.Content>
          <Title style={styles.summaryTitle}>Payment Summary</Title>

          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: theme.onSurfaceVariant }]}>
              Competition Entry Fee
            </Text>
            <Text style={[styles.summaryValue, { color: theme.onSurface }]}>
              ₹{entryFee}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: theme.onSurfaceVariant }]}>
              Convenience Fee
            </Text>
            <Text style={[styles.summaryValue, { color: theme.onSurface }]}>
              ₹{convenienceFee}
            </Text>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.outline }]} />

          <View style={styles.summaryRow}>
            <Text style={[styles.totalLabel, { color: theme.onSurface }]}>
              Total Amount
            </Text>
            <Text style={[styles.totalValue, { color: theme.primary }]}>
              ₹{totalAmount}
            </Text>
          </View>
        </Card.Content>
      </Card>

      {/* Payment Methods */}
      <Card style={[styles.paymentCard, { backgroundColor: theme.surface }]}>
        <Card.Content>
          <Title style={styles.paymentTitle}>Select Payment Method</Title>

          <View style={styles.paymentMethods}>
            <TouchableOpacity
              style={[
                styles.paymentMethod,
                paymentMethod === 'upi' && {
                  backgroundColor: theme.primaryContainer,
                  borderColor: theme.primary,
                },
              ]}
              onPress={() => setPaymentMethod('upi')}
            >
              <Icon name="cellphone" size={24} color={theme.primary} />
              <Text style={[styles.paymentMethodText, { color: theme.onSurface }]}>
                UPI
              </Text>
              <RadioButton
                value="upi"
                status={paymentMethod === 'upi' ? 'checked' : 'unchecked'}
                onPress={() => setPaymentMethod('upi')}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.paymentMethod,
                paymentMethod === 'card' && {
                  backgroundColor: theme.primaryContainer,
                  borderColor: theme.primary,
                },
              ]}
              onPress={() => setPaymentMethod('card')}
            >
              <Icon name="credit-card" size={24} color={theme.primary} />
              <Text style={[styles.paymentMethodText, { color: theme.onSurface }]}>
                Credit/Debit Card
              </Text>
              <RadioButton
                value="card"
                status={paymentMethod === 'card' ? 'checked' : 'unchecked'}
                onPress={() => setPaymentMethod('card')}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.paymentMethod,
                paymentMethod === 'netbanking' && {
                  backgroundColor: theme.primaryContainer,
                  borderColor: theme.primary,
                },
              ]}
              onPress={() => setPaymentMethod('netbanking')}
            >
              <Icon name="bank" size={24} color={theme.primary} />
              <Text style={[styles.paymentMethodText, { color: theme.onSurface }]}>
                Net Banking
              </Text>
              <RadioButton
                value="netbanking"
                status={paymentMethod === 'netbanking' ? 'checked' : 'unchecked'}
                onPress={() => setPaymentMethod('netbanking')}
              />
            </TouchableOpacity>
          </View>
        </Card.Content>
      </Card>

      {/* Payment Form */}
      <Card style={[styles.formCard, { backgroundColor: theme.surface }]}>
        <Card.Content>
          <Title style={styles.formTitle}>
            {paymentMethod === 'upi' && 'UPI Details'}
            {paymentMethod === 'card' && 'Card Details'}
            {paymentMethod === 'netbanking' && 'Bank Details'}
          </Title>

          {paymentMethod === 'upi' && renderUPIForm()}
          {paymentMethod === 'card' && renderCardForm()}
          {paymentMethod === 'netbanking' && renderNetBankingForm()}
        </Card.Content>
      </Card>

      {/* Security Note */}
      <View style={styles.securityNote}>
        <Icon name="shield-check" size={20} color="#4CAF50" />
        <Text style={[styles.securityText, { color: theme.onSurfaceVariant }]}>
          Your payment information is secure and encrypted
        </Text>
      </View>

      {/* Pay Button */}
      <Button
        mode="contained"
        onPress={handlePayment}
        loading={loading}
        disabled={loading}
        style={[styles.payButton, { backgroundColor: theme.primary }]}
        contentStyle={styles.payButtonContent}
      >
        {loading ? 'Processing...' : `Pay ₹${totalAmount}`}
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  // Kept minimal
  contentContainer: {
    padding: 16,
  },
});

export default PaymentScreen;

