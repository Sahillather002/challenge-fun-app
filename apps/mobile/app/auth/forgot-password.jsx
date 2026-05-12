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
import { Mail, ArrowLeft } from "lucide-react-native";
import { supabase } from "../../src/lib/supabase";

export default function ForgotPasswordScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleResetPassword = async () => {
        if (!email) {
            Alert.alert("Error", "Please enter your email");
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email);

            if (error) throw error;

            Alert.alert(
                "Success",
                "Password reset email sent! Please check your inbox.",
                [{ text: "OK", onPress: () => router.back() }]
            );
        } catch (error) {
            Alert.alert("Error", error.message || "Could not send reset email");
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
                        Forgot Password?
                    </Text>
                    <Text style={{ fontSize: 16, color: "#999", marginBottom: 40 }}>
                        Enter your email to receive a password reset link
                    </Text>

                    {/* Email Input */}
                    <View style={{ marginBottom: 24 }}>
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

                    {/* Reset Button */}
                    <TouchableOpacity
                        onPress={handleResetPassword}
                        disabled={loading}
                        style={{ marginBottom: 16 }}
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
                                {loading ? "Sending..." : "Send Reset Link"}
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    {/* Back to Login */}
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={{ alignItems: "center" }}
                    >
                        <Text style={{ color: "#00FF88", fontSize: 14 }}>
                            Back to Login
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}
