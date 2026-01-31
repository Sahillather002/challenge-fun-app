import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { Coins, Gift, ShoppingBag } from "lucide-react-native";

export default function RewardsScreen() {
  const insets = useSafeAreaInsets();

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
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <StatusBar style="light" />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ paddingTop: insets.top + 20, paddingHorizontal: 20 }}>
          <Text
            style={{
              fontSize: 28,
              fontWeight: "bold",
              color: "#fff",
              marginBottom: 24,
            }}
          >
            Rewards Store
          </Text>

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
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: "#fff",
              marginBottom: 16,
            }}
          >
            Available Rewards
          </Text>

          {rewards.map((reward) => (
            <View
              key={reward.id}
              style={{
                backgroundColor: "#1a1a1a",
                borderRadius: 16,
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
                    backgroundColor: reward.available ? "#00FF88" : "#333",
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 16,
                  }}
                >
                  <Gift size={24} color={reward.available ? "#000" : "#666"} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "bold",
                      color: "#fff",
                      marginBottom: 4,
                    }}
                  >
                    {reward.name}
                  </Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Coins
                      size={16}
                      color={reward.available ? "#FFD700" : "#666"}
                    />
                    <Text
                      style={{
                        fontSize: 14,
                        color: reward.available ? "#FFD700" : "#666",
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
                      backgroundColor: "#2a2a2a",
                    }}
                  >
                    <Text
                      style={{
                        color: "#666",
                        fontSize: 14,
                        fontWeight: "bold",
                      }}
                    >
                      Not Enough Points
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          ))}

          {/* Info Card */}
          <View
            style={{
              backgroundColor: "#1a1a1a",
              borderRadius: 16,
              padding: 20,
              marginTop: 8,
              borderWidth: 1,
              borderColor: "#333",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                color: "#fff",
                marginBottom: 8,
              }}
            >
              How to Earn Points
            </Text>
            <Text style={{ fontSize: 14, color: "#999", lineHeight: 20 }}>
              • Win competitions: 100-500 points{"\n"}• Complete daily goals:
              50-100 points{"\n"}• Maintain streaks: 25 points per day{"\n"}•
              Refer friends: 200 points per referral
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
