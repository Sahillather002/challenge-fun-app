import { View, ScrollView, Text, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { X, Camera } from "lucide-react-native";
import { useState } from "react";
import { ThemedScreen } from "@/components/ui/ThemedScreen";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedCard } from "@/components/ui/ThemedCard";
import { useTheme } from "@/theme/useTheme";
import { useThemeStore } from "@/theme/themeStore";

export default function LiveBattleScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [reps, setReps] = useState(0);
  const [time, setTime] = useState("14:32");
  const theme = useTheme();
  const mode = useThemeStore((s) => s.mode);

  return (
    <ThemedScreen>
      <StatusBar style="light" />
      <LinearGradient colors={["#FF006E", theme.background]} style={{ flex: 1 }}>
        <View
          style={{
            paddingTop: insets.top + 20,
            paddingHorizontal: 20,
            flex: 1,
          }}
        >
          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 32,
            }}
          >
            <Text style={{ fontSize: 24, fontWeight: "bold", color: "#fff" }}>
              Push-Up Battle
            </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <X size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Timer */}
          <View style={{ alignItems: "center", marginBottom: 48 }}>
            <Text style={{ fontSize: 16, color: "rgba(255,255,255,0.6)", marginBottom: 8 }}>
              Time Remaining
            </Text>
            <Text style={{ fontSize: 48, fontWeight: "bold", color: "#fff" }}>
              {time}
            </Text>
          </View>

          {/* Rep Counter */}
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text style={{ fontSize: 20, color: "rgba(255,255,255,0.6)", marginBottom: 16 }}>
              Your Reps
            </Text>
            <LinearGradient
              colors={["#00FF88", "#00D9FF"]}
              style={{
                width: 200,
                height: 200,
                borderRadius: 100,
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 32,
              }}
            >
              <Text style={{ fontSize: 80, fontWeight: "bold", color: "#000" }}>
                {reps}
              </Text>
            </LinearGradient>
            <TouchableOpacity
              onPress={() => setReps(reps + 1)}
              style={{
                backgroundColor: theme.card,
                paddingHorizontal: 32,
                paddingVertical: 16,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.1)",
              }}
            >
              <ThemedText style={{ fontSize: 18, fontWeight: "bold" }}>
                + Add Rep
              </ThemedText>
            </TouchableOpacity>
          </View>

          {/* Mini Leaderboard */}
          <ThemedCard
            style={{
              padding: 16,
              marginBottom: insets.bottom + 20,
            }}
          >
            <ThemedText style={{ fontSize: 14, opacity: 0.6, marginBottom: 12 }}>
              Top 3 Right Now
            </ThemedText>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <ThemedText style={{ fontSize: 12 }}>
                1. Sarah Johnson
              </ThemedText>
              <Text
                style={{ fontSize: 12, color: "#00FF88", fontWeight: "bold" }}
              >
                156
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 8,
              }}
            >
              <ThemedText style={{ fontSize: 12 }}>2. Mike Chen</ThemedText>
              <Text
                style={{ fontSize: 12, color: "#00FF88", fontWeight: "bold" }}
              >
                148
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 8,
              }}
            >
              <ThemedText style={{ fontSize: 12 }}>3. Emma Davis</ThemedText>
              <Text
                style={{ fontSize: 12, color: "#00FF88", fontWeight: "bold" }}
              >
                142
              </Text>
            </View>
          </ThemedCard>
        </View>
      </LinearGradient>
    </ThemedScreen>
  );
}
