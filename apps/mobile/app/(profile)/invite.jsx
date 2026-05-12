import { View, ScrollView, TouchableOpacity, TextInput, Share } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeft, Mail, MessageCircle, Share2, Copy } from "lucide-react-native";
import { ThemedScreen } from "@/components/ui/ThemedScreen";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedCard } from "@/components/ui/ThemedCard";
import { useTheme } from "@/theme/useTheme";
import { useThemeStore } from "@/theme/themeStore";
import { useState } from "react";

export default function InviteScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const theme = useTheme();
    const mode = useThemeStore((s) => s.mode);
    const [copied, setCopied] = useState(false);

    const inviteCode = "FITBATTLE2026";
    const inviteLink = "https://fitbattle.app/join/johndoe";

    const handleCopy = () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Join me on FitBattle! Use my code ${inviteCode} or click: ${inviteLink}`,
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <ThemedScreen>
            <StatusBar style={mode === "dark" ? "light" : "dark"} />
            <View style={{ paddingTop: insets.top + 20, paddingHorizontal: 20 }}>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 24,
                    }}
                >
                    <TouchableOpacity onPress={() => router.back()}>
                        <ArrowLeft size={24} color={theme.text} />
                    </TouchableOpacity>
                    <ThemedText
                        style={{
                            fontSize: 28,
                            fontWeight: "bold",
                            marginLeft: 16,
                        }}
                    >
                        Invite Friends
                    </ThemedText>
                </View>
            </View>

            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Reward Banner */}
                <LinearGradient
                    colors={[theme.secondary, theme.primary]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                        borderRadius: 20,
                        padding: 24,
                        marginBottom: 24,
                        alignItems: "center",
                    }}
                >
                    <ThemedText style={{ fontSize: 40, marginBottom: 12 }}>
                        🎁
                    </ThemedText>
                    <ThemedText style={{ fontSize: 20, fontWeight: "bold", color: "#fff", marginBottom: 8, textAlign: "center" }}>
                        Earn 100 Points Per Friend!
                    </ThemedText>
                    <ThemedText style={{ fontSize: 14, color: "rgba(255,255,255,0.8)", textAlign: "center" }}>
                        Invite your friends and both of you get rewarded
                    </ThemedText>
                </LinearGradient>

                {/* Invite Code */}
                <ThemedText style={{ fontSize: 18, fontWeight: "bold", marginBottom: 12 }}>
                    Your Invite Code
                </ThemedText>
                <ThemedCard style={{ marginBottom: 24 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                        <View style={{ flex: 1 }}>
                            <ThemedText style={{ fontSize: 14, opacity: 0.6, marginBottom: 8 }}>
                                Share this code
                            </ThemedText>
                            <ThemedText style={{ fontSize: 24, fontWeight: "bold", letterSpacing: 2 }}>
                                {inviteCode}
                            </ThemedText>
                        </View>
                        <TouchableOpacity
                            onPress={handleCopy}
                            style={{
                                backgroundColor: copied ? theme.secondary : theme.card,
                                paddingHorizontal: 16,
                                paddingVertical: 10,
                                borderRadius: 8,
                            }}
                        >
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Copy size={16} color={copied ? "#000" : theme.text} />
                                <ThemedText
                                    style={{
                                        marginLeft: 8,
                                        fontWeight: "600",
                                        color: copied ? "#000" : theme.text,
                                    }}
                                >
                                    {copied ? "Copied!" : "Copy"}
                                </ThemedText>
                            </View>
                        </TouchableOpacity>
                    </View>
                </ThemedCard>

                {/* Share Options */}
                <ThemedText style={{ fontSize: 18, fontWeight: "bold", marginBottom: 12 }}>
                    Share Via
                </ThemedText>
                <View style={{ gap: 12, marginBottom: 24 }}>
                    <TouchableOpacity onPress={handleShare}>
                        <ThemedCard style={{ flexDirection: "row", alignItems: "center", padding: 16 }}>
                            <View
                                style={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 24,
                                    backgroundColor: "#00FF88",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    marginRight: 16,
                                }}
                            >
                                <Share2 size={24} color="#000" />
                            </View>
                            <View style={{ flex: 1 }}>
                                <ThemedText style={{ fontSize: 16, fontWeight: "bold" }}>
                                    Share Link
                                </ThemedText>
                                <ThemedText style={{ fontSize: 12, opacity: 0.6, marginTop: 4 }}>
                                    Share via apps installed on your device
                                </ThemedText>
                            </View>
                        </ThemedCard>
                    </TouchableOpacity>

                    <TouchableOpacity>
                        <ThemedCard style={{ flexDirection: "row", alignItems: "center", padding: 16 }}>
                            <View
                                style={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 24,
                                    backgroundColor: "#3A86FF",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    marginRight: 16,
                                }}
                            >
                                <Mail size={24} color="#fff" />
                            </View>
                            <View style={{ flex: 1 }}>
                                <ThemedText style={{ fontSize: 16, fontWeight: "bold" }}>
                                    Email Invite
                                </ThemedText>
                                <ThemedText style={{ fontSize: 12, opacity: 0.6, marginTop: 4 }}>
                                    Send invitation via email
                                </ThemedText>
                            </View>
                        </ThemedCard>
                    </TouchableOpacity>

                    <TouchableOpacity>
                        <ThemedCard style={{ flexDirection: "row", alignItems: "center", padding: 16 }}>
                            <View
                                style={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 24,
                                    backgroundColor: "#FF006E",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    marginRight: 16,
                                }}
                            >
                                <MessageCircle size={24} color="#fff" />
                            </View>
                            <View style={{ flex: 1 }}>
                                <ThemedText style={{ fontSize: 16, fontWeight: "bold" }}>
                                    SMS Invite
                                </ThemedText>
                                <ThemedText style={{ fontSize: 12, opacity: 0.6, marginTop: 4 }}>
                                    Send invitation via text message
                                </ThemedText>
                            </View>
                        </ThemedCard>
                    </TouchableOpacity>
                </View>

                {/* Stats */}
                <ThemedCard>
                    <ThemedText style={{ fontSize: 16, fontWeight: "bold", marginBottom: 16 }}>
                        Your Invite Stats
                    </ThemedText>
                    <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                        <View style={{ alignItems: "center" }}>
                            <ThemedText style={{ fontSize: 28, fontWeight: "bold", color: theme.secondary }}>
                                5
                            </ThemedText>
                            <ThemedText style={{ fontSize: 12, opacity: 0.6, marginTop: 4 }}>
                                Friends Joined
                            </ThemedText>
                        </View>
                        <View style={{ alignItems: "center" }}>
                            <ThemedText style={{ fontSize: 28, fontWeight: "bold", color: theme.primary }}>
                                500
                            </ThemedText>
                            <ThemedText style={{ fontSize: 12, opacity: 0.6, marginTop: 4 }}>
                                Points Earned
                            </ThemedText>
                        </View>
                    </View>
                </ThemedCard>
            </ScrollView>
        </ThemedScreen>
    );
}
