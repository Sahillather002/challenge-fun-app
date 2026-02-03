import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Flame, Trophy, Target, TrendingUp, Bell } from "lucide-react-native";
import { ThemedScreen } from "@/components/ui/ThemedScreen";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedCard } from "@/components/ui/ThemedCard";
import { useThemeStore } from "@/theme/themeStore";
import { useTheme } from "@/theme/useTheme";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const theme = useTheme();
  const mode = useThemeStore((s) => s.mode);

  return (
    <ThemedScreen>
      <StatusBar style={mode === "dark" ? "light" : "dark"} />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ paddingTop: insets.top + 20, paddingHorizontal: 20 }}>
          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 32,
            }}
          >
            <View>
              <ThemedText style={{ fontSize: 28, fontWeight: "bold" }}>
                Welcome Back! 👋
              </ThemedText>
              <ThemedText style={{ fontSize: 14, opacity: 0.6, marginTop: 4 }}>
                Ready to crush your goals?
              </ThemedText>
            </View>
            <TouchableOpacity
              onPress={() => router.push("/notifications")}
              style={{
                backgroundColor: theme.card,
                width: 48,
                height: 48,
                borderRadius: 24,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Bell size={20} color={theme.text} />
              <View
                style={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  width: 8,
                  height: 8,
                  backgroundColor: theme.danger,
                  borderRadius: 4,
                }}
              />
            </TouchableOpacity>
          </View>

          {/* XP & Level Card */}
          <LinearGradient
            colors={[theme.primary, theme.danger]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: 20,
              padding: 20,
              marginBottom: 24,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View>
                <Text
                  style={{
                    fontSize: 14,
                    color: "rgba(255,255,255,0.8)",
                    marginBottom: 4,
                  }}
                >
                  Current Level
                </Text>
                <Text
                  style={{ fontSize: 32, fontWeight: "bold", color: "#fff" }}
                >
                  Level 12
                </Text>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Text
                  style={{
                    fontSize: 14,
                    color: "rgba(255,255,255,0.8)",
                    marginBottom: 4,
                  }}
                >
                  XP Points
                </Text>
                <Text
                  style={{ fontSize: 24, fontWeight: "bold", color: theme.secondary }}
                >
                  2,450
                </Text>
              </View>
            </View>
            <View style={{ marginTop: 16 }}>
              <View
                style={{
                  height: 8,
                  backgroundColor: "rgba(255,255,255,0.2)",
                  borderRadius: 4,
                  overflow: "hidden",
                }}
              >
                <View
                  style={{
                    height: "100%",
                    width: "65%",
                    backgroundColor: theme.secondary,
                    borderRadius: 4,
                  }}
                />
              </View>
              <Text
                style={{
                  fontSize: 12,
                  color: "rgba(255,255,255,0.7)",
                  marginTop: 8,
                }}
              >
                750 XP to Level 13
              </Text>
            </View>
          </LinearGradient>

          {/* Streak Card */}
          <ThemedCard
            style={{
              marginBottom: 24,
              borderWidth: 2,
              borderColor: "#FF6B35",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <Flame size={28} color="#FF6B35" />
              <ThemedText
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  marginLeft: 12,
                }}
              >
                7 Day Streak! 🔥
              </ThemedText>
            </View>
            <ThemedText style={{ fontSize: 14, opacity: 0.6 }}>
              Keep it going! Complete today's goal to maintain your streak.
            </ThemedText>
          </ThemedCard>

          {/* Daily Goal Progress */}
          <ThemedCard
            style={{
              marginBottom: 24,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <ThemedText style={{ fontSize: 18, fontWeight: "bold" }}>
                Today's Goal
              </ThemedText>
              <ThemedText
                style={{ fontSize: 14, color: theme.secondary, fontWeight: "600" }}
              >
                75% Complete
              </ThemedText>
            </View>
            <View
              style={{
                height: 12,
                backgroundColor: theme.card,
                borderRadius: 6,
                overflow: "hidden",
                marginBottom: 16,
                borderWidth: 1,
                borderColor: theme.card,
              }}
            >
              <LinearGradient
                colors={[theme.secondary, theme.primary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ height: "100%", width: "75%", borderRadius: 6 }}
              />
            </View>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View>
                <ThemedText style={{ fontSize: 12, opacity: 0.6, marginBottom: 4 }}>
                  Steps
                </ThemedText>
                <ThemedText
                  style={{ fontSize: 16, fontWeight: "bold" }}
                >
                  7,500 / 10,000
                </ThemedText>
              </View>
              <View>
                <ThemedText style={{ fontSize: 12, opacity: 0.6, marginBottom: 4 }}>
                  Calories
                </ThemedText>
                <ThemedText
                  style={{ fontSize: 16, fontWeight: "bold" }}
                >
                  450 / 600
                </ThemedText>
              </View>
            </View>
          </ThemedCard>

          {/* Quick Stats */}
          <ThemedText
            style={{
              fontSize: 20,
              fontWeight: "bold",
              marginBottom: 16,
            }}
          >
            Quick Stats
          </ThemedText>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 24,
            }}
          >
            <ThemedCard
              style={{
                flex: 1,
                marginRight: 8,
                alignItems: "center",
              }}
            >
              <Trophy size={24} color="#FFD700" />
              <ThemedText
                style={{
                  fontSize: 24,
                  fontWeight: "bold",
                  marginTop: 8,
                }}
              >
                24
              </ThemedText>
              <ThemedText style={{ fontSize: 12, opacity: 0.6, marginTop: 4 }}>
                Wins
              </ThemedText>
            </ThemedCard>
            <ThemedCard
              style={{
                flex: 1,
                marginHorizontal: 8,
                alignItems: "center",
              }}
            >
              <Target size={24} color={theme.secondary} />
              <ThemedText
                style={{
                  fontSize: 24,
                  fontWeight: "bold",
                  marginTop: 8,
                }}
              >
                67
              </ThemedText>
              <ThemedText style={{ fontSize: 12, opacity: 0.6, marginTop: 4 }}>
                Battles
              </ThemedText>
            </ThemedCard>
            <ThemedCard
              style={{
                flex: 1,
                marginLeft: 8,
                alignItems: "center",
              }}
            >
              <TrendingUp size={24} color={theme.primary} />
              <ThemedText
                style={{
                  fontSize: 24,
                  fontWeight: "bold",
                  marginTop: 8,
                }}
              >
                #47
              </ThemedText>
              <ThemedText style={{ fontSize: 12, opacity: 0.6, marginTop: 4 }}>
                Rank
              </ThemedText>
            </ThemedCard>
          </View>

          {/* Upcoming Competitions */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <ThemedText style={{ fontSize: 20, fontWeight: "bold" }}>
              Live Now
            </ThemedText>
            <TouchableOpacity onPress={() => router.push("/(tabs)/compete")}>
              <ThemedText
                style={{ fontSize: 14, color: theme.secondary, fontWeight: "600" }}
              >
                View All
              </ThemedText>
            </TouchableOpacity>
          </View>

          {/* Competition Card */}
          <TouchableOpacity
            onPress={() => router.push("/competition/1")}
            style={{
              borderRadius: 20,
              overflow: "hidden",
              marginBottom: 16,
            }}
          >
            <ThemedCard style={{ padding: 0 }}>
              <LinearGradient
                colors={[theme.danger, theme.primary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ padding: 16 }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{ fontSize: 18, fontWeight: "bold", color: "#fff" }}
                  >
                    💪 Push-Up Challenge
                  </Text>
                  <View
                    style={{
                      backgroundColor: "rgba(0,255,136,0.2)",
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 12,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: "bold",
                        color: "#00FF88",
                      }}
                    >
                      LIVE
                    </Text>
                  </View>
                </View>
              </LinearGradient>
              <View style={{ padding: 16 }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 12,
                  }}
                >
                  <View>
                    <ThemedText
                      style={{ fontSize: 12, opacity: 0.6, marginBottom: 4 }}
                    >
                      Prize Pool
                    </ThemedText>
                    <ThemedText
                      style={{
                        fontSize: 18,
                        fontWeight: "bold",
                        color: theme.secondary,
                      }}
                    >
                      $500
                    </ThemedText>
                  </View>
                  <View>
                    <ThemedText
                      style={{ fontSize: 12, opacity: 0.6, marginBottom: 4 }}
                    >
                      Participants
                    </ThemedText>
                    <ThemedText
                      style={{ fontSize: 18, fontWeight: "bold" }}
                    >
                      234
                    </ThemedText>
                  </View>
                  <View>
                    <ThemedText
                      style={{ fontSize: 12, opacity: 0.6, marginBottom: 4 }}
                    >
                      Ends In
                    </ThemedText>
                    <ThemedText
                      style={{
                        fontSize: 18,
                        fontWeight: "bold",
                        color: theme.danger,
                      }}
                    >
                      2h 15m
                    </ThemedText>
                  </View>
                </View>
                <TouchableOpacity>
                  <LinearGradient
                    colors={[theme.secondary, theme.primary]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{
                      height: 48,
                      borderRadius: 12,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{ color: "#000", fontSize: 16, fontWeight: "bold" }}
                    >
                      Join Battle
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </ThemedCard>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ThemedScreen>
  );
}
