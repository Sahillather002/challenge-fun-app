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
import { Mail, Lock, User, ArrowLeft } from "lucide-react-native";
import { useAuth } from "../../src/contexts/AuthContext";

export default function SignupScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { signUp } = useAuth();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name || !username || !email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await signUp(email, password, name, username);

      Alert.alert(
        "Success",
        "Account created! Please check your email to verify your account.",
        [{ text: "OK", onPress: () => router.replace("/auth/login") }]
      );
    } catch (error) {
      Alert.alert("Signup Failed", error.message || "Could not create account");
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
            Start your FitBattle journey today
          </Text>

          {/* Name Input */}
          <View style={{ marginBottom: 16 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: "#fff",
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
                borderWidth: 1,
                borderColor: "#333",
              }}
            >
              <User size={20} color="#666" />
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="John Doe"
                placeholderTextColor="#666"
                style={{
                  flex: 1,
                  color: "#fff",
                  fontSize: 16,
                  paddingVertical: 16,
                  paddingLeft: 12,
                }}
              />
            </View>
          </View>

          {/* Username Input */}
          <View style={{ marginBottom: 16 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: "#fff",
                marginBottom: 8,
              }}
            >
              Username
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
              <User size={20} color="#666" />
              <TextInput
                value={username}
                onChangeText={setUsername}
                placeholder="johndoe123"
                placeholderTextColor="#666"
                autoCapitalize="none"
                style={{
                  flex: 1,
                  color: "#fff",
                  fontSize: 16,
                  paddingVertical: 16,
                  paddingLeft: 12,
                }}
              />
            </View>
          </View>


          {/* Email Input */}
          <View style={{ marginBottom: 16 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: "#fff",
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
                  paddingVertical: 16,
                  paddingLeft: 12,
                }}
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={{ marginBottom: 24 }}>
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
                  paddingVertical: 16,
                  paddingLeft: 12,
                }}
              />
            </View>
            <Text style={{ color: "#666", fontSize: 12, marginTop: 4 }}>
              Must be at least 6 characters
            </Text>
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity
            onPress={handleSignup}
            disabled={loading}
            style={{ marginBottom: 32 }}
          >
            <LinearGradient
              colors={["#00FF88", "#3A86FF"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                borderRadius: 12,
                paddingVertical: 18,
                alignItems: "center",
                opacity: loading ? 0.6 : 1,
              }}
            >
              <Text style={{ color: "#000", fontSize: 16, fontWeight: "bold" }}>
                {loading ? "Creating Account..." : "Create Account"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Login Link */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#999", fontSize: 14 }}>
              Already have an account?{" "}
            </Text>
            <TouchableOpacity onPress={() => router.replace("/auth/login")}>
              <Text
                style={{ color: "#00FF88", fontSize: 14, fontWeight: "600" }}
              >
                Login
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
