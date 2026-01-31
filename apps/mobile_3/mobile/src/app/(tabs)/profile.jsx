import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import {
  Settings,
  Users,
  Share2,
  Award,
  BarChart3,
  Edit,
} from "lucide-react-native";

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <StatusBar style="light" />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ paddingTop: insets.top + 20, paddingHorizontal: 20 }}>
          {/* Profile Header */}
          <View style={{ alignItems: "center", marginBottom: 32 }}>
            <LinearGradient
              colors={["#00FF88", "#00D9FF"]}
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <Text style={{ fontSize: 36, fontWeight: "bold" }}>JD</Text>
            </LinearGradient>
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                color: "#fff",
                marginBottom: 4,
              }}
            >
              John Doe
            </Text>
            <Text style={{ fontSize: 14, color: "#999", marginBottom: 16 }}>
              @johndoe_fit
            </Text>
            <TouchableOpacity>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "#1a1a1a",
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  borderRadius: 20,
                }}
              >
                <Edit size={16} color="#00FF88" />
                <Text
                  style={{ color: "#00FF88", marginLeft: 8, fontWeight: "600" }}
                >
                  Edit Profile
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Stats Grid */}
          <View style={{ flexDirection: "row", marginBottom: 32 }}>
            <View
              style={{
                flex: 1,
                alignItems: "center",
                paddingVertical: 16,
                backgroundColor: "#1a1a1a",
                borderRadius: 16,
                marginRight: 8,
              }}
            >
              <Text
                style={{ fontSize: 24, fontWeight: "bold", color: "#00FF88" }}
              >
                24
              </Text>
              <Text style={{ fontSize: 12, color: "#999", marginTop: 4 }}>
                Wins
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                alignItems: "center",
                paddingVertical: 16,
                backgroundColor: "#1a1a1a",
                borderRadius: 16,
                marginHorizontal: 8,
              }}
            >
              <Text
                style={{ fontSize: 24, fontWeight: "bold", color: "#00D9FF" }}
              >
                67
              </Text>
              <Text style={{ fontSize: 12, color: "#999", marginTop: 4 }}>
                Battles
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                alignItems: "center",
                paddingVertical: 16,
                backgroundColor: "#1a1a1a",
                borderRadius: 16,
                marginLeft: 8,
              }}
            >
              <Text
                style={{ fontSize: 24, fontWeight: "bold", color: "#FFD700" }}
              >
                7
              </Text>
              <Text style={{ fontSize: 12, color: "#999", marginTop: 4 }}>
                Streak
              </Text>
            </View>
          </View>

          {/* Menu Items */}
          <TouchableOpacity
            onPress={() => router.push("/friends")}
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#1a1a1a",
              padding: 16,
              borderRadius: 16,
              marginBottom: 12,
            }}
          >
            <Users size={24} color="#00FF88" />
            <Text
              style={{
                flex: 1,
                color: "#fff",
                fontSize: 16,
                fontWeight: "600",
                marginLeft: 16,
              }}
            >
              Friends & Teams
            </Text>
            <Text style={{ color: "#999" }}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#1a1a1a",
              padding: 16,
              borderRadius: 16,
              marginBottom: 12,
            }}
          >
            <BarChart3 size={24} color="#00D9FF" />
            <Text
              style={{
                flex: 1,
                color: "#fff",
                fontSize: 16,
                fontWeight: "600",
                marginLeft: 16,
              }}
            >
              Statistics
            </Text>
            <Text style={{ color: "#999" }}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#1a1a1a",
              padding: 16,
              borderRadius: 16,
              marginBottom: 12,
            }}
          >
            <Award size={24} color="#FFD700" />
            <Text
              style={{
                flex: 1,
                color: "#fff",
                fontSize: 16,
                fontWeight: "600",
                marginLeft: 16,
              }}
            >
              Achievements
            </Text>
            <Text style={{ color: "#999" }}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#1a1a1a",
              padding: 16,
              borderRadius: 16,
              marginBottom: 12,
            }}
          >
            <Share2 size={24} color="#FF006E" />
            <Text
              style={{
                flex: 1,
                color: "#fff",
                fontSize: 16,
                fontWeight: "600",
                marginLeft: 16,
              }}
            >
              Invite Friends
            </Text>
            <Text style={{ color: "#999" }}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#1a1a1a",
              padding: 16,
              borderRadius: 16,
              marginBottom: 32,
            }}
          >
            <Settings size={24} color="#666" />
            <Text
              style={{
                flex: 1,
                color: "#fff",
                fontSize: 16,
                fontWeight: "600",
                marginLeft: 16,
              }}
            >
              Settings
            </Text>
            <Text style={{ color: "#999" }}>›</Text>
          </TouchableOpacity>

          {/* Logout Button */}
          <TouchableOpacity
            style={{
              backgroundColor: "#2a2a2a",
              padding: 16,
              borderRadius: 16,
              alignItems: "center",
            }}
          >
            <Text
              style={{ color: "#FF006E", fontSize: 16, fontWeight: "bold" }}
            >
              Log Out
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
