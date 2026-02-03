import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { Coins, Gift, ShoppingBag } from "lucide-react-native";
import { ThemedScreen } from "@/components/ui/ThemedScreen";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedCard } from "@/components/ui/ThemedCard";
import { useTheme } from "@/theme/useTheme";
import { useThemeStore } from "@/theme/themeStore";

export default function RewardsScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const mode = useThemeStore((s) => s.mode);

  const rewards = [
    { id: 1, name: "$10 Amazon Gift Card", points: 1000, available: true },
    { id: 2, name: "$25 Nike Voucher", points: 2500, available: true },
    {
      id: 3,
      name: "Premium Membership (1 Month)",
      points: 1500,
      available: true,
    },
    { id: 4, name: "$50 Gym Membership", points: 5000, available: false },
    { id: 5, name: "Fitness Tracker Watch", points: 10000, available: false },
    { id: 6, name: "$100 Cash Prize", points: 15000, available: false },
  ];

  return (
    <ThemedScreen>
      <StatusBar style={mode === "dark" ? "light" : "dark"} />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ paddingTop: insets.top + 20, paddingHorizontal: 20 }}>
          <ThemedText
            style={{
              fontSize: 28,
              fontWeight: "bold",
              marginBottom: 24,
            }}
          >
            Rewards Store
          </ThemedText>

          {/* Points Balance */}
          <LinearGradient
            colors={["#FFD700", "#FFA500"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ borderRadius: 20, padding: 24, marginBottom: 24 }}
          >
            <View style={{ alignItems: "center" }}>
              <Coins size={48} color="#000" />
              <Text
                style={{
                  fontSize: 18,
                  color: "#000",
                  marginTop: 12,
                  opacity: 0.8,
                }}
              >
                Your Points Balance
              </Text>
              <Text
                style={{
                  fontSize: 48,
                  fontWeight: "bold",
                  color: "#000",
                  marginTop: 8,
                }}
              >
                2,450
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "#000",
                  marginTop: 8,
                  opacity: 0.7,
                }}
              >
                Earn more by completing battles!
              </Text>
            </View>
          </LinearGradient>

          {/* Rewards Grid */}
          <ThemedText
            style={{
              fontSize: 20,
              fontWeight: "bold",
              marginBottom: 16,
            }}
          >
            Available Rewards
          </ThemedText>

          {rewards.map((reward) => (
            <ThemedCard
              key={reward.id}
              style={{
                padding: 20,
                marginBottom: 16,
                opacity: reward.available ? 1 : 0.6,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <View
                  style={{
                    backgroundColor: reward.available ? "#00FF88" : theme.card,
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 16,
                  }}
                >
                  <Gift size={24} color={reward.available ? "#000" : theme.muted} />
                </View>
                <View style={{ flex: 1 }}>
                  <ThemedText
                    style={{
                      fontSize: 16,
                      fontWeight: "bold",
                      marginBottom: 4,
                    }}
                  >
                    {reward.name}
                  </ThemedText>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Coins
                      size={16}
                      color={reward.available ? "#FFD700" : theme.muted}
                    />
                    <Text
                      style={{
                        fontSize: 14,
                        color: reward.available ? "#FFD700" : theme.muted,
                        marginLeft: 6,
                        fontWeight: "600",
                      }}
                    >
                      {reward.points.toLocaleString()} points
                    </Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity disabled={!reward.available}>
                {reward.available ? (
                  <LinearGradient
                    colors={["#00FF88", "#00D9FF"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{
                      height: 44,
                      borderRadius: 12,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: "#000",
                        fontSize: 14,
                        fontWeight: "bold",
                      }}
                    >
                      Redeem Now
                    </Text>
                  </LinearGradient>
                ) : (
                  <View
                    style={{
                      height: 44,
                      borderRadius: 12,
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: theme.card,
                    }}
                  >
                    <Text
                      style={{
                        color: theme.muted,
                        fontSize: 14,
                        fontWeight: "bold",
                      }}
                    >
                      Not Enough Points
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </ThemedCard>
          ))}

          {/* Info Card */}
          <ThemedCard
            style={{
              padding: 20,
              marginTop: 8,
              borderWidth: 1,
              borderColor: theme.card,
            }}
          >
            <ThemedText
              style={{
                fontSize: 16,
                fontWeight: "bold",
                marginBottom: 8,
              }}
            >
              How to Earn Points
            </ThemedText>
            <ThemedText style={{ fontSize: 14, opacity: 0.6, lineHeight: 20 }}>
              • Win competitions: 100-500 points{"\n"}• Complete daily goals:
              50-100 points{"\n"}• Maintain streaks: 25 points per day{"\n"}•
              Refer friends: 200 points per referral
            </ThemedText>
          </ThemedCard>
        </View>
      </ScrollView>
    </ThemedScreen>
  );
}
