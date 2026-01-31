import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { Flame, Trophy, Award, Star, Medal, Target } from "lucide-react-native";

export default function GoalsScreen() {
  const insets = useSafeAreaInsets();

  const badges = [
    {
      id: 1,
      name: "First Win",
      icon: Trophy,
      color: "#FFD700",
      unlocked: true,
    },
    {
      id: 2,
      name: "7 Day Streak",
      icon: Flame,
      color: "#FF6B35",
      unlocked: true,
    },
    {
      id: 3,
      name: "10 Battles",
      icon: Target,
      color: "#00FF88",
      unlocked: true,
    },
    { id: 4, name: "100 Wins", icon: Award, color: "#8338EC", unlocked: false },
    {
      id: 5,
      name: "Top 10 Rank",
      icon: Star,
      color: "#FF006E",
      unlocked: false,
    },
    { id: 6, name: "Marathon", icon: Medal, color: "#00D9FF", unlocked: false },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <StatusBar style="light" />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ paddingTop: insets.top + 20, paddingHorizontal: 20 }}>
          <Text
            style={{
              fontSize: 28,
              fontWeight: "bold",
              color: "#fff",
              marginBottom: 24,
            }}
          >
            Goals & Achievements
          </Text>

          {/* Streak Card */}
          <LinearGradient
            colors={["#FF6B35", "#FF006E"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ borderRadius: 20, padding: 24, marginBottom: 24 }}
          >
            <View style={{ alignItems: "center" }}>
              <Flame size={64} color="#fff" />
              <Text
                style={{
                  fontSize: 48,
                  fontWeight: "bold",
                  color: "#fff",
                  marginTop: 12,
                }}
              >
                7
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  color: "rgba(255,255,255,0.9)",
                  marginBottom: 16,
                }}
              >
                Day Streak! 🔥
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "rgba(255,255,255,0.8)",
                  textAlign: "center",
                }}
              >
                You're on fire! Keep completing your daily goals to maintain
                your streak.
              </Text>
            </View>
          </LinearGradient>

          {/* Daily Goals */}
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: "#fff",
              marginBottom: 16,
            }}
          >
            Today's Goals
          </Text>

          <View
            style={{
              backgroundColor: "#1a1a1a",
              borderRadius: 16,
              padding: 20,
              marginBottom: 16,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <Text style={{ fontSize: 16, color: "#fff", fontWeight: "600" }}>
                Complete 1 Battle
              </Text>
              <Text
                style={{ fontSize: 14, color: "#00FF88", fontWeight: "bold" }}
              >
                +50 XP
              </Text>
            </View>
            <View
              style={{
                height: 8,
                backgroundColor: "#2a2a2a",
                borderRadius: 4,
                overflow: "hidden",
              }}
            >
              <View
                style={{
                  height: "100%",
                  width: "100%",
                  backgroundColor: "#00FF88",
                  borderRadius: 4,
                }}
              />
            </View>
            <Text style={{ fontSize: 12, color: "#00FF88", marginTop: 8 }}>
              ✓ Complete
            </Text>
          </View>

          <View
            style={{
              backgroundColor: "#1a1a1a",
              borderRadius: 16,
              padding: 20,
              marginBottom: 16,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <Text style={{ fontSize: 16, color: "#fff", fontWeight: "600" }}>
                10,000 Steps
              </Text>
              <Text
                style={{ fontSize: 14, color: "#00FF88", fontWeight: "bold" }}
              >
                +75 XP
              </Text>
            </View>
            <View
              style={{
                height: 8,
                backgroundColor: "#2a2a2a",
                borderRadius: 4,
                overflow: "hidden",
              }}
            >
              <View
                style={{
                  height: "100%",
                  width: "75%",
                  backgroundColor: "#00D9FF",
                  borderRadius: 4,
                }}
              />
            </View>
            <Text style={{ fontSize: 12, color: "#999", marginTop: 8 }}>
              7,500 / 10,000 steps
            </Text>
          </View>

          <View
            style={{
              backgroundColor: "#1a1a1a",
              borderRadius: 16,
              padding: 20,
              marginBottom: 24,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <Text style={{ fontSize: 16, color: "#fff", fontWeight: "600" }}>
                Burn 600 Calories
              </Text>
              <Text
                style={{ fontSize: 14, color: "#00FF88", fontWeight: "bold" }}
              >
                +100 XP
              </Text>
            </View>
            <View
              style={{
                height: 8,
                backgroundColor: "#2a2a2a",
                borderRadius: 4,
                overflow: "hidden",
              }}
            >
              <View
                style={{
                  height: "100%",
                  width: "45%",
                  backgroundColor: "#FF006E",
                  borderRadius: 4,
                }}
              />
            </View>
            <Text style={{ fontSize: 12, color: "#999", marginTop: 8 }}>
              270 / 600 calories
            </Text>
          </View>

          {/* Badges */}
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: "#fff",
              marginBottom: 16,
            }}
          >
            Badges Collection
          </Text>

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            {badges.map((badge) => {
              const IconComponent = badge.icon;
              return (
                <View
                  key={badge.id}
                  style={{
                    width: "48%",
                    backgroundColor: badge.unlocked ? "#1a1a1a" : "#0a0a0a",
                    borderRadius: 16,
                    padding: 20,
                    marginBottom: 16,
                    alignItems: "center",
                    opacity: badge.unlocked ? 1 : 0.5,
                    borderWidth: badge.unlocked ? 2 : 0,
                    borderColor: badge.unlocked ? badge.color : "transparent",
                  }}
                >
                  <IconComponent
                    size={40}
                    color={badge.unlocked ? badge.color : "#333"}
                  />
                  <Text
                    style={{
                      fontSize: 14,
                      color: badge.unlocked ? "#fff" : "#666",
                      marginTop: 12,
                      fontWeight: "600",
                      textAlign: "center",
                    }}
                  >
                    {badge.name}
                  </Text>
                  {badge.unlocked && (
                    <Text
                      style={{ fontSize: 12, color: badge.color, marginTop: 4 }}
                    >
                      Unlocked ✓
                    </Text>
                  )}
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
