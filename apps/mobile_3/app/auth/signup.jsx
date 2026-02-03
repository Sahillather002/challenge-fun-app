import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { User, Mail, Lock, ArrowLeft } from "lucide-react-native";

export default function SignupScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <StatusBar style="light" />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
      >
        <View style={{ paddingTop: insets.top + 20, paddingHorizontal: 24 }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ marginBottom: 32 }}
          >
            <ArrowLeft size={24} color="#fff" />
          </TouchableOpacity>

          <Text
            style={{
              fontSize: 36,
              fontWeight: "bold",
              color: "#fff",
              marginBottom: 8,
            }}
          >
            Create Account
          </Text>
          <Text style={{ fontSize: 16, color: "#999", marginBottom: 40 }}>
            Join the fitness battle community
          </Text>

          {/* Name Input */}
          <View style={{ marginBottom: 16 }}>
            <Text
              style={{
                color: "#fff",
                fontSize: 14,
                fontWeight: "600",
                marginBottom: 8,
              }}
            >
              Full Name
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#1a1a1a",
                borderRadius: 12,
                paddingHorizontal: 16,
                height: 56,
              }}
            >
              <User size={20} color="#666" />
              <TextInput
                placeholder="Enter your name"
                placeholderTextColor="#666"
                style={{ flex: 1, color: "#fff", marginLeft: 12, fontSize: 16 }}
              />
            </View>
          </View>

          {/* Email Input */}
          <View style={{ marginBottom: 16 }}>
            <Text
              style={{
                color: "#fff",
                fontSize: 14,
                fontWeight: "600",
                marginBottom: 8,
              }}
            >
              Email
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#1a1a1a",
                borderRadius: 12,
                paddingHorizontal: 16,
                height: 56,
              }}
            >
              <Mail size={20} color="#666" />
              <TextInput
                placeholder="Enter your email"
                placeholderTextColor="#666"
                style={{ flex: 1, color: "#fff", marginLeft: 12, fontSize: 16 }}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                color: "#fff",
                fontSize: 14,
                fontWeight: "600",
                marginBottom: 8,
              }}
            >
              Password
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#1a1a1a",
                borderRadius: 12,
                paddingHorizontal: 16,
                height: 56,
              }}
            >
              <Lock size={20} color="#666" />
              <TextInput
                placeholder="Create a password"
                placeholderTextColor="#666"
                style={{ flex: 1, color: "#fff", marginLeft: 12, fontSize: 16 }}
                secureTextEntry
              />
            </View>
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity onPress={() => router.replace("/(tabs)")}>
            <LinearGradient
              colors={["#00FF88", "#00D9FF"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                height: 56,
                borderRadius: 12,
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 32,
              }}
            >
              <Text style={{ color: "#000", fontSize: 16, fontWeight: "bold" }}>
                Create Account
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Login Link */}
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <Text style={{ color: "#999" }}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/auth/login")}>
              <Text style={{ color: "#00FF88", fontWeight: "bold" }}>
                Login
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
