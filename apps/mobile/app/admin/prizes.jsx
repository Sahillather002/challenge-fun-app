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
import { ArrowLeft, DollarSign, Award } from "lucide-react-native";

export default function PrizeSetupScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

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
            Prize Setup
          </Text>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
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
              marginBottom: 16,
            }}
          >
            <DollarSign size={24} color="#00FF88" />
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: "#fff",
                marginLeft: 12,
              }}
            >
              Prize Distribution
            </Text>
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text style={{ color: "#999", fontSize: 14, marginBottom: 8 }}>
              1st Place
            </Text>
            <TextInput
              placeholder="$250"
              placeholderTextColor="#666"
              style={{
                backgroundColor: "#2a2a2a",
                borderRadius: 12,
                paddingHorizontal: 16,
                height: 48,
                color: "#fff",
                fontSize: 16,
              }}
            />
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text style={{ color: "#999", fontSize: 14, marginBottom: 8 }}>
              2nd Place
            </Text>
            <TextInput
              placeholder="$150"
              placeholderTextColor="#666"
              style={{
                backgroundColor: "#2a2a2a",
                borderRadius: 12,
                paddingHorizontal: 16,
                height: 48,
                color: "#fff",
                fontSize: 16,
              }}
            />
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text style={{ color: "#999", fontSize: 14, marginBottom: 8 }}>
              3rd Place
            </Text>
            <TextInput
              placeholder="$100"
              placeholderTextColor="#666"
              style={{
                backgroundColor: "#2a2a2a",
                borderRadius: 12,
                paddingHorizontal: 16,
                height: 48,
                color: "#fff",
                fontSize: 16,
              }}
            />
          </View>
        </View>

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
              marginBottom: 16,
            }}
          >
            <Award size={24} color="#FFD700" />
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: "#fff",
                marginLeft: 12,
              }}
            >
              Bonus Prizes
            </Text>
          </View>

          <Text style={{ color: "#999", fontSize: 14, lineHeight: 20 }}>
            Add special badges, titles, or bonus XP for participants who reach
            certain milestones.
          </Text>
        </View>

        <TouchableOpacity>
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
              Save Prize Setup
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
