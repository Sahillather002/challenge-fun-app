import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useThemeStore } from "@/theme/themeStore";
import { StatusBar } from "expo-status-bar";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 30,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function RootLayoutNav() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const mode = useThemeStore((state) => state.mode);

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === "auth";

    if (!user && !inAuthGroup) {
      // Redirect to login if not authenticated
      router.replace("/auth/login");
    } else if (user && inAuthGroup) {
      // Redirect to home if authenticated  
      router.replace("/(tabs)");
    }
  }, [user, loading, segments]);

  useEffect(() => {
    if (!loading) {
      SplashScreen.hideAsync();
    }
  }, [loading]);

  if (loading) {
    return null;
  }

  return (
    <>
      <StatusBar style={mode === "dark" ? "light" : "dark"} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen
          name="camera/index"
          options={{
            presentation: 'fullScreenModal',
            animation: 'slide_from_bottom'
          }}
        />
        <Stack.Screen
          name="stories/[userId]"
          options={{
            presentation: 'transparentModal',
            animation: 'fade'
          }}
        />
        <Stack.Screen name="snaps/inbox" options={{ headerShown: true, title: 'Snaps' }} />
        <Stack.Screen
          name="snaps/[id]"
          options={{
            presentation: 'fullScreenModal',
            animation: 'fade'
          }}
        />
      </Stack>

    </>
  );
}

export default function RootLayout() {
  const loadTheme = useThemeStore((state) => state.loadTheme);

  useEffect(() => {
    loadTheme();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AuthProvider>
          <RootLayoutNav />
        </AuthProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
