import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Flame, Trophy, Target, TrendingUp, Bell } from "lucide-react-native";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <StatusBar style="light" />
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
              <Text style={{ fontSize: 28, fontWeight: "bold", color: "#fff" }}>
                Welcome Back! 👋
              </Text>
              <Text style={{ fontSize: 14, color: "#999", marginTop: 4 }}>
                Ready to crush your goals?
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push("/notifications")}
              style={{
                backgroundColor: "#1a1a1a",
                width: 48,
                height: 48,
                borderRadius: 24,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Bell size={20} color="#fff" />
              <View
                style={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  width: 8,
                  height: 8,
                  backgroundColor: "#FF006E",
                  borderRadius: 4,
                }}
              />
            </TouchableOpacity>
          </View>

          {/* XP & Level Card */}
          <LinearGradient
            colors={["#8338EC", "#FF006E"]}
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
                  style={{ fontSize: 24, fontWeight: "bold", color: "#00FF88" }}
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
                    backgroundColor: "#00FF88",
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
          <View
            style={{
              backgroundColor: "#1a1a1a",
              borderRadius: 20,
              padding: 20,
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
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: "#fff",
                  marginLeft: 12,
                }}
              >
                7 Day Streak! 🔥
              </Text>
            </View>
            <Text style={{ fontSize: 14, color: "#999" }}>
              Keep it going! Complete today's goal to maintain your streak.
            </Text>
          </View>

          {/* Daily Goal Progress */}
          <View
            style={{
              backgroundColor: "#1a1a1a",
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
                marginBottom: 16,
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "bold", color: "#fff" }}>
                Today's Goal
              </Text>
              <Text
                style={{ fontSize: 14, color: "#00FF88", fontWeight: "600" }}
              >
                75% Complete
              </Text>
            </View>
            <View
              style={{
                height: 12,
                backgroundColor: "#2a2a2a",
                borderRadius: 6,
                overflow: "hidden",
                marginBottom: 16,
              }}
            >
              <LinearGradient
                colors={["#00FF88", "#00D9FF"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ height: "100%", width: "75%", borderRadius: 6 }}
              />
            </View>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View>
                <Text style={{ fontSize: 12, color: "#999", marginBottom: 4 }}>
                  Steps
                </Text>
                <Text
                  style={{ fontSize: 16, fontWeight: "bold", color: "#fff" }}
                >
                  7,500 / 10,000
                </Text>
              </View>
              <View>
                <Text style={{ fontSize: 12, color: "#999", marginBottom: 4 }}>
                  Calories
                </Text>
                <Text
                  style={{ fontSize: 16, fontWeight: "bold", color: "#fff" }}
                >
                  450 / 600
                </Text>
              </View>
            </View>
          </View>

          {/* Quick Stats */}
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: "#fff",
              marginBottom: 16,
            }}
          >
            Quick Stats
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 24,
            }}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: "#1a1a1a",
                borderRadius: 16,
                padding: 16,
                marginRight: 8,
                alignItems: "center",
              }}
            >
              <Trophy size={24} color="#FFD700" />
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "bold",
                  color: "#fff",
                  marginTop: 8,
                }}
              >
                24
              </Text>
              <Text style={{ fontSize: 12, color: "#999", marginTop: 4 }}>
                Wins
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                backgroundColor: "#1a1a1a",
                borderRadius: 16,
                padding: 16,
                marginHorizontal: 8,
                alignItems: "center",
              }}
            >
              <Target size={24} color="#00FF88" />
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "bold",
                  color: "#fff",
                  marginTop: 8,
                }}
              >
                67
              </Text>
              <Text style={{ fontSize: 12, color: "#999", marginTop: 4 }}>
                Battles
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                backgroundColor: "#1a1a1a",
                borderRadius: 16,
                padding: 16,
                marginLeft: 8,
                alignItems: "center",
              }}
            >
              <TrendingUp size={24} color="#00D9FF" />
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "bold",
                  color: "#fff",
                  marginTop: 8,
                }}
              >
                #47
              </Text>
              <Text style={{ fontSize: 12, color: "#999", marginTop: 4 }}>
                Rank
              </Text>
            </View>
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
            <Text style={{ fontSize: 20, fontWeight: "bold", color: "#fff" }}>
              Live Now
            </Text>
            <TouchableOpacity onPress={() => router.push("/(tabs)/compete")}>
              <Text
                style={{ fontSize: 14, color: "#00FF88", fontWeight: "600" }}
              >
                View All
              </Text>
            </TouchableOpacity>
          </View>

          {/* Competition Card */}
          <TouchableOpacity
            onPress={() => router.push("/competition/1")}
            style={{
              backgroundColor: "#1a1a1a",
              borderRadius: 20,
              overflow: "hidden",
              marginBottom: 16,
            }}
          >
            <LinearGradient
              colors={["#FF006E", "#8338EC"]}
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
                  <Text
                    style={{ fontSize: 12, color: "#999", marginBottom: 4 }}
                  >
                    Prize Pool
                  </Text>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                      color: "#00FF88",
                    }}
                  >
                    $500
                  </Text>
                </View>
                <View>
                  <Text
                    style={{ fontSize: 12, color: "#999", marginBottom: 4 }}
                  >
                    Participants
                  </Text>
                  <Text
                    style={{ fontSize: 18, fontWeight: "bold", color: "#fff" }}
                  >
                    234
                  </Text>
                </View>
                <View>
                  <Text
                    style={{ fontSize: 12, color: "#999", marginBottom: 4 }}
                  >
                    Ends In
                  </Text>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                      color: "#FF006E",
                    }}
                  >
                    2h 15m
                  </Text>
                </View>
              </View>
              <TouchableOpacity>
                <LinearGradient
                  colors={["#00FF88", "#00D9FF"]}
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
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
