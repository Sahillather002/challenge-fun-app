import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeft, Users, Clock, Trophy, Info } from "lucide-react-native";

export default function CompetitionDetailsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const participants = [
    { id: 1, name: "Sarah Johnson", score: 156, rank: 1 },
    { id: 2, name: "Mike Chen", score: 148, rank: 2 },
    { id: 3, name: "Emma Davis", score: 142, rank: 3 },
    { id: 4, name: "John Doe", score: 135, rank: 4 },
    { id: 5, name: "Alex Kim", score: 129, rank: 5 },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <StatusBar style="light" />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 100 }}
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
            <View
              style={{
                flex: 1,
                backgroundColor: "#1a1a1a",
                borderRadius: 16,
                padding: 16,
                marginRight: 8,
              }}
            >
              <Trophy size={20} color="#00FF88" />
              <Text style={{ fontSize: 12, color: "#999", marginTop: 8 }}>
                Prize Pool
              </Text>
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
            </View>
            <View
              style={{
                flex: 1,
                backgroundColor: "#1a1a1a",
                borderRadius: 16,
                padding: 16,
                marginHorizontal: 4,
              }}
            >
              <Users size={20} color="#00D9FF" />
              <Text style={{ fontSize: 12, color: "#999", marginTop: 8 }}>
                Participants
              </Text>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "bold",
                  color: "#fff",
                  marginTop: 4,
                }}
              >
                234
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                backgroundColor: "#1a1a1a",
                borderRadius: 16,
                padding: 16,
                marginLeft: 8,
              }}
            >
              <Clock size={20} color="#FF006E" />
              <Text style={{ fontSize: 12, color: "#999", marginTop: 8 }}>
                Ends In
              </Text>
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
            </View>
          </View>

          {/* Rules */}
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
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <Info size={20} color="#00FF88" />
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color: "#fff",
                  marginLeft: 12,
                }}
              >
                Competition Rules
              </Text>
            </View>
            <Text style={{ fontSize: 14, color: "#999", lineHeight: 20 }}>
              • Complete as many push-ups as possible{"\n"}• Each rep must be
              recorded via camera{"\n"}• Top 10 participants win prizes{"\n"}•
              Entry fee: 50 points{"\n"}• Competition ends in 2 hours 15 minutes
            </Text>
          </View>

          {/* Leaderboard */}
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: "#fff",
              marginBottom: 16,
            }}
          >
            Current Leaderboard
          </Text>

          {participants.map((participant) => (
            <View
              key={participant.id}
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#1a1a1a",
                padding: 16,
                borderRadius: 12,
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
                          : "#333",
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 12,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "bold",
                    color: participant.rank <= 3 ? "#000" : "#fff",
                  }}
                >
                  {participant.rank}
                </Text>
              </View>
              <Text
                style={{
                  flex: 1,
                  fontSize: 16,
                  fontWeight: "600",
                  color: "#fff",
                }}
              >
                {participant.name}
              </Text>
              <Text
                style={{ fontSize: 18, fontWeight: "bold", color: "#00FF88" }}
              >
                {participant.score}
              </Text>
            </View>
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
          backgroundColor: "#000",
          borderTopWidth: 1,
          borderTopColor: "#1a1a1a",
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
    </View>
  );
}
