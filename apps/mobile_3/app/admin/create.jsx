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
import { ArrowLeft, Plus } from "lucide-react-native";

export default function CreateCompetitionScreen() {
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
            Create Competition
          </Text>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Competition Name */}
        <View style={{ marginBottom: 20 }}>
          <Text
            style={{
              color: "#fff",
              fontSize: 14,
              fontWeight: "600",
              marginBottom: 8,
            }}
          >
            Competition Name
          </Text>
          <TextInput
            placeholder="e.g., Push-Up Challenge"
            placeholderTextColor="#666"
            style={{
              backgroundColor: "#1a1a1a",
              borderRadius: 12,
              paddingHorizontal: 16,
              height: 56,
              color: "#fff",
              fontSize: 16,
            }}
          />
        </View>

        {/* Category */}
        <View style={{ marginBottom: 20 }}>
          <Text
            style={{
              color: "#fff",
              fontSize: 14,
              fontWeight: "600",
              marginBottom: 8,
            }}
          >
            Category
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {["Strength", "Cardio", "Steps", "Endurance"].map((cat) => (
              <TouchableOpacity
                key={cat}
                style={{
                  backgroundColor: "#1a1a1a",
                  paddingHorizontal: 20,
                  paddingVertical: 12,
                  borderRadius: 12,
                  marginRight: 12,
                  marginBottom: 12,
                }}
              >
                <Text
                  style={{ color: "#fff", fontSize: 14, fontWeight: "600" }}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Prize Pool */}
        <View style={{ marginBottom: 20 }}>
          <Text
            style={{
              color: "#fff",
              fontSize: 14,
              fontWeight: "600",
              marginBottom: 8,
            }}
          >
            Prize Pool
          </Text>
          <TextInput
            placeholder="$500"
            placeholderTextColor="#666"
            keyboardType="numeric"
            style={{
              backgroundColor: "#1a1a1a",
              borderRadius: 12,
              paddingHorizontal: 16,
              height: 56,
              color: "#fff",
              fontSize: 16,
            }}
          />
        </View>

        {/* Duration */}
        <View style={{ marginBottom: 20 }}>
          <Text
            style={{
              color: "#fff",
              fontSize: 14,
              fontWeight: "600",
              marginBottom: 8,
            }}
          >
            Duration (hours)
          </Text>
          <TextInput
            placeholder="2"
            placeholderTextColor="#666"
            keyboardType="numeric"
            style={{
              backgroundColor: "#1a1a1a",
              borderRadius: 12,
              paddingHorizontal: 16,
              height: 56,
              color: "#fff",
              fontSize: 16,
            }}
          />
        </View>

        {/* Entry Fee */}
        <View style={{ marginBottom: 20 }}>
          <Text
            style={{
              color: "#fff",
              fontSize: 14,
              fontWeight: "600",
              marginBottom: 8,
            }}
          >
            Entry Fee (points)
          </Text>
          <TextInput
            placeholder="50"
            placeholderTextColor="#666"
            keyboardType="numeric"
            style={{
              backgroundColor: "#1a1a1a",
              borderRadius: 12,
              paddingHorizontal: 16,
              height: 56,
              color: "#fff",
              fontSize: 16,
            }}
          />
        </View>

        {/* Rules */}
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              color: "#fff",
              fontSize: 14,
              fontWeight: "600",
              marginBottom: 8,
            }}
          >
            Rules & Description
          </Text>
          <TextInput
            placeholder="Describe the competition rules..."
            placeholderTextColor="#666"
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            style={{
              backgroundColor: "#1a1a1a",
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 16,
              color: "#fff",
              fontSize: 16,
              minHeight: 120,
            }}
          />
        </View>

        {/* Create Button */}
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
            }}
          >
            <Plus size={20} color="#000" />
            <Text
              style={{
                color: "#000",
                fontSize: 16,
                fontWeight: "bold",
                marginLeft: 12,
              }}
            >
              Create Competition
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
