import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeft, Users, Clock, Trophy, Info } from "lucide-react-native";
import { ThemedScreen } from "@/components/ui/ThemedScreen";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedCard } from "@/components/ui/ThemedCard";
import { useTheme } from "@/theme/useTheme";
import { useThemeStore } from "@/theme/themeStore";

export default function CompetitionDetailsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const theme = useTheme();
  const mode = useThemeStore((s) => s.mode);

  const participants = [
    { id: 1, name: "Sarah Johnson", score: 156, rank: 1 },
    { id: 2, name: "Mike Chen", score: 148, rank: 2 },
    { id: 3, name: "Emma Davis", score: 142, rank: 3 },
    { id: 4, name: "John Doe", score: 135, rank: 4 },
    { id: 5, name: "Alex Kim", score: 129, rank: 5 },
  ];

  return (
    <ThemedScreen>
      <StatusBar style={mode === "dark" ? "light" : "dark"} />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={["#FF006E", "#8338EC"]}
          style={{
            paddingTop: insets.top + 20,
            paddingHorizontal: 20,
            paddingBottom: 32,
          }}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ marginBottom: 24 }}
          >
            <ArrowLeft size={24} color="#fff" />
          </TouchableOpacity>

          <Text
            style={{
              fontSize: 32,
              fontWeight: "bold",
              color: "#fff",
              marginBottom: 8,
            }}
          >
            💪 Push-Up Challenge
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "rgba(0,255,136,0.2)",
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 12,
              alignSelf: "flex-start",
            }}
          >
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: "#00FF88",
                marginRight: 8,
              }}
            />
            <Text
              style={{ fontSize: 12, fontWeight: "bold", color: "#00FF88" }}
            >
              LIVE NOW
            </Text>
          </View>
        </LinearGradient>

        <View style={{ paddingHorizontal: 20 }}>
          {/* Prize & Info Cards */}
          <View
            style={{ flexDirection: "row", marginBottom: 24, marginTop: -20 }}
          >
            <ThemedCard
              style={{
                flex: 1,
                padding: 16,
                marginRight: 8,
              }}
            >
              <Trophy size={20} color="#00FF88" />
              <ThemedText style={{ fontSize: 12, opacity: 0.6, marginTop: 8 }}>
                Prize Pool
              </ThemedText>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "bold",
                  color: "#00FF88",
                  marginTop: 4,
                }}
              >
                $500
              </Text>
            </ThemedCard>
            <ThemedCard
              style={{
                flex: 1,
                padding: 16,
                marginHorizontal: 4,
              }}
            >
              <Users size={20} color="#00D9FF" />
              <ThemedText style={{ fontSize: 12, opacity: 0.6, marginTop: 8 }}>
                Participants
              </ThemedText>
              <ThemedText
                style={{
                  fontSize: 24,
                  fontWeight: "bold",
                  marginTop: 4,
                }}
              >
                234
              </ThemedText>
            </ThemedCard>
            <ThemedCard
              style={{
                flex: 1,
                padding: 16,
                marginLeft: 8,
              }}
            >
              <Clock size={20} color="#FF006E" />
              <ThemedText style={{ fontSize: 12, opacity: 0.6, marginTop: 8 }}>
                Ends In
              </ThemedText>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "bold",
                  color: "#FF006E",
                  marginTop: 4,
                }}
              >
                2h 15m
              </Text>
            </ThemedCard>
          </View>

          {/* Rules */}
          <ThemedCard
            style={{
              padding: 20,
              marginBottom: 24,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <Info size={20} color="#00FF88" />
              <ThemedText
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  marginLeft: 12,
                }}
              >
                Competition Rules
              </ThemedText>
            </View>
            <ThemedText style={{ fontSize: 14, opacity: 0.6, lineHeight: 20 }}>
              • Complete as many push-ups as possible{"\n"}• Each rep must be
              recorded via camera{"\n"}• Top 10 participants win prizes{"\n"}•
              Entry fee: 50 points{"\n"}• Competition ends in 2 hours 15 minutes
            </ThemedText>
          </ThemedCard>

          {/* Leaderboard */}
          <ThemedText
            style={{
              fontSize: 20,
              fontWeight: "bold",
              marginBottom: 16,
            }}
          >
            Current Leaderboard
          </ThemedText>

          {participants.map((participant) => (
            <ThemedCard
              key={participant.id}
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: 16,
                marginBottom: 12,
              }}
            >
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor:
                    participant.rank === 1
                      ? "#FFD700"
                      : participant.rank === 2
                        ? "#C0C0C0"
                        : participant.rank === 3
                          ? "#CD7F32"
                          : theme.card,
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 12,
                  borderWidth: participant.rank > 3 ? 1 : 0,
                  borderColor: theme.card,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "bold",
                    color: participant.rank <= 3 ? "#000" : theme.text,
                  }}
                >
                  {participant.rank}
                </Text>
              </View>
              <ThemedText
                style={{
                  flex: 1,
                  fontSize: 16,
                  fontWeight: "600",
                }}
              >
                {participant.name}
              </ThemedText>
              <Text
                style={{ fontSize: 18, fontWeight: "bold", color: "#00FF88" }}
              >
                {participant.score}
              </Text>
            </ThemedCard>
          ))}
        </View>
      </ScrollView>

      {/* Join Button */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          paddingHorizontal: 20,
          paddingBottom: insets.bottom + 20,
          paddingTop: 16,
          backgroundColor: theme.background,
          borderTopWidth: 1,
          borderTopColor: theme.card,
        }}
      >
        <TouchableOpacity onPress={() => router.push(`/battle/${id}`)}>
          <LinearGradient
            colors={["#00FF88", "#00D9FF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              height: 56,
              borderRadius: 12,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#000", fontSize: 16, fontWeight: "bold" }}>
              Join Battle (50 points)
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ThemedScreen>
  );
}
