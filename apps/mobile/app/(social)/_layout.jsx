import { Stack } from 'expo-router';
import { useTheme } from '@/theme/useTheme';

export default function SocialLayout() {
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