import { View, ScrollView, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeft, Award, Trophy, Star, Medal, Crown } from "lucide-react-native";
import { ThemedScreen } from "@/components/ui/ThemedScreen";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedCard } from "@/components/ui/ThemedCard";
import { useTheme } from "@/theme/useTheme";
import { useThemeStore } from "@/theme/themeStore";

export default function AchievementsScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const theme = useTheme();
    const mode = useThemeStore((s) => s.mode);

    const achievements = [
        { id: 1, title: "First Victory", description: "Win your first battle", icon: Trophy, color: "#FFD700", unlocked: true, date: "Jan 15, 2026" },
        { id: 2, title: "Streak Master", description: "Maintain a 7-day streak", icon: Star, color: "#00FF88", unlocked: true, date: "Feb 1, 2026" },
        { id: 3, title: "Century Club", description: "Complete 100 battles", icon: Medal, color: "#3A86FF", unlocked: false, progress: 67 },
        { id: 4, title: "Champion", description: "Reach Level 20", icon: Crown, color: "#FF006E", unlocked: false, progress: 60 },
        { id: 5, title: "Social Butterfly", description: "Add 10 friends", icon: Award, color: "#8338EC", unlocked: false, progress: 40 },
    ];

    const unlockedCount = achievements.filter(a => a.unlocked).length;

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
                        Achievements
                    </ThemedText>
                </View>

                {/* Progress Summary */}
                <LinearGradient
                    colors={[theme.primary, theme.secondary]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                        borderRadius: 20,
                        padding: 20,
                        marginBottom: 24,
                    }}
                >
                    <ThemedText style={{ fontSize: 14, color: "rgba(255,255,255,0.8)", marginBottom: 8 }}>
                        Total Progress
                    </ThemedText>
                    <ThemedText style={{ fontSize: 32, fontWeight: "bold", color: "#fff" }}>
                        {unlockedCount} / {achievements.length}
                    </ThemedText>
                    <ThemedText style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", marginTop: 4 }}>
                        Achievements Unlocked
                    </ThemedText>
                </LinearGradient>
            </View>

            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                {achievements.map((achievement) => (
                    <ThemedCard
                        key={achievement.id}
                        style={{
                            marginBottom: 16,
                            opacity: achievement.unlocked ? 1 : 0.6,
                        }}
                    >
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <View
                                style={{
                                    width: 56,
                                    height: 56,
                                    borderRadius: 28,
                                    backgroundColor: achievement.unlocked ? achievement.color : theme.card,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    marginRight: 16,
                                }}
                            >
                                <achievement.icon
                                    size={28}
                                    color={achievement.unlocked ? "#fff" : theme.muted}
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <ThemedText style={{ fontSize: 16, fontWeight: "bold", marginBottom: 4 }}>
                                    {achievement.title}
                                </ThemedText>
                                <ThemedText style={{ fontSize: 14, opacity: 0.6 }}>
                                    {achievement.description}
                                </ThemedText>
                                {achievement.unlocked ? (
                                    <ThemedText
                                        style={{
                                            fontSize: 12,
                                            color: theme.secondary,
                                            marginTop: 4,
                                            fontWeight: "600",
                                        }}
                                    >
                                        Unlocked on {achievement.date}
                                    </ThemedText>
                                ) : (
                                    <View style={{ marginTop: 8 }}>
                                        <View
                                            style={{
                                                height: 6,
                                                backgroundColor: theme.card,
                                                borderRadius: 3,
                                                overflow: "hidden",
                                            }}
                                        >
                                            <View
                                                style={{
                                                    height: "100%",
                                                    width: `${achievement.progress}%`,
                                                    backgroundColor: achievement.color,
                                                    borderRadius: 3,
                                                }}
                                            />
                                        </View>
                                        <ThemedText
                                            style={{
                                                fontSize: 12,
                                                opacity: 0.6,
                                                marginTop: 4,
                                            }}
                                        >
                                            {achievement.progress}% Complete
                                        </ThemedText>
                                    </View>
                                )}
                            </View>
                        </View>
                    </ThemedCard>
                ))}
            </ScrollView>
        </ThemedScreen>
    );
}
