import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Mail, Lock, ArrowLeft } from "lucide-react-native";
import { useAuth } from "../../src/contexts/AuthContext";

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      await signIn(email, password);
    } catch (error) {
      if (error.message === "Email not confirmed") {
        Alert.alert(
          "Verification Required",
          "Please check your inbox and confirm your email address before signing in.",
          [{ text: "OK" }]
        );
      } else {
        Alert.alert("Login Failed", error.message || "Invalid email or password");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <StatusBar style="light" />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
      >
        <View style={{ paddingTop: insets.top + 40, paddingHorizontal: 24 }}>
          <Text
            style={{
              fontSize: 40,
              fontWeight: "bold",
              color: "#fff",
              marginBottom: 12,
            }}
          >
            Welcome Back
          </Text>
          <Text style={{ fontSize: 16, color: "#999", marginBottom: 48 }}>
            Sign in to continue your FitBattle journey
          </Text>

          {/* Email Input */}
          <View style={{ marginBottom: 20 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: "#fff",
                marginBottom: 8,
              }}
            >
              Email Address
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#1a1a1a",
                borderRadius: 12,
                paddingHorizontal: 16,
                borderWidth: 1,
                borderColor: "#333",
              }}
            >
              <Mail size={20} color="#666" />
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="your@email.com"
                placeholderTextColor="#666"
                keyboardType="email-address"
                autoCapitalize="none"
                style={{
                  flex: 1,
                  color: "#fff",
                  fontSize: 16,
                  paddingVertical: 18,
                  paddingLeft: 12,
                }}
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={{ marginBottom: 12 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: "#fff",
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
                borderWidth: 1,
                borderColor: "#333",
              }}
            >
              <Lock size={20} color="#666" />
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor="#666"
                secureTextEntry
                style={{
                  flex: 1,
                  color: "#fff",
                  fontSize: 16,
                  paddingVertical: 18,
                  paddingLeft: 12,
                }}
              />
            </View>
          </View>

          {/* Forgot Password */}
          <TouchableOpacity
            onPress={() => router.push("/auth/forgot-password")}
            style={{ alignSelf: "flex-end", marginBottom: 40 }}
          >
            <Text style={{ color: "#00FF88", fontSize: 14, fontWeight: "600" }}>
              Forgot Password?
            </Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity
            onPress={handleLogin}
            disabled={loading}
            style={{ marginBottom: 32 }}
          >
            <LinearGradient
              colors={["#00FF88", "#3A86FF"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                borderRadius: 12,
                paddingVertical: 20,
                alignItems: "center",
                opacity: loading ? 0.6 : 1,
              }}
            >
              <Text style={{ color: "#000", fontSize: 18, fontWeight: "bold" }}>
                {loading ? "Signing In..." : "Sign In"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Signup Link */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#999", fontSize: 15 }}>
              Don't have an account?{" "}
            </Text>
            <TouchableOpacity onPress={() => router.replace("/auth/signup")}>
              <Text
                style={{ color: "#00FF88", fontSize: 15, fontWeight: "700" }}
              >
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
