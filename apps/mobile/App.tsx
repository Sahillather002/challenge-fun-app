import 'react-native-gesture-handler';
import './global.css';

import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider, MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Platform, View, Text, ActivityIndicator, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { SupabaseAuthProvider } from './src/context/SupabaseAuthContext';
import { CompetitionProvider } from './src/context/MockCompetitionContext';
import { ToastProvider } from './src/context/ToastContext';

// Import CSS for web platform
if (Platform.OS === 'web') {
  try {
    require('./web.css');
  } catch (error) {
    console.warn('Could not load web.css:', error);
  }
}

// Import Screens
import LoginScreen from './src/screens/Auth/LoginScreen';
import RegisterScreen from './src/screens/Auth/RegisterScreen';
import CreateCompetitionScreen from './src/screens/Competition/CreateCompetitionScreen';
import PaymentScreen from './src/screens/Payment/PaymentScreen';
import SettingsScreen from './src/screens/Settings/SettingsScreen';
import GoogleFitAccountScreen from './src/screens/Settings/GoogleFitAccountScreen';
import WorkoutScreen from './src/screens/Workout/WorkoutScreen';

// Import New Screens for Dummy Flow
import TransactionsScreen from './src/screens/TransactionsScreen';
import LeaderboardScreen from './src/screens/LeaderboardScreen';

// Import Tab Navigator
import MainTabNavigator from './src/navigation/MainTabNavigator';

const Stack = createStackNavigator();

// Inner component that uses theme context
function AppContent() {
  const { theme, mode } = useTheme();

  const baseTheme = mode === 'dark' ? MD3DarkTheme : MD3LightTheme;
  const paperTheme = {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      ...theme, // Add custom tokens
      // Map core Paper colors to design system
      background: theme.background,
      surface: theme.card,
      primary: theme.textPrimary,
      onSurface: theme.textPrimary,
      // Ensure elevation is preserved (critical for preventing crash)
      elevation: baseTheme.colors.elevation,
    },
  };

  return (
    <PaperProvider theme={paperTheme} settings={{ icon: (props) => <MaterialCommunityIcons {...props} /> }}>
      <View style={[styles.rootContainer, { backgroundColor: theme.background }]}>
        {/* Simple Grid Background Overlay */}
        <View style={styles.gridOverlay} />

        <SupabaseAuthProvider>
          <CompetitionProvider>
            <ToastProvider>
              <NavigationContainer theme={{
                dark: mode === 'dark',
                colors: {
                  primary: theme.textPrimary,
                  background: 'transparent',
                  card: theme.card,
                  text: theme.textPrimary,
                  border: theme.border,
                  notification: theme.success,
                }
              }}>
                <StatusBar style="light" />
                <Stack.Navigator initialRouteName="Login" screenOptions={{
                  headerShown: false,
                  cardStyle: {
                    backgroundColor: 'transparent',
                    shadowOpacity: 0, // Disable legacy shadows causing web warnings
                    shadowRadius: 0,
                  }
                }}>
                  <Stack.Screen name="Login" component={LoginScreen} />
                  <Stack.Screen name="Register" component={RegisterScreen} />
                  <Stack.Screen name="Main" component={MainTabNavigator} />
                  <Stack.Screen name="CreateCompetition" component={CreateCompetitionScreen} />
                  <Stack.Screen name="Payment" component={PaymentScreen} />
                  <Stack.Screen name="Settings" component={SettingsScreen} />
                  <Stack.Screen name="GoogleFitAccount" component={GoogleFitAccountScreen} options={{ title: 'Google Fit Account' }} />
                  <Stack.Screen name="Transactions" component={TransactionsScreen} options={{ title: 'Transactions' }} />
                  <Stack.Screen name="Leaderboard" component={LeaderboardScreen} options={{ title: 'Leaderboard' }} />
                  <Stack.Screen name="Workout" component={WorkoutScreen} />
                </Stack.Navigator>
              </NavigationContainer>
            </ToastProvider>
          </CompetitionProvider>
        </SupabaseAuthProvider>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
  gridOverlay: {
    position: 'absolute',
    inset: 0,
    opacity: 0.1,
    // Note: React Native doesn't support background-image easily, 
    // so we'll sticking to clean obsidian for now
  }
});

