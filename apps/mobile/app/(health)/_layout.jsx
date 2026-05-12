import { Stack } from 'expo-router';
import { useTheme } from '@/theme/useTheme';

export default function HealthLayout() {
  const theme = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.background },
      }}
    />
  );
}