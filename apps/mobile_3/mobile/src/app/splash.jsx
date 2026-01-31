import { View, Text } from "react-native";
import { useEffect } from "react";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { Flame } from "lucide-react-native";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/(tabs)");
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient
      colors={["#FF006E", "#8338EC", "#3A86FF"]}
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <StatusBar style="light" />
      <View style={{ alignItems: "center" }}>
        <View
          style={{
            backgroundColor: "rgba(255,255,255,0.2)",
            padding: 24,
            borderRadius: 30,
            marginBottom: 24,
          }}
        >
          <Flame size={80} color="#fff" />
        </View>
        <Text
          style={{
            fontSize: 48,
            fontWeight: "bold",
            color: "#fff",
            marginBottom: 12,
            letterSpacing: -1,
          }}
        >
          FitBattle
        </Text>
        <Text
          style={{
            fontSize: 18,
            color: "rgba(255,255,255,0.9)",
            fontWeight: "600",
            letterSpacing: 2,
          }}
        >
          COMPETE. SWEAT. WIN.
        </Text>
      </View>
    </LinearGradient>
  );
}
