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
import { useRoute } from '@react-navigation/native';
import { useSupabaseAuth } from '../../context/SupabaseAuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { Payment } from '../../types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const PaymentScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const route = useRoute();
  const { competitionId } = route.params as { competitionId: string };
  
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
      
      // Create payment record
      const paymentData: Payment = {
        id: Date.now().toString(),
        userId: user?.id || '',
        competitionId,
        amount: totalAmount,
        status: 'completed',
        timestamp: new Date(),
        paymentMethod,
      };

      // In a real app, you would save this to your backend
      console.log('Payment processed:', paymentData);

      toast.success(`Payment successful! ₹${totalAmount} paid.`);
      setTimeout(() => {
        navigation.navigate('Competition');
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
        <Text style={[styles.upiAppsLabel, { color: theme.colors.onSurface }]}>
          Popular UPI Apps:
        </Text>
        <View style={styles.upiAppButtons}>
          {['GPay', 'PhonePe', 'Paytm'].map((app) => (
            <TouchableOpacity
              key={app}
              style={[styles.upiAppButton, { backgroundColor: theme.colors.surfaceVariant }]}
              onPress={() => toast.info(`${app} integration coming soon!`)}
            >
              <Text style={[styles.upiAppText, { color: theme.colors.onSurface }]}>
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
      <Text style={[styles.bankLabel, { color: theme.colors.onSurface }]}>
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
                backgroundColor: theme.colors.primaryContainer,
                borderColor: theme.colors.primary,
              },
            ]}
            onPress={() => updateFormData('bankName', bank)}
          >
            <RadioButton
              value={bank}
              status={formData.bankName === bank ? 'checked' : 'unchecked'}
              onPress={() => updateFormData('bankName', bank)}
            />
            <Text style={[styles.bankName, { color: theme.colors.onSurface }]}>
              {bank}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
        <Title style={styles.headerTitle}>Payment</Title>
        <View style={styles.placeholder} />
      </View>

      {/* Payment Summary */}
      <Card style={[styles.summaryCard, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Title style={styles.summaryTitle}>Payment Summary</Title>
          
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: theme.colors.onSurfaceVariant }]}>
              Competition Entry Fee
            </Text>
            <Text style={[styles.summaryValue, { color: theme.colors.onSurface }]}>
              ₹{entryFee}
            </Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: theme.colors.onSurfaceVariant }]}>
              Convenience Fee
            </Text>
            <Text style={[styles.summaryValue, { color: theme.colors.onSurface }]}>
              ₹{convenienceFee}
            </Text>
          </View>
          
          <View style={[styles.divider, { backgroundColor: theme.colors.outline }]} />
          
          <View style={styles.summaryRow}>
            <Text style={[styles.totalLabel, { color: theme.colors.onSurface }]}>
              Total Amount
            </Text>
            <Text style={[styles.totalValue, { color: theme.colors.primary }]}>
              ₹{totalAmount}
            </Text>
          </View>
        </Card.Content>
      </Card>

      {/* Payment Methods */}
      <Card style={[styles.paymentCard, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Title style={styles.paymentTitle}>Select Payment Method</Title>
          
          <View style={styles.paymentMethods}>
            <TouchableOpacity
              style={[
                styles.paymentMethod,
                paymentMethod === 'upi' && {
                  backgroundColor: theme.colors.primaryContainer,
                  borderColor: theme.colors.primary,
                },
              ]}
              onPress={() => setPaymentMethod('upi')}
            >
              <Icon name="cellphone" size={24} color={theme.colors.primary} />
              <Text style={[styles.paymentMethodText, { color: theme.colors.onSurface }]}>
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
                  backgroundColor: theme.colors.primaryContainer,
                  borderColor: theme.colors.primary,
                },
              ]}
              onPress={() => setPaymentMethod('card')}
            >
              <Icon name="credit-card" size={24} color={theme.colors.primary} />
              <Text style={[styles.paymentMethodText, { color: theme.colors.onSurface }]}>
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
                  backgroundColor: theme.colors.primaryContainer,
                  borderColor: theme.colors.primary,
                },
              ]}
              onPress={() => setPaymentMethod('netbanking')}
            >
              <Icon name="bank" size={24} color={theme.colors.primary} />
              <Text style={[styles.paymentMethodText, { color: theme.colors.onSurface }]}>
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
      <Card style={[styles.formCard, { backgroundColor: theme.colors.surface }]}>
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
        <Text style={[styles.securityText, { color: theme.colors.onSurfaceVariant }]}>
          Your payment information is secure and encrypted
        </Text>
      </View>

      {/* Pay Button */}
      <Button
        mode="contained"
        onPress={handlePayment}
        loading={loading}
        disabled={loading}
        style={[styles.payButton, { backgroundColor: theme.colors.primary }]}
        contentStyle={styles.payButtonContent}
      >
        {loading ? 'Processing...' : `Pay ₹${totalAmount}`}
      </Button>
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
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  summaryCard: {
    marginBottom: 16,
    elevation: 4,
    borderRadius: 12,
  },
  summaryTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  paymentCard: {
    marginBottom: 16,
    elevation: 4,
    borderRadius: 12,
  },
  paymentTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  paymentMethods: {
    gap: 12,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  paymentMethodText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
  },
  formCard: {
    marginBottom: 16,
    elevation: 4,
    borderRadius: 12,
  },
  formTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  paymentForm: {
    gap: 16,
  },
  input: {
    marginBottom: 8,
  },
  cardRow: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  cardIcons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 8,
  },
  upiApps: {
    marginTop: 16,
  },
  upiAppsLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  upiAppButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  upiAppButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  upiAppText: {
    fontSize: 12,
    fontWeight: '600',
  },
  bankLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
  },
  banksList: {
    gap: 8,
  },
  bankOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  bankName: {
    flex: 1,
    fontSize: 14,
    marginLeft: 12,
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginVertical: 16,
  },
  securityText: {
    fontSize: 12,
  },
  payButton: {
    borderRadius: 8,
    marginBottom: 20,
  },
  payButtonContent: {
    paddingVertical: 12,
  },
});

export default PaymentScreen;