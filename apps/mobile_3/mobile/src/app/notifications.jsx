import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { ArrowLeft, Trophy, Users, Target, Gift } from "lucide-react-native";

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

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
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <StatusBar style="light" />
      <View style={{ paddingTop: insets.top + 20, paddingHorizontal: 20 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color="#fff" />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 28,
              fontWeight: "bold",
              color: "#fff",
              marginLeft: 16,
            }}
          >
            Notifications
          </Text>
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
            <TouchableOpacity
              key={notif.id}
              style={{
                flexDirection: "row",
                backgroundColor: "#1a1a1a",
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
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    color: "#fff",
                    marginBottom: 4,
                  }}
                >
                  {notif.title}
                </Text>
                <Text style={{ fontSize: 14, color: "#999", marginBottom: 8 }}>
                  {notif.message}
                </Text>
                <Text style={{ fontSize: 12, color: "#666" }}>
                  {notif.time}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
