import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Filter } from "lucide-react-native";
import { useState } from "react";

export default function CompeteScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState("All");

  const filters = ["All", "Strength", "Cardio", "Steps", "Endurance"];

  const competitions = [
    {
      id: "1",
      title: "💪 Push-Up Challenge",
      prize: "$500",
      participants: 234,
      time: "2h 15m",
      category: "Strength",
      live: true,
    },
    {
      id: "2",
      title: "🏃 5K Sprint Battle",
      prize: "$750",
      participants: 189,
      time: "4h 30m",
      category: "Cardio",
      live: true,
    },
    {
      id: "3",
      title: "🚶 10K Steps League",
      prize: "$300",
      participants: 456,
      time: "6h 45m",
      category: "Steps",
      live: true,
    },
    {
      id: "4",
      title: "🧘 Plank Endurance",
      prize: "$400",
      participants: 167,
      time: "1h 20m",
      category: "Endurance",
      live: true,
    },
    {
      id: "5",
      title: "🏋️ Squat Marathon",
      prize: "$600",
      participants: 298,
      time: "3h 10m",
      category: "Strength",
      live: false,
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <StatusBar style="light" />
      <View style={{ paddingTop: insets.top + 20, paddingHorizontal: 20 }}>
        <Text
          style={{
            fontSize: 28,
            fontWeight: "bold",
            color: "#fff",
            marginBottom: 20,
          }}
        >
          Live Competitions
        </Text>

        {/* Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 24, flexGrow: 0 }}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter}
              onPress={() => setSelectedFilter(filter)}
              style={{
                backgroundColor:
                  selectedFilter === filter ? "#00FF88" : "#1a1a1a",
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderRadius: 20,
                marginRight: 12,
              }}
            >
              <Text
                style={{
                  color: selectedFilter === filter ? "#000" : "#fff",
                  fontWeight: "600",
                  fontSize: 14,
                }}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {competitions.map((comp) => (
          <TouchableOpacity
            key={comp.id}
            onPress={() => router.push(`/competition/${comp.id}`)}
            style={{
              backgroundColor: "#1a1a1a",
              borderRadius: 20,
              overflow: "hidden",
              marginBottom: 16,
            }}
          >
            <LinearGradient
              colors={comp.live ? ["#FF006E", "#8338EC"] : ["#333", "#555"]}
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
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    color: "#fff",
                    flex: 1,
                  }}
                >
                  {comp.title}
                </Text>
                {comp.live && (
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
                )}
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
                    {comp.prize}
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
                    {comp.participants}
                  </Text>
                </View>
                <View>
                  <Text
                    style={{ fontSize: 12, color: "#999", marginBottom: 4 }}
                  >
                    {comp.live ? "Ends In" : "Starts In"}
                  </Text>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                      color: comp.live ? "#FF006E" : "#FFD700",
                    }}
                  >
                    {comp.time}
                  </Text>
                </View>
              </View>
              <TouchableOpacity>
                <LinearGradient
                  colors={
                    comp.live ? ["#00FF88", "#00D9FF"] : ["#FFD700", "#FFA500"]
                  }
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
                    {comp.live ? "Join Battle" : "Register"}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
