import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Button, Card, Title, Paragraph } from 'react-native-paper';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const RegisterScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    company: '',
    department: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register, loading, error, user } = useAuth();
  const { theme } = useTheme();

  // Auto-navigate to Dashboard if user is already logged in
  useEffect(() => {
    if (user && !loading) {
      navigation.replace('Dashboard');
    }
  }, [user, loading, navigation]);

  const handleRegister = async () => {
    const { name, email, password, confirmPassword, company, department } = formData;

    if (!name || !email || !password || !company || !department) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    try {
      await register({
        name,
        email,
        password,
        company,
        department,
      });
      // Navigate to Dashboard after successful registration
      navigation.replace('Dashboard');
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Title style={[styles.title, { color: theme.colors.primary }]}>
            Join Health Competition
          </Title>
          <Paragraph style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
            Start your wellness journey today
          </Paragraph>
        </View>

        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Create Account</Title>

            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.colors.surfaceVariant,
                  color: theme.colors.onSurfaceVariant,
                  borderColor: theme.colors.outline
                }
              ]}
              placeholder="Full Name"
              placeholderTextColor={theme.colors.onSurfaceVariant}
              value={formData.name}
              onChangeText={(value) => updateFormData('name', value)}
            />

            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.colors.surfaceVariant,
                  color: theme.colors.onSurfaceVariant,
                  borderColor: theme.colors.outline
                }
              ]}
              placeholder="Email"
              placeholderTextColor={theme.colors.onSurfaceVariant}
              value={formData.email}
              onChangeText={(value) => updateFormData('email', value)}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <View style={styles.passwordContainer}>
              <TextInput
                style={[
                  styles.input,
                  styles.passwordInput,
                  {
                    backgroundColor: theme.colors.surfaceVariant,
                    color: theme.colors.onSurfaceVariant,
                    borderColor: theme.colors.outline
                  }
                ]}
                placeholder="Password"
                placeholderTextColor={theme.colors.onSurfaceVariant}
                value={formData.password}
                onChangeText={(value) => updateFormData('password', value)}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={[styles.eyeButton, { backgroundColor: theme.colors.surfaceVariant }]}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Text style={[styles.eyeButtonText, { color: theme.colors.primary }]}>
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.passwordContainer}>
              <TextInput
                style={[
                  styles.input,
                  styles.passwordInput,
                  {
                    backgroundColor: theme.colors.surfaceVariant,
                    color: theme.colors.onSurfaceVariant,
                    borderColor: theme.colors.outline
                  }
                ]}
                placeholder="Confirm Password"
                placeholderTextColor={theme.colors.onSurfaceVariant}
                value={formData.confirmPassword}
                onChangeText={(value) => updateFormData('confirmPassword', value)}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity
                style={[styles.eyeButton, { backgroundColor: theme.colors.surfaceVariant }]}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Text style={[styles.eyeButtonText, { color: theme.colors.primary }]}>
                  {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                </Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.colors.surfaceVariant,
                  color: theme.colors.onSurfaceVariant,
                  borderColor: theme.colors.outline
                }
              ]}
              placeholder="Company Name"
              placeholderTextColor={theme.colors.onSurfaceVariant}
              value={formData.company}
              onChangeText={(value) => updateFormData('company', value)}
            />

            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.colors.surfaceVariant,
                  color: theme.colors.onSurfaceVariant,
                  borderColor: theme.colors.outline
                }
              ]}
              placeholder="Department"
              placeholderTextColor={theme.colors.onSurfaceVariant}
              value={formData.department}
              onChangeText={(value) => updateFormData('department', value)}
            />

            {error && (
              <Text style={[styles.errorText, { color: theme.colors.error }]}>
                {error}
              </Text>
            )}

            <Button
              mode="contained"
              onPress={handleRegister}
              loading={loading}
              disabled={loading}
              style={[styles.registerButton, { backgroundColor: theme.colors.primary }]}
              contentStyle={styles.buttonContent}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>

            <View style={styles.divider}>
              <View style={[styles.dividerLine, { backgroundColor: theme.colors.outline }]} />
              <Text style={[styles.dividerText, { color: theme.colors.onSurfaceVariant }]}>
                OR
              </Text>
              <View style={[styles.dividerLine, { backgroundColor: theme.colors.outline }]} />
            </View>

            <TouchableOpacity
              style={[styles.loginButton, { borderColor: theme.colors.primary }]}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={[styles.loginButtonText, { color: theme.colors.primary }]}>
                Already have an account? Sign In
              </Text>
            </TouchableOpacity>
          </Card.Content>
        </Card>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.colors.onSurfaceVariant }]}>
            By creating an account, you agree to our Terms & Conditions and Privacy Policy
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  card: {
    elevation: 4,
    borderRadius: 16,
  },
  cardTitle: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
  },
  passwordContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeButton: {
    position: 'absolute',
    right: 12,
    top: 12,
    padding: 8,
    borderRadius: 4,
  },
  eyeButtonText: {
    fontSize: 18,
  },
  errorText: {
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 14,
  },
  registerButton: {
    marginBottom: 16,
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 12,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
  },
  loginButton: {
    borderWidth: 2,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    marginTop: 30,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
  },
});

export default RegisterScreen;