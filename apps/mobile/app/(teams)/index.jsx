import { View, ScrollView, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Users, Plus, Trophy, Calendar, UserPlus } from "lucide-react-native";
import { ThemedScreen } from "@/components/ui/ThemedScreen";
import { ThemedText } from "@/components/ui/ThemedText";
import { PremiumCard } from "@/components/ui/PremiumCard";
import { useTheme } from "@/theme/useTheme";
import { useThemeStore } from "@/theme/themeStore";
import { MotiView } from "moti";

export default function TeamsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const theme = useTheme();
  const mode = useThemeStore((s) => s.mode);

  const mockTeams = [
    {
      id: "1",
      name: "Morning Warriors",
      members: 4,
      rank: 3,
      nextBattle: "Push-Up Challenge",
    },
    {
      id: "2",
      name: "Night Shift",
      members: 6,
      rank: 7,
      nextBattle: "5K Sprint",
    },
  ];

  return (
    <ThemedScreen>
      <StatusBar style={mode === "dark" ? "light" : "dark"} />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ paddingTop: insets.top + 20, paddingHorizontal: 20 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <ThemedText style={{ fontSize: 28, fontWeight: "bold" }}>
              Team Battles
            </ThemedText>
            <TouchableOpacity onPress={() => router.push("/(teams)/create")}>
              <LinearGradient
                colors={[theme.primary, theme.secondary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ width: 48, height: 48, borderRadius: 24, justifyContent: "center", alignItems: "center" }}
              >
                <Plus size={24} color="#000" />
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => router.push("/(teams)/join")}>
            <PremiumCard glass={true} style={{ marginBottom: 24 }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: theme.primary + "20", justifyContent: "center", alignItems: "center", marginRight: 16 }}>
                  <UserPlus size={24} color={theme.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <ThemedText style={{ fontSize: 16, fontWeight: "600" }}>
                    Join a Team
                  </ThemedText>
                  <ThemedText style={{ fontSize: 12, opacity: 0.6 }}>
                    Find and join existing teams
                  </ThemedText>
                </View>
                <ThemedText style={{ fontSize: 18, color: theme.primary }}>→</ThemedText>
              </View>
            </PremiumCard>
          </TouchableOpacity>

          <ThemedText style={{ fontSize: 20, fontWeight: "bold", marginBottom: 16 }}>
            Your Teams
          </ThemedText>

          {mockTeams.map((team, index) => (
            <MotiView
              key={team.id}
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ delay: index * 100 }}
            >
              <TouchableOpacity onPress={() => router.push(`/(teams)/${team.id}`)}>
                <PremiumCard glass={true} style={{ marginBottom: 12 }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: theme.primary + "20", justifyContent: "center", alignItems: "center", marginRight: 16 }}>
                        <Users size={24} color={theme.primary} />
                      </View>
                      <View>
                        <ThemedText style={{ fontSize: 16, fontWeight: "600" }}>
                          {team.name}
                        </ThemedText>
                        <ThemedText style={{ fontSize: 12, opacity: 0.6 }}>
                          {team.members} members • Rank #{team.rank}
                        </ThemedText>
                      </View>
                    </View>
                    <ThemedText style={{ fontSize: 18, color: theme.primary }}>→</ThemedText>
                  </View>
                  <View style={{ marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: theme.card }}>
                    <ThemedText style={{ fontSize: 12, opacity: 0.6 }}>
                      Next: {team.nextBattle}
                    </ThemedText>
                  </View>
                </PremiumCard>
              </TouchableOpacity>
            </MotiView>
          ))}

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>
    </ThemedScreen>
  );
}