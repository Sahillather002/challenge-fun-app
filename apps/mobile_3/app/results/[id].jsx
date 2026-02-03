import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Trophy, Share2, Home } from "lucide-react-native";
import { ThemedScreen } from "@/components/ui/ThemedScreen";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedCard } from "@/components/ui/ThemedCard";
import { useTheme } from "@/theme/useTheme";
import { useThemeStore } from "@/theme/themeStore";

export default function ResultsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const theme = useTheme();
  const mode = useThemeStore((s) => s.mode);

  const results = [
    { id: 1, name: "Sarah Johnson", score: 156, prize: "$250" },
    { id: 2, name: "Mike Chen", score: 148, prize: "$150" },
    { id: 3, name: "Emma Davis", score: 142, prize: "$100" },
    { id: 4, name: "John Doe", score: 135, prize: "-" },
    { id: 5, name: "Alex Kim", score: 129, prize: "-" },
  ];

  return (
    <ThemedScreen>
      <StatusBar style={mode === "dark" ? "light" : "dark"} />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Winner Banner */}
        <LinearGradient
          colors={["#FFD700", "#FFA500"]}
          style={{
            paddingTop: insets.top + 40,
            paddingBottom: 40,
            alignItems: "center",
          }}
        >
          <Trophy size={80} color="#000" />
          <Text
            style={{
              fontSize: 32,
              fontWeight: "bold",
              color: "#000",
              marginTop: 16,
            }}
          >
            Competition Complete!
          </Text>
          <Text
            style={{ fontSize: 16, color: "#000", marginTop: 8, opacity: 0.8 }}
          >
            💪 Push-Up Challenge
          </Text>
        </LinearGradient>

        <View style={{ paddingHorizontal: 20, paddingTop: 32 }}>
          <ThemedText
            style={{
              fontSize: 24,
              fontWeight: "bold",
              marginBottom: 24,
            }}
          >
            Final Leaderboard
          </ThemedText>

          {results.map((result, index) => (
            <ThemedCard
              key={result.id}
              style={{
                padding: 20,
                marginBottom: 12,
                borderWidth: index === 0 ? 2 : 0,
                borderColor: index === 0 ? "#FFD700" : "transparent",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor:
                      index === 0
                        ? "#FFD700"
                        : index === 1
                          ? "#C0C0C0"
                          : index === 2
                            ? "#CD7F32"
                            : theme.card,
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 16,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                      color: index < 3 ? "#000" : theme.text,
                    }}
                  >
                    {index + 1}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <ThemedText
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                      marginBottom: 4,
                    }}
                  >
                    {result.name}
                  </ThemedText>
                  {result.prize !== "-" && (
                    <Text
                      style={{
                        fontSize: 14,
                        color: "#00FF88",
                        fontWeight: "600",
                      }}
                    >
                      Won {result.prize}
                    </Text>
                  )}
                </View>
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: "bold",
                    color: index === 0 ? "#FFD700" : theme.text,
                  }}
                >
                  {result.score}
                </Text>
              </View>
            </ThemedCard>
          ))}

          {/* Action Buttons */}
          <TouchableOpacity style={{ marginTop: 24 }}>
            <LinearGradient
              colors={["#00FF88", "#00D9FF"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                height: 56,
                borderRadius: 12,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Share2 size={20} color="#000" />
              <Text
                style={{
                  color: "#000",
                  fontSize: 16,
                  fontWeight: "bold",
                  marginLeft: 12,
                }}
              >
                Share Results
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/(tabs)")}
            style={{
              height: 56,
              borderRadius: 12,
              backgroundColor: theme.card,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 12,
            }}
          >
            <Home size={20} color={theme.text} />
            <ThemedText
              style={{
                fontSize: 16,
                fontWeight: "bold",
                marginLeft: 12,
              }}
            >
              Back to Home
            </ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ThemedScreen>
  );
}
