import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Filter } from "lucide-react-native";
import { useState } from "react";
import { ThemedScreen } from "@/components/ui/ThemedScreen";
import { ThemedText } from "@/components/ui/ThemedText";
import { useTheme } from "@/theme/useTheme";
import { useThemeStore } from "@/theme/themeStore";
import { MotiView, MotiText } from "moti";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";

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

  const mode = useThemeStore((s) => s.mode);
  const theme = useTheme();

  return (
    <AnimatedBackground>
      <ThemedScreen transparent={true}>
      <StatusBar style={mode === "dark" ? "light" : "dark"} />
      <View style={{ paddingTop: insets.top + 20, paddingHorizontal: 20 }}>
        <MotiText
          from={{ opacity: 0, translateY: -20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 500 }}
          style={{
            fontSize: 28,
            fontWeight: "bold",
            marginBottom: 20,
          }}
        >
          Live Competitions
        </MotiText>

        {/* Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 24, flexGrow: 0 }}
        >
          {filters.map((filter, index) => (
            <MotiView
              key={filter}
              from={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: index * 100 }}
            >
              <TouchableOpacity
                onPress={() => setSelectedFilter(filter)}
                style={{
                  backgroundColor:
                    selectedFilter === filter ? theme.secondary : theme.card,
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  borderRadius: 20,
                  marginRight: 12,
                }}
              >
                <Text
                  style={{
                    color: selectedFilter === filter ? "#000" : theme.text,
                    fontWeight: "600",
                    fontSize: 14,
                  }}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            </MotiView>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {competitions.map((comp, index) => (
          <MotiView
            key={comp.id}
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "spring", stiffness: 200, delay: index * 150 }}
          >
            <TouchableOpacity
              onPress={() => router.push(`/competition/${comp.id}`)}
              style={{
                backgroundColor: theme.card,
                borderRadius: 20,
                overflow: "hidden",
                marginBottom: 16,
              }}
            >
            <LinearGradient
              colors={comp.live ? [theme.danger, "#8338EC"] : ["#333", "#555"]}
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
                    {comp.prize}
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
                    {comp.participants}
                  </ThemedText>
                </View>
                <View>
                  <ThemedText
                    style={{ fontSize: 12, opacity: 0.6, marginBottom: 4 }}
                  >
                    {comp.live ? "Ends In" : "Starts In"}
                  </ThemedText>
                  <ThemedText
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                      color: comp.live ? theme.danger : "#FFD700",
                    }}
                  >
                    {comp.time}
                  </ThemedText>
                </View>
              </View>
              <TouchableOpacity>
                <LinearGradient
                  colors={
                    comp.live ? [theme.secondary, theme.primary] : ["#FFD700", "#FFA500"]
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
          </MotiView>
        ))}
      </ScrollView>
    </ThemedScreen>
    </AnimatedBackground>
  );
}
