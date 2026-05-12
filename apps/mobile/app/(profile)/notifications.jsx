import { View, ScrollView, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { ArrowLeft, Trophy, Users, Target, Gift } from "lucide-react-native";
import { ThemedScreen } from "@/components/ui/ThemedScreen";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedCard } from "@/components/ui/ThemedCard";
import { useTheme } from "@/theme/useTheme";
import { useThemeStore } from "@/theme/themeStore";

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const theme = useTheme();
  const mode = useThemeStore((s) => s.mode);

  const notifications = [
    {
      id: 1,
      type: "win",
      title: "You won a competition!",
      message: "Congratulations! You placed 1st in Push-Up Challenge",
      time: "2m ago",
      icon: Trophy,
      color: "#FFD700",
    },
    {
      id: 2,
      type: "friend",
      title: "New friend request",
      message: "Sarah Johnson wants to be your friend",
      time: "1h ago",
      icon: Users,
      color: "#00FF88",
    },
    {
      id: 3,
      type: "goal",
      title: "Daily goal completed!",
      message: "You completed all your daily goals. +150 XP",
      time: "3h ago",
      icon: Target,
      color: "#00D9FF",
    },
    {
      id: 4,
      type: "reward",
      title: "Reward unlocked!",
      message: "You can now redeem a $10 Amazon Gift Card",
      time: "1d ago",
      icon: Gift,
      color: "#FF006E",
    },
  ];

  return (
    <ThemedScreen>
      <StatusBar style={mode === "dark" ? "light" : "dark"} />
      <View style={{ paddingTop: insets.top + 20, paddingHorizontal: 20 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color={theme.text} />
          </TouchableOpacity>
          <ThemedText
            style={{
              fontSize: 28,
              fontWeight: "bold",
              marginLeft: 16,
            }}
          >
            Notifications
          </ThemedText>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {notifications.map((notif) => {
          const IconComponent = notif.icon;
          return (
            <ThemedCard
              key={notif.id}
              style={{
                flexDirection: "row",
                padding: 16,
                borderRadius: 12,
                marginBottom: 12,
              }}
            >
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: notif.color + "20",
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 16,
                }}
              >
                <IconComponent size={24} color={notif.color} />
              </View>
              <View style={{ flex: 1 }}>
                <ThemedText
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    marginBottom: 4,
                  }}
                >
                  {notif.title}
                </ThemedText>
                <ThemedText style={{ fontSize: 14, opacity: 0.6, marginBottom: 8 }}>
                  {notif.message}
                </ThemedText>
                <ThemedText style={{ fontSize: 12, opacity: 0.4 }}>
                  {notif.time}
                </ThemedText>
              </View>
            </ThemedCard>
          );
        })}
      </ScrollView>
    </ThemedScreen>
  );
}
