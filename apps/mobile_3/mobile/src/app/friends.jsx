import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeft, Search, UserPlus, Users } from "lucide-react-native";

export default function FriendsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const friends = [
    { id: 1, name: "Sarah Johnson", status: "Online", wins: 45 },
    { id: 2, name: "Mike Chen", status: "In Battle", wins: 32 },
    { id: 3, name: "Emma Davis", status: "Online", wins: 28 },
    { id: 4, name: "Alex Kim", status: "Offline", wins: 51 },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <StatusBar style="light" />
      <View style={{ paddingTop: insets.top + 20, paddingHorizontal: 20 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color="#fff" />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 28,
              fontWeight: "bold",
              color: "#fff",
              marginLeft: 16,
            }}
          >
            Friends & Teams
          </Text>
        </View>

        {/* Search */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#1a1a1a",
            borderRadius: 12,
            paddingHorizontal: 16,
            height: 48,
            marginBottom: 24,
          }}
        >
          <Search size={20} color="#666" />
          <TextInput
            placeholder="Search friends..."
            placeholderTextColor="#666"
            style={{ flex: 1, color: "#fff", marginLeft: 12, fontSize: 16 }}
          />
        </View>

        <TouchableOpacity>
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
              marginBottom: 24,
            }}
          >
            <UserPlus size={20} color="#000" />
            <Text
              style={{
                color: "#000",
                fontSize: 16,
                fontWeight: "bold",
                marginLeft: 12,
              }}
            >
              Add Friends
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            color: "#fff",
            marginBottom: 16,
          }}
        >
          Your Friends ({friends.length})
        </Text>

        {friends.map((friend) => (
          <View
            key={friend.id}
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#1a1a1a",
              padding: 16,
              borderRadius: 12,
              marginBottom: 12,
            }}
          >
            <LinearGradient
              colors={["#8338EC", "#FF006E"]}
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                justifyContent: "center",
                alignItems: "center",
                marginRight: 16,
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: "bold", color: "#fff" }}>
                {friend.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </Text>
            </LinearGradient>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  color: "#fff",
                  marginBottom: 4,
                }}
              >
                {friend.name}
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor:
                      friend.status === "Online"
                        ? "#00FF88"
                        : friend.status === "In Battle"
                          ? "#FFD700"
                          : "#666",
                    marginRight: 8,
                  }}
                />
                <Text style={{ fontSize: 12, color: "#999" }}>
                  {friend.status} • {friend.wins} wins
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={{
                backgroundColor: "#2a2a2a",
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 8,
              }}
            >
              <Text
                style={{ color: "#00FF88", fontSize: 14, fontWeight: "600" }}
              >
                Challenge
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
