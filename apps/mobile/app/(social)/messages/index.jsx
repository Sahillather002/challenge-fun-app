import { View, ScrollView, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Search, MessageCircle, Plus } from "lucide-react-native";
import { ThemedScreen } from "@/components/ui/ThemedScreen";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedCard } from "@/components/ui/ThemedCard";
import { useTheme } from "@/theme/useTheme";
import { useThemeStore } from "@/theme/themeStore";

const MOCK_CHATS = [
  {
    id: "1",
    user: {
      name: "Alex Rivera",
      username: "arivera_fit",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200",
    },
    lastMessage: "Great workout today! 💪",
    time: "2m ago",
    unread: 2,
  },
  {
    id: "2",
    user: {
      name: "Sarah Chen",
      username: "sarah_trains",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
    },
    lastMessage: "Want to join the morning run?",
    time: "1h ago",
    unread: 0,
  },
];

export default function MessagesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const theme = useTheme();
  const mode = useThemeStore((s) => s.mode);

  return (
    <ThemedScreen>
      <StatusBar style={mode === "dark" ? "light" : "dark"} />
      <View style={{ paddingTop: insets.top + 20, paddingHorizontal: 20, flex: 1 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <ThemedText style={{ fontSize: 28, fontWeight: "bold" }}>Messages</ThemedText>
          <TouchableOpacity onPress={() => router.push("/friends")}>
            <LinearGradient
              colors={[theme.primary, theme.secondary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ width: 40, height: 40, borderRadius: 20, justifyContent: "center", alignItems: "center" }}
            >
              <Plus size={20} color="#000" />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <ThemedCard style={{ padding: 12, marginBottom: 24, flexDirection: "row", alignItems: "center" }}>
          <Search size={20} color={theme.muted} />
          <ThemedText style={{ marginLeft: 12, opacity: 0.6 }}>Search conversations...</ThemedText>
        </ThemedCard>

        <ScrollView showsVerticalScrollIndicator={false}>
          {MOCK_CHATS.map((chat) => (
            <TouchableOpacity
              key={chat.id}
              onPress={() => router.push(`/social/messages/${chat.id}`)}
              style={{ marginBottom: 16 }}
            >
              <ThemedCard style={{ flexDirection: "row", alignItems: "center", padding: 16 }}>
                <View style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: theme.primary + "20", justifyContent: "center", alignItems: "center", marginRight: 16 }}>
                  <ThemedText style={{ fontWeight: "bold" }}>
                    {chat.user.name[0]}
                  </ThemedText>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <ThemedText style={{ fontWeight: "600" }}>{chat.user.name}</ThemedText>
                    <ThemedText style={{ fontSize: 12, opacity: 0.6 }}>{chat.time}</ThemedText>
                  </View>
                  <ThemedText style={{ opacity: 0.6 }} numberOfLines={1}>
                    {chat.lastMessage}
                  </ThemedText>
                </View>
                {chat.unread > 0 && (
                  <View style={{ backgroundColor: theme.primary, width: 20, height: 20, borderRadius: 10, justifyContent: "center", alignItems: "center", marginLeft: 12 }}>
                    <ThemedText style={{ color: "#000", fontSize: 12, fontWeight: "bold" }}>
                      {chat.unread}
                    </ThemedText>
                  </View>
                )}
              </ThemedCard>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </ThemedScreen>
  );
}