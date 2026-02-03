import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useSupabaseAuth } from '../../context/SupabaseAuthContext';

const LoginScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localLoading, setLocalLoading] = useState(false);
  const { login } = useSupabaseAuth();
  const { theme } = useTheme();

  const handleLogin = async () => {
    setLocalLoading(true);
    try {
      await login(email, password);
      navigation.replace('Main');
    } catch (error) {
      console.error(error);
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <View style={[styles.container, Platform.OS === 'web' && {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    }]} {...(Platform.OS === 'web' && { className: 'rn-center' })}>
      <View style={[styles.content, Platform.OS === 'web' && {
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(20px)',
        borderRadius: 24,
        padding: 40,
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
        border: '1px solid rgba(255, 255, 255, 0.4)',
        maxWidth: 420,
        width: '100%',
        margin: '0 auto',
      }]} {...(Platform.OS === 'web' && { className: 'rn-form-container' })}>
        <View style={[styles.logoContainer, Platform.OS === 'web' && {
          width: 80,
          height: 80,
          borderRadius: 20,
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px auto',
          boxShadow: '0 10px 25px rgba(79, 70, 229, 0.3)',
        }]} {...(Platform.OS === 'web' && { className: 'rn-logo-container' })}>
          <Text style={styles.logoIcon}>🧙‍♂️</Text>
        </View>

        <Text style={[styles.title, Platform.OS === 'web' && {
          fontSize: 32,
          fontWeight: '800',
          textAlign: 'center',
          marginBottom: 8,
          color: '#1f2937',
          background: 'linear-gradient(135deg, #1f2937 0%, #4f46e5 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }]} {...(Platform.OS === 'web' && { className: 'rn-title' })}>
          Health Competition
        </Text>
        <Text style={[styles.subtitle, Platform.OS === 'web' && {
          fontSize: 16,
          textAlign: 'center',
          marginBottom: 32,
          color: '#6b7280',
          fontWeight: '500',
        }]} {...(Platform.OS === 'web' && { className: 'rn-subtitle' })}>
          Track your progress and compete with friends
        </Text>

        <View style={styles.formContainer}>
          <View style={[styles.formField, Platform.OS === 'web' && {
            marginBottom: 24,
            width: '100%',
          }]} {...(Platform.OS === 'web' && { className: 'rn-form-field' })}>
            <Text style={[styles.fieldLabel, Platform.OS === 'web' && {
              display: 'block',
              marginBottom: 8,
              fontWeight: '700',
              color: '#374151',
              fontSize: 12,
              textTransform: 'uppercase',
              letterSpacing: 1,
            }]} {...(Platform.OS === 'web' && { className: 'rn-form-label' })}>
              EMAIL ADDRESS
            </Text>
            <TextInput
              placeholder="your@email.com"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              style={[styles.input, Platform.OS === 'web' && {
                border: '2px solid #e5e7eb',
                borderRadius: 12,
                padding: '16px 20px',
                fontSize: 16,
                width: '100%',
                boxSizing: 'border-box',
                backgroundColor: 'white',
                fontWeight: '500',
                marginBottom: 16,
                color: '#2c3e50',
              }]}
              {...(Platform.OS === 'web' && { className: 'rn-input' })}
              placeholderTextColor={theme.textSecondary}
            />
          </View>

          <View style={[styles.formField, Platform.OS === 'web' && {
            marginBottom: 24,
            width: '100%',
          }]} {...(Platform.OS === 'web' && { className: 'rn-form-field' })}>
            <Text style={[styles.fieldLabel, Platform.OS === 'web' && {
              display: 'block',
              marginBottom: 8,
              fontWeight: '700',
              color: '#374151',
              fontSize: 12,
              textTransform: 'uppercase',
              letterSpacing: 1,
            }]} {...(Platform.OS === 'web' && { className: 'rn-form-label' })}>
              PASSWORD
            </Text>
            <TextInput
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={[styles.input, Platform.OS === 'web' && {
                border: '2px solid #e5e7eb',
                borderRadius: 12,
                padding: '16px 20px',
                fontSize: 16,
                width: '100%',
                boxSizing: 'border-box',
                backgroundColor: 'white',
                fontWeight: '500',
                marginBottom: 16,
                color: '#2c3e50',
              }]}
              {...(Platform.OS === 'web' && { className: 'rn-input' })}
              placeholderTextColor={theme.textSecondary}
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.button, Platform.OS === 'web' && {
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            color: 'white',
            padding: '16px 32px',
            borderRadius: 12,
            border: 'none',
            cursor: 'pointer',
            fontSize: 16,
            fontWeight: '600',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(79, 70, 229, 0.3)',
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            width: '100%',
            minHeight: 56,
            marginTop: 16,
          }]}
          {...(Platform.OS === 'web' && { className: 'rn-button' })}
          onPress={handleLogin}
          disabled={localLoading}
        >
          {localLoading ? (
            <View {...(Platform.OS === 'web' && { className: 'rn-loading-spinner' })}>
              <ActivityIndicator color={Platform.OS === 'web' ? 'white' : theme.background} size="small" />
            </View>
          ) : (
            <Text style={[styles.buttonText, Platform.OS === 'web' && {
              color: 'white',
              fontSize: 16,
              fontWeight: '600',
              letterSpacing: 0.5,
              textTransform: 'uppercase',
            }]}>SIGN IN</Text>
          )}
        </TouchableOpacity>

        <View style={[styles.linkContainer, Platform.OS === 'web' && {
          textAlign: 'center',
          marginTop: 24,
        }]} {...(Platform.OS === 'web' && { className: 'rn-text-center rn-mt-4' })}>
          <Text style={styles.linkText}>
            Don't have an account?{' '}
            <Text 
              style={[styles.linkText, styles.linkTextBold, Platform.OS === 'web' && {
                color: '#4f46e5',
                fontWeight: '700',
                cursor: 'pointer',
              }]} 
              {...(Platform.OS === 'web' && { className: 'rn-link-text' })}
              onPress={() => navigation.navigate('Register')}
            >
              SIGN UP
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f5f1e8',
    ...(Platform.OS === 'web' && {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      padding: 20,
    }),
  },
  content: {
    padding: 24,
    alignItems: 'center',
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
    ...(Platform.OS === 'web' && {
      backgroundColor: 'rgba(255, 255, 255, 0.98)',
      borderRadius: 24,
      padding: 40,
      boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
    }),
  },
  logoContainer: {
    width: 64,
    height: 64,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#4f46e5',
    ...(Platform.OS === 'web' && {
      width: 80,
      height: 80,
      borderRadius: 20,
      marginBottom: 24,
    }),
  },
  logoIcon: {
    fontSize: 32,
    ...(Platform.OS === 'web' && {
      fontSize: 40,
    }),
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#2c3e50',
    ...(Platform.OS === 'web' && {
      fontSize: 32,
      fontWeight: '800',
    }),
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    color: '#7d8a96',
    ...(Platform.OS === 'web' && {
      fontWeight: '500',
    }),
  },
  formContainer: {
    width: '100%',
    ...(Platform.OS !== 'web' && {
      padding: 20,
      borderRadius: 12,
      backgroundColor: 'white',
      borderWidth: 1,
      borderColor: '#e5e7eb',
    }),
  },
  formField: {
    marginBottom: 20,
    ...(Platform.OS === 'web' && {
      marginBottom: 24,
    }),
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 8,
    color: '#374151',
    textTransform: 'uppercase',
    ...(Platform.OS === 'web' && {
      fontWeight: '700',
    }),
  },
  input: {
    fontSize: 16,
    fontWeight: '500',
    paddingVertical: 12,
    paddingHorizontal: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    color: '#2c3e50',
    ...(Platform.OS === 'web' && {
      borderWidth: 2,
      borderColor: '#e5e7eb',
      borderRadius: 12,
      paddingHorizontal: 20,
      paddingVertical: 16,
      marginBottom: 0,
      backgroundColor: 'white',
    }),
  },
  button: {
    width: '100%',
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    backgroundColor: '#4f46e5',
    ...(Platform.OS === 'web' && {
      height: 56,
      borderRadius: 12,
      marginTop: 32,
    }),
  },
  buttonText: {
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 1,
    color: 'white',
    textTransform: 'uppercase',
    ...(Platform.OS === 'web' && {
      fontSize: 16,
      fontWeight: '600',
      letterSpacing: 0.5,
    }),
  },
  linkContainer: {
    marginTop: 20,
    ...(Platform.OS === 'web' && {
      marginTop: 24,
    }),
  },
  linkText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#7d8a96',
    textAlign: 'center',
  },
  linkTextBold: {
    fontWeight: 'bold',
    color: '#4f46e5',
    ...(Platform.OS === 'web' && {
      fontWeight: '700',
      cursor: 'pointer',
    }),
  },
});

export default LoginScreen;
