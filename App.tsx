import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider } from 'react-native-paper';
import { ThemeProvider } from './src/context/ThemeContext';
import { MockAuthProvider } from './src/context/MockAuthContext';
import { MockCompetitionProvider } from './src/context/MockCompetitionContext';

// Import Screens
import LoginScreen from './src/screens/Auth/LoginScreen';
import RegisterScreen from './src/screens/Auth/RegisterScreen';
import DashboardScreen from './src/screens/Dashboard/DashboardScreen';
import CompetitionScreen from './src/screens/Competition/CompetitionScreen';
import CreateCompetitionScreen from './src/screens/Competition/CreateCompetitionScreen';
import ProfileScreen from './src/screens/Profile/ProfileScreen';
import LeaderboardScreen from './src/screens/Leaderboard/LeaderboardScreen';
import PaymentScreen from './src/screens/Payment/PaymentScreen';
import RewardsScreen from './src/screens/Rewards/RewardsScreen';
import SettingsScreen from './src/screens/Settings/SettingsScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      <ThemeProvider>
        <MockAuthProvider>
          <MockCompetitionProvider>
            <NavigationContainer>
              <StatusBar style="auto" />
              <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Register" component={RegisterScreen} />
                <Stack.Screen name="Dashboard" component={DashboardScreen} />
                <Stack.Screen name="Competition" component={CompetitionScreen} />
                <Stack.Screen name="CreateCompetition" component={CreateCompetitionScreen} />
                <Stack.Screen name="Profile" component={ProfileScreen} />
                <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
                <Stack.Screen name="Payment" component={PaymentScreen} />
                <Stack.Screen name="Rewards" component={RewardsScreen} />
                <Stack.Screen name="Settings" component={SettingsScreen} />
              </Stack.Navigator>
            </NavigationContainer>
          </MockCompetitionProvider>
        </MockAuthProvider>
      </ThemeProvider>
    </PaperProvider>
  );
}