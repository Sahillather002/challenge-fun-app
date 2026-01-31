import { View, Text, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { X, Camera } from "lucide-react-native";
import { useState } from "react";

export default function LiveBattleScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [reps, setReps] = useState(0);
  const [time, setTime] = useState("14:32");

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <StatusBar style="light" />
      <LinearGradient colors={["#FF006E", "#000"]} style={{ flex: 1 }}>
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
            <Text style={{ fontSize: 16, color: "#999", marginBottom: 8 }}>
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
            <Text style={{ fontSize: 20, color: "#999", marginBottom: 16 }}>
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
                backgroundColor: "#1a1a1a",
                paddingHorizontal: 32,
                paddingVertical: 16,
                borderRadius: 12,
              }}
            >
              <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>
                + Add Rep
              </Text>
            </TouchableOpacity>
          </View>

          {/* Mini Leaderboard */}
          <View
            style={{
              backgroundColor: "#1a1a1a",
              borderRadius: 16,
              padding: 16,
              marginBottom: insets.bottom + 20,
            }}
          >
            <Text style={{ fontSize: 14, color: "#999", marginBottom: 12 }}>
              Top 3 Right Now
            </Text>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={{ fontSize: 12, color: "#fff" }}>
                1. Sarah Johnson
              </Text>
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
              <Text style={{ fontSize: 12, color: "#fff" }}>2. Mike Chen</Text>
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
              <Text style={{ fontSize: 12, color: "#fff" }}>3. Emma Davis</Text>
              <Text
                style={{ fontSize: 12, color: "#00FF88", fontWeight: "bold" }}
              >
                142
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}
