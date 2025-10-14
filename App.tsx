import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Platform, View, Text, ActivityIndicator } from 'react-native';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { SupabaseAuthProvider } from './src/context/SupabaseAuthContext';
import { CompetitionProvider } from './src/context/MockCompetitionContext';
import { ToastProvider } from './src/context/ToastContext';

// Import Screens
import LoginScreen from './src/screens/Auth/LoginScreen';
import RegisterScreen from './src/screens/Auth/RegisterScreen';
import CreateCompetitionScreen from './src/screens/Competition/CreateCompetitionScreen';
import PaymentScreen from './src/screens/Payment/PaymentScreen';
import SettingsScreen from './src/screens/Settings/SettingsScreen';
import GoogleFitAccountScreen from './src/screens/Settings/GoogleFitAccountScreen';

// Import Tab Navigator
import MainTabNavigator from './src/navigation/MainTabNavigator';

const Stack = createStackNavigator();

// Inner component that uses theme context
function AppContent() {
  const { theme, isDark } = useTheme();

  return (
    <PaperProvider theme={theme} settings={{ icon: (props) => <MaterialCommunityIcons {...props} /> }}>
      <SupabaseAuthProvider>
        <CompetitionProvider>
          <ToastProvider>
            <NavigationContainer>
              <StatusBar style={isDark ? 'light' : 'dark'} />
              <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Register" component={RegisterScreen} />
                <Stack.Screen name="Main" component={MainTabNavigator} />
                <Stack.Screen name="CreateCompetition" component={CreateCompetitionScreen} />
                <Stack.Screen name="Payment" component={PaymentScreen} />
                <Stack.Screen name="Settings" component={SettingsScreen} />
                <Stack.Screen name="GoogleFitAccount" component={GoogleFitAccountScreen} options={{ title: 'Google Fit Account' }} />
              </Stack.Navigator>
            </NavigationContainer>
          </ToastProvider>
        </CompetitionProvider>
      </SupabaseAuthProvider>
    </PaperProvider>
  );
}

export default function App() {
  const [isOAuthCallback, setIsOAuthCallback] = React.useState(false);

  // Handle OAuth callback in popup window BEFORE rendering the app
  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const hash = window.location.hash;
      
      // Check if this is an OAuth callback (has access_token in URL)
      if (hash && hash.includes('access_token')) {
        const params = new URLSearchParams(hash.substring(1));
        const token = params.get('access_token');
        
        if (token) {
          console.log('🔑 OAuth callback detected in popup');
          setIsOAuthCallback(true);
          
          // Extract expiry time
          const expiresIn = params.get('expires_in');
          const expiresAt = expiresIn ? Date.now() + (parseInt(expiresIn) * 1000) : Date.now() + 3600000;
          
          // Save token and expiry to localStorage
          localStorage.setItem('google_fit_token', token);
          localStorage.setItem('google_fit_token_expiry', expiresAt.toString());
          
          // If this is a popup window, send message to parent and close
          if (window.opener && !window.opener.closed) {
            console.log('📤 Sending success message to parent window');
            window.opener.postMessage({
              type: 'GOOGLE_FIT_AUTH_SUCCESS',
              token: token,
              expiresAt: expiresAt
            }, window.location.origin);
            
            // Clear URL and close popup
            window.history.replaceState(null, '', window.location.pathname);
            
            setTimeout(() => {
              window.close();
            }, 100);
          } else {
            // Not a popup - just clear the hash and reload
            window.history.replaceState(null, '', window.location.pathname + window.location.search);
            window.location.reload();
          }
        }
      }
    }
  }, []);

  // Show loading screen if this is an OAuth callback popup
  if (isOAuthCallback) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text style={{ marginTop: 16, fontSize: 16, color: '#666' }}>
          Connecting Google Fit...
        </Text>
      </View>
    );
  }

  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}