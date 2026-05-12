import { View, ScrollView, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeft, TrendingUp, Trophy, Target, Calendar } from "lucide-react-native";
import { ThemedScreen } from "@/components/ui/ThemedScreen";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedCard } from "@/components/ui/ThemedCard";
import { useTheme } from "@/theme/useTheme";
import { useThemeStore } from "@/theme/themeStore";

export default function StatisticsScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const theme = useTheme();
    const mode = useThemeStore((s) => s.mode);

    const stats = {
        totalBattles: 67,
        wins: 24,
        losses: 18,
        draws: 25,
        winRate: 35.8,
        totalPoints: 12450,
        avgPerformance: 78.5,
        streak: 7,
    };

    const monthlyData = [
        { month: "Jan", battles: 12, wins: 5 },
        { month: "Feb", battles: 15, wins: 8 },
        { month: "Mar", battles: 18, wins: 6 },
        { month: "Apr", battles: 22, wins: 5 },
    ];

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
                        Statistics
                    </ThemedText>
                </View>
            </View>

            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Overview Cards */}
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
                    <ThemedCard style={{ flex: 1, minWidth: "45%", alignItems: "center" }}>
                        <Trophy size={24} color="#FFD700" />
                        <ThemedText style={{ fontSize: 28, fontWeight: "bold", marginTop: 8 }}>
                            {stats.wins}
                        </ThemedText>
                        <ThemedText style={{ fontSize: 12, opacity: 0.6, marginTop: 4 }}>
                            Total Wins
                        </ThemedText>
                    </ThemedCard>

                    <ThemedCard style={{ flex: 1, minWidth: "45%", alignItems: "center" }}>
                        <Target size={24} color={theme.primary} />
                        <ThemedText style={{ fontSize: 28, fontWeight: "bold", marginTop: 8 }}>
                            {stats.totalBattles}
                        </ThemedText>
                        <ThemedText style={{ fontSize: 12, opacity: 0.6, marginTop: 4 }}>
                            Total Battles
                        </ThemedText>
                    </ThemedCard>

                    <ThemedCard style={{ flex: 1, minWidth: "45%", alignItems: "center" }}>
                        <TrendingUp size={24} color={theme.secondary} />
                        <ThemedText style={{ fontSize: 28, fontWeight: "bold", marginTop: 8 }}>
                            {stats.winRate}%
                        </ThemedText>
                        <ThemedText style={{ fontSize: 12, opacity: 0.6, marginTop: 4 }}>
                            Win Rate
                        </ThemedText>
                    </ThemedCard>

                    <ThemedCard style={{ flex: 1, minWidth: "45%", alignItems: "center" }}>
                        <Calendar size={24} color={theme.danger} />
                        <ThemedText style={{ fontSize: 28, fontWeight: "bold", marginTop: 8 }}>
                            {stats.streak}
                        </ThemedText>
                        <ThemedText style={{ fontSize: 12, opacity: 0.6, marginTop: 4 }}>
                            Day Streak
                        </ThemedText>
                    </ThemedCard>
                </View>

                {/* Performance Card */}
                <ThemedCard style={{ marginBottom: 24 }}>
                    <ThemedText style={{ fontSize: 18, fontWeight: "bold", marginBottom: 16 }}>
                        Overall Performance
                    </ThemedText>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 12 }}>
                        <View>
                            <ThemedText style={{ fontSize: 12, opacity: 0.6, marginBottom: 4 }}>
                                Total Points
                            </ThemedText>
                            <ThemedText style={{ fontSize: 20, fontWeight: "bold", color: theme.secondary }}>
                                {stats.totalPoints.toLocaleString()}
                            </ThemedText>
                        </View>
                        <View style={{ alignItems: "flex-end" }}>
                            <ThemedText style={{ fontSize: 12, opacity: 0.6, marginBottom: 4 }}>
                                Avg Score
                            </ThemedText>
                            <ThemedText style={{ fontSize: 20, fontWeight: "bold", color: theme.primary }}>
                                {stats.avgPerformance}%
                            </ThemedText>
                        </View>
                    </View>
                </ThemedCard>

                {/* Battle Record */}
                <ThemedCard style={{ marginBottom: 24 }}>
                    <ThemedText style={{ fontSize: 18, fontWeight: "bold", marginBottom: 16 }}>
                        Battle Record
                    </ThemedText>
                    <View style={{ gap: 8 }}>
                        <RecordRow label="Wins" value={stats.wins} color={theme.secondary} />
                        <RecordRow label="Losses" value={stats.losses} color={theme.danger} />
                        <RecordRow label="Draws" value={stats.draws} color={theme.muted} />
                    </View>
                </ThemedCard>

                {/* Monthly Progress */}
                <ThemedText style={{ fontSize: 20, fontWeight: "bold", marginBottom: 16 }}>
                    Monthly Progress
                </ThemedText>
                {monthlyData.map((data) => (
                    <ThemedCard key={data.month} style={{ marginBottom: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                        <View>
                            <ThemedText style={{ fontSize: 16, fontWeight: "bold" }}>
                                {data.month}
                            </ThemedText>
                            <ThemedText style={{ fontSize: 12, opacity: 0.6, marginTop: 4 }}>
                                {data.battles} battles • {data.wins} wins
                            </ThemedText>
                        </View>
                        <View style={{ alignItems: "flex-end" }}>
                            <ThemedText style={{ fontSize: 18, fontWeight: "bold", color: theme.secondary }}>
                                {Math.round((data.wins / data.battles) * 100)}%
                            </ThemedText>
                            <ThemedText style={{ fontSize: 12, opacity: 0.6 }}>
                                Win Rate
                            </ThemedText>
                        </View>
                    </ThemedCard>
                ))}
            </ScrollView>
        </ThemedScreen>
    );
}

function RecordRow({ label, value, color }) {
    return (
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <ThemedText style={{ fontSize: 14, opacity: 0.6 }}>{label}</ThemedText>
            <ThemedText style={{ fontSize: 18, fontWeight: "bold", color }}>{value}</ThemedText>
        </View>
    );
}