export default function App() {
  console.log('🚀 App function executing...');
  const [isOAuthCallback, setIsOAuthCallback] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  console.log("📍 isOAuthCallback state:", isOAuthCallback)

  // Error boundary effect
  useEffect(() => {
    const errorHandler = (event: ErrorEvent) => {
      console.error('Global error:', event.error);
      setError(event.error);
    };

    const unhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      setError(event.reason instanceof Error ? event.reason : new Error(String(event.reason)));
    };

    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.addEventListener('error', errorHandler);
      window.addEventListener('unhandledrejection', unhandledRejection);

      return () => {
        window.removeEventListener('error', errorHandler);
        window.removeEventListener('unhandledrejection', unhandledRejection);
      };
    }
  }, []);

  // Enhanced CSS injection for web platform with better styling
  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const injectWebStyles = () => {
        // Remove any existing styles first
        const existingStyle = document.getElementById('rn-web-enhanced-styles');
        if (existingStyle) {
          existingStyle.remove();
        }

        const style = document.createElement('style');
        style.id = 'rn-web-enhanced-styles';
        style.type = 'text/css';

        // Use innerHTML instead of textContent for better compatibility
        style.innerHTML = `
          /* CRITICAL: Enhanced Web Styles for React Native Web - MAXIMUM FORCE APPLY */
          
          /* Global Reset with Maximum Priority */
          * {
            box-sizing: border-box !important;
          }
          
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            height: 100% !important;
            width: 100% !important;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
              'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
              sans-serif !important;
            -webkit-font-smoothing: antialiased !important;
            -moz-osx-font-smoothing: grayscale !important;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
            overflow-x: hidden !important;
          }
          
          #root {
            height: 100vh !important;
            width: 100vw !important;
            position: relative !important;
          }
          
          /* React Native Web Component Overrides - MAXIMUM SPECIFICITY */
          div[data-focusable="true"] {
            outline: none !important;
          }
          
          /* CRITICAL: Direct React Native Web Element Targeting */
          div[style*="display: flex"],
          div[style*="flex-direction"],
          div[style*="align-items"],
          div[style*="justify-content"] {
            box-sizing: border-box !important;
          }
          
          /* ULTRA HIGH PRIORITY: Login Screen Styling */
          
          /* Main container - Multiple selectors for maximum coverage */
          .rn-center,
          div.rn-center,
          [class*="rn-center"],
          [data-testid*="center"],
          div[style*="justify-content: center"][style*="align-items: center"],
          div[style*="min-height: 100vh"] {
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            min-height: 100vh !important;
            padding: 20px !important;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
            width: 100vw !important;
            position: relative !important;
          }
          
          /* Form container - Ultra specific targeting */
          .rn-form-container,
          div.rn-form-container,
          [class*="rn-form-container"],
          [data-testid*="form"],
          div[style*="max-width"][style*="padding"] {
            max-width: 420px !important;
            width: 100% !important;
            padding: 40px !important;
            background: rgba(255, 255, 255, 0.98) !important;
            backdrop-filter: blur(20px) !important;
            -webkit-backdrop-filter: blur(20px) !important;
            border-radius: 24px !important;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15) !important;
            border: 1px solid rgba(255, 255, 255, 0.4) !important;
            margin: 20px auto !important;
            display: block !important;
            position: relative !important;
            z-index: 10 !important;
          }
          
          /* Logo container - Maximum targeting */
          .rn-logo-container,
          div.rn-logo-container,
          [class*="rn-logo-container"],
          div[style*="border-radius"][style*="justify-content: center"] {
            width: 80px !important;
            height: 80px !important;
            border-radius: 20px !important;
            background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%) !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            margin: 0 auto 24px auto !important;
            box-shadow: 0 10px 25px rgba(79, 70, 229, 0.3) !important;
          }
          
          /* Title styling - Maximum coverage */
          .rn-title,
          div.rn-title,
          [class*="rn-title"],
          h1, h2, h3,
          div[style*="font-size"][style*="font-weight"][style*="text-align: center"] {
            font-size: 32px !important;
            font-weight: 800 !important;
            text-align: center !important;
            margin-bottom: 8px !important;
            color: #1f2937 !important;
            background: linear-gradient(135deg, #1f2937 0%, #4f46e5 100%) !important;
            -webkit-background-clip: text !important;
            -webkit-text-fill-color: transparent !important;
            background-clip: text !important;
            display: block !important;
          }
          
          /* Subtitle styling */
          .rn-subtitle,
          div.rn-subtitle,
          [class*="rn-subtitle"],
          p {
            font-size: 16px !important;
            text-align: center !important;
            margin-bottom: 32px !important;
            color: #6b7280 !important;
            font-weight: 500 !important;
            display: block !important;
          }
          
          /* Form field containers */
          .rn-form-field,
          div.rn-form-field,
          [class*="rn-form-field"],
          div[style*="margin-bottom"] {
            margin-bottom: 24px !important;
            display: block !important;
            width: 100% !important;
          }
          
          /* Form labels */
          .rn-form-label,
          div.rn-form-label,
          [class*="rn-form-label"],
          label {
            display: block !important;
            margin-bottom: 8px !important;
            font-weight: 700 !important;
            color: #374151 !important;
            font-size: 12px !important;
            text-transform: uppercase !important;
            letter-spacing: 1px !important;
          }
          
          /* Input fields - CRITICAL STYLING */
          .rn-input,
          input.rn-input,
          [class*="rn-input"],
          input,
          input[type="text"],
          input[type="email"],
          input[type="password"],
          textarea {
            border: 2px solid #e5e7eb !important;
            border-radius: 12px !important;
            padding: 16px 20px !important;
            font-size: 16px !important;
            width: 100% !important;
            box-sizing: border-box !important;
            transition: all 0.3s ease !important;
            background-color: white !important;
            font-weight: 500 !important;
            display: block !important;
            margin-bottom: 16px !important;
            color: #2c3e50 !important;
          }
          
          .rn-input:focus,
          input.rn-input:focus,
          [class*="rn-input"]:focus,
          input:focus,
          input[type="text"]:focus,
          input[type="email"]:focus,
          input[type="password"]:focus,
          textarea:focus {
            outline: none !important;
            border-color: #4f46e5 !important;
            box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.15) !important;
            background-color: #fefefe !important;
          }
          
          /* Button styling - MAXIMUM PRIORITY */
          .rn-button,
          div.rn-button,
          [class*="rn-button"],
          button,
          div[role="button"],
          div[style*="cursor: pointer"][style*="background"] {
            background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%) !important;
            color: white !important;
            padding: 16px 32px !important;
            border-radius: 12px !important;
            border: none !important;
            cursor: pointer !important;
            font-size: 16px !important;
            font-weight: 600 !important;
            transition: all 0.3s ease !important;
            text-align: center !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            box-shadow: 0 4px 15px rgba(79, 70, 229, 0.3) !important;
            text-transform: uppercase !important;
            letter-spacing: 0.5px !important;
            width: 100% !important;
            min-height: 56px !important;
            margin-top: 16px !important;
          }
          
          .rn-button:hover,
          div.rn-button:hover,
          [class*="rn-button"]:hover,
          button:hover,
          div[role="button"]:hover {
            background: linear-gradient(135deg, #4338ca 0%, #6d28d9 100%) !important;
            transform: translateY(-2px) !important;
            box-shadow: 0 8px 25px rgba(79, 70, 229, 0.4) !important;
          }
          
          .rn-button:active,
          div.rn-button:active,
          [class*="rn-button"]:active,
          button:active,
          div[role="button"]:active {
            transform: translateY(0) !important;
          }
          
          /* Loading spinner */
          .rn-loading-spinner,
          div.rn-loading-spinner,
          [class*="rn-loading-spinner"] {
            border: 3px solid rgba(79, 70, 229, 0.2) !important;
            border-top: 3px solid #4f46e5 !important;
            border-radius: 50% !important;
            width: 24px !important;
            height: 24px !important;
            animation: rn-spin 1s linear infinite !important;
            display: inline-block !important;
          }
          
          @keyframes rn-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          /* Link styling */
          .rn-link-text,
          span.rn-link-text,
          [class*="rn-link-text"],
          a {
            color: #4f46e5 !important;
            text-decoration: none !important;
            font-weight: 700 !important;
            cursor: pointer !important;
            transition: color 0.2s ease !important;
          }
          
          .rn-link-text:hover,
          span.rn-link-text:hover,
          [class*="rn-link-text"]:hover,
          a:hover {
            color: #4338ca !important;
            text-decoration: underline !important;
          }
          
          /* Utility classes */
          .rn-text-center,
          div.rn-text-center,
          [class*="rn-text-center"] {
            text-align: center !important;
          }
          
          .rn-mb-4,
          div.rn-mb-4,
          [class*="rn-mb-4"] {
            margin-bottom: 16px !important;
          }
          
          .rn-mt-4,
          div.rn-mt-4,
          [class*="rn-mt-4"] {
            margin-top: 16px !important;
          }
          
          /* EMERGENCY FALLBACK: Style all flex containers that look like our login screen */
          div[style*="flex: 1"][style*="justify-content: center"] {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
            min-height: 100vh !important;
            padding: 20px !important;
          }
          
          div[style*="padding: 24px"][style*="align-items: center"] {
            background: rgba(255, 255, 255, 0.98) !important;
            border-radius: 24px !important;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15) !important;
            max-width: 420px !important;
            margin: 0 auto !important;
          }
          
          /* Responsive design */
          @media (max-width: 768px) {
            .rn-form-container,
            div.rn-form-container,
            [class*="rn-form-container"],
            div[style*="max-width"][style*="padding"] {
              margin: 16px !important;
              padding: 32px 24px !important;
              border-radius: 20px !important;
            }
            
            .rn-center,
            div.rn-center,
            [class*="rn-center"] {
              padding: 16px !important;
            }
            
            .rn-title,
            div.rn-title,
            [class*="rn-title"],
            h1, h2, h3 {
              font-size: 28px !important;
            }
          }
          
          @media (max-width: 480px) {
            .rn-form-container,
            div.rn-form-container,
            [class*="rn-form-container"] {
              margin: 12px !important;
              padding: 24px 20px !important;
            }
            
            .rn-title,
            div.rn-title,
            [class*="rn-title"] {
              font-size: 24px !important;
            }
            
            .rn-button,
            div.rn-button,
            [class*="rn-button"],
            button {
              padding: 14px 24px !important;
              font-size: 14px !important;
            }
            
            .rn-input,
            input.rn-input,
            [class*="rn-input"],
            input {
              padding: 14px 16px !important;
              font-size: 15px !important;
            }
          }
        `;

        // Insert at the beginning of head to ensure high priority
        document.head.insertBefore(style, document.head.firstChild);
        console.log('✅ Enhanced web styles injected with MAXIMUM force apply');

        // AGGRESSIVE mutation observer to re-apply styles if needed
        const observer = new MutationObserver((mutations) => {
          let needsReapply = false;

          mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
              mutation.addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                  const element = node as Element;
                  // Check if this is a React Native Web component that needs styling
                  if (element.tagName === 'DIV' &&
                    (element.getAttribute('style')?.includes('display: flex') ||
                      element.className?.includes('rn-') ||
                      element.getAttribute('data-focusable'))) {
                    needsReapply = true;
                  }
                }
              });
            }
          });

          if (needsReapply) {
            // Re-apply critical styles directly to elements
            setTimeout(() => {
              const centerElements = document.querySelectorAll('.rn-center, [class*="rn-center"]');
              centerElements.forEach(el => {
                const htmlEl = el as HTMLElement;
                htmlEl.style.cssText += `
                  display: flex !important;
                  justify-content: center !important;
                  align-items: center !important;
                  min-height: 100vh !important;
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
                  padding: 20px !important;
                `;
              });

              const formElements = document.querySelectorAll('.rn-form-container, [class*="rn-form-container"]');
              formElements.forEach(el => {
                const htmlEl = el as HTMLElement;
                htmlEl.style.cssText += `
                  background: rgba(255, 255, 255, 0.98) !important;
                  border-radius: 24px !important;
                  padding: 40px !important;
                  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15) !important;
                  max-width: 420px !important;
                  margin: 0 auto !important;
                `;
              });

              const buttonElements = document.querySelectorAll('.rn-button, [class*="rn-button"], button');
              buttonElements.forEach(el => {
                const htmlEl = el as HTMLElement;
                htmlEl.style.cssText += `
                  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%) !important;
                  color: white !important;
                  padding: 16px 32px !important;
                  border-radius: 12px !important;
                  border: none !important;
                  cursor: pointer !important;
                  font-size: 16px !important;
                  font-weight: 600 !important;
                  width: 100% !important;
                  min-height: 56px !important;
                `;
              });

              const inputElements = document.querySelectorAll('.rn-input, [class*="rn-input"], input');
              inputElements.forEach(el => {
                const htmlEl = el as HTMLElement;
                htmlEl.style.cssText += `
                  border: 2px solid #e5e7eb !important;
                  border-radius: 12px !important;
                  padding: 16px 20px !important;
                  font-size: 16px !important;
                  width: 100% !important;
                  background-color: white !important;
                `;
              });

              console.log('🔄 Styles re-applied via mutation observer');
            }, 50);
          }
        });

        observer.observe(document.body, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ['class', 'style']
        });

        // Also add a periodic style enforcer
        const styleEnforcer = setInterval(() => {
          // Check if our styles are still present
          const existingStyle = document.getElementById('rn-web-enhanced-styles');
          if (!existingStyle) {
            console.log('🚨 Styles were removed, re-injecting...');
            injectWebStyles();
          }
        }, 2000);

        // Clean up interval after 30 seconds
        setTimeout(() => {
          clearInterval(styleEnforcer);
        }, 30000);
      };

      // Inject styles immediately and on DOM ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectWebStyles);
      } else {
        injectWebStyles();
      }

      // Also inject after a short delay to ensure React Native Web has rendered
      setTimeout(injectWebStyles, 100);
      setTimeout(injectWebStyles, 500);
      setTimeout(injectWebStyles, 1000);
    }
  }, []);

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

  // Show error screen if there's an error
  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', padding: 20 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#F44336', marginBottom: 16 }}>
          App Error
        </Text>
        <Text style={{ fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 20 }}>
          {error.message || String(error)}
        </Text>
        <Text style={{ fontSize: 12, color: '#999', textAlign: 'center', marginBottom: 20 }}>
          Check the console for more details
        </Text>
        <TouchableOpacity
          onPress={() => {
            setError(null);
            if (Platform.OS === 'web' && typeof window !== 'undefined') {
              window.location.reload();
            }
          }}
          style={{ backgroundColor: '#6200ee', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 }}
        >
          <Text style={{ color: '#fff', fontWeight: '600' }}>Reload App</Text>
        </TouchableOpacity>
      </View>
    );
  }

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