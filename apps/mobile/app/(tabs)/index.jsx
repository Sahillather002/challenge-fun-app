import { View, Text, ScrollView, Alert, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import {
  Flame,
  Trophy,
  Target,
  TrendingUp,
  Bell,
  Dumbbell,
} from "lucide-react-native";
import { ThemedScreen } from "@/components/ui/ThemedScreen";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedCard } from "@/components/ui/ThemedCard";
import { ThemedButton } from "@/components/ui/ThemedButton";
import { useThemeStore } from "@/theme/themeStore";
import { useTheme } from "@/theme/useTheme";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import { StoriesBar } from "@/components/Snap/StoriesBar";
import { MotiView, MotiText } from "moti";
import { PremiumCard } from "@/components/ui/PremiumCard";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { ParticleEffect } from "@/components/ui/ParticleEffect";
import { ConfettiAnimation } from "@/components/ui/ConfettiAnimation";
import { DynamicBackground } from "@/components/ui/DynamicBackground";
import { useState } from "react";
import {
  slideInFromBottom,
  slideInFromTop,
  slideInFromLeft,
  slideInFromRight,
  scaleIn,
  fadeIn,
} from "@/animations/AnimationPresets";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const theme = useTheme();
  const mode = useThemeStore((s) => s.mode);
  const queryClient = useQueryClient();
  const [showConfetti, setShowConfetti] = useState(false);

  const { data: stories = [] } = useQuery({
    queryKey: ["stories"],
    queryFn: () => api.getStories().then((res) => res.data),
    staleTime: 60000,
  });

  const { data: userStats } = useQuery({
    queryKey: ["userStats"],
    queryFn: () => api.getStats().then((res) => res.data),
  });

  const { data: streakData } = useQuery({
    queryKey: ["streak"],
    queryFn: () => api.getStreak().then((res) => res.data),
  });

  const checkInMutation = useMutation({
    mutationFn: () => api.checkIn(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["streak"] });
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      Alert.alert("Success", "Daily check-in complete!");
    },
  });

  return (
    <DynamicBackground>
      <ThemedScreen transparent={true}>
        <ConfettiAnimation
          visible={showConfetti}
          onAnimationEnd={() => setShowConfetti(false)}
        />
        <StatusBar style={mode === "dark" ? "light" : "dark"} />
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          <MotiView
            from={{ opacity: 0, translateY: -20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 800 }}
            style={{ paddingTop: insets.top + 20, paddingHorizontal: 20 }}
          >
            {/* Header */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 32,
              }}
            >
              <View>
                <ThemedText
                  style={{ fontSize: 28, fontFamily: "Outfit_700Bold" }}
                >
                  Welcome Back! 👋
                </ThemedText>
                <ThemedText
                  style={{
                    fontSize: 14,
                    opacity: 0.6,
                    marginTop: 4,
                    fontFamily: "Outfit_400Regular",
                  }}
                >
                  Ready to crush your goals?
                </ThemedText>
              </View>
              <ThemedButton
                variant="ghost"
                size="sm"
                onPress={() => router.push("/notifications")}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  padding: 0,
                }}
              >
                <Bell size={24} color={theme.text} />
                <View
                  style={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    width: 10,
                    height: 10,
                    backgroundColor: theme.danger,
                    borderRadius: 5,
                    borderWidth: 2,
                    borderColor: theme.card,
                  }}
                />
              </ThemedButton>
            </View>

            {/* Stories Bar */}
            <MotiView
              from={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 200 }}
            >
              <StoriesBar stories={stories} />
            </MotiView>
          </MotiView>

          <View style={{ paddingHorizontal: 20 }}>
            {/* XP & Level Card */}
            <PremiumCard
              delay={100}
              glass={true}
              style={{ padding: 0, marginBottom: 24 }}
            >
              <LinearGradient
                colors={[theme.primary, theme.danger]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ padding: 20 }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <View>
                    <Text
                      style={{
                        fontSize: 14,
                        color: "rgba(255,255,255,0.8)",
                        marginBottom: 4,
                        fontFamily: "Outfit_400Regular",
                      }}
                    >
                      Current Level
                    </Text>
                    <Text
                      style={{
                        fontSize: 32,
                        color: "#fff",
                        fontFamily: "Outfit_700Bold",
                      }}
                    >
                      Level {userStats?.level || 1}
                    </Text>
                  </View>
                  <View style={{ alignItems: "flex-end" }}>
                    <Text
                      style={{
                        fontSize: 14,
                        color: "rgba(255,255,255,0.8)",
                        marginBottom: 4,
                        fontFamily: "Outfit_400Regular",
                      }}
                    >
                      XP Points
                    </Text>
                    <Text
                      style={{
                        fontSize: 24,
                        color: theme.secondary,
                        fontFamily: "Outfit_700Bold",
                      }}
                    >
                      {userStats?.xp?.toLocaleString() || 0}
                    </Text>
                  </View>
                </View>
                <View style={{ marginTop: 16 }}>
                  <View
                    style={{
                      height: 8,
                      backgroundColor: "rgba(255,255,255,0.2)",
                      borderRadius: 4,
                      overflow: "hidden",
                    }}
                  >
                    <MotiView
                      from={{ width: "0%" }}
                      animate={{ width: "65%" }}
                      transition={{
                        type: "timing",
                        duration: 1500,
                        delay: 600,
                      }}
                      style={{
                        height: "100%",
                        backgroundColor: theme.secondary,
                        borderRadius: 4,
                      }}
                    />
                  </View>
                  <Text
                    style={{
                      fontSize: 12,
                      color: "rgba(255,255,255,0.7)",
                      marginTop: 8,
                      fontFamily: "Outfit_400Regular",
                    }}
                  >
                    {userStats?.xpToNextLevel || 1000} XP to Level{" "}
                    {(userStats?.level || 1) + 1}
                  </Text>
                </View>
              </LinearGradient>
            </PremiumCard>

            {/* Streak Card */}
            <PremiumCard
              delay={200}
              glass={true}
              style={{
                marginBottom: 24,
                borderWidth: 2,
                borderColor: "#FF6B35",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 12,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Flame size={28} color="#FF6B35" />
                  <ThemedText
                    style={{
                      fontSize: 20,
                      fontFamily: "Outfit_700Bold",
                      marginLeft: 12,
                    }}
                  >
                    {streakData?.currentStreak || 0} Day Streak! 🔥
                  </ThemedText>
                </View>
                <ThemedButton
                  variant={streakData?.hasCheckedInToday ? "ghost" : "primary"}
                  size="sm"
                  onPress={() => checkInMutation.mutate()}
                  disabled={
                    checkInMutation.isPending || streakData?.hasCheckedInToday
                  }
                  haptic="success"
                >
                  {streakData?.hasCheckedInToday ? "Checked In" : "Check In"}
                </ThemedButton>
              </View>
              <ThemedText
                style={{
                  fontSize: 14,
                  opacity: 0.6,
                  fontFamily: "Outfit_400Regular",
                }}
              >
                {streakData?.hasCheckedInToday
                  ? "You've checked in today! Come back tomorrow."
                  : "Keep it going! Check in to maintain your streak."}
              </ThemedText>
            </PremiumCard>

            {/* Daily Goal Progress */}
            <PremiumCard
              delay={300}
              glass={true}
              style={{
                marginBottom: 24,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <ThemedText
                  style={{ fontSize: 18, fontFamily: "Outfit_700Bold" }}
                >
                  Today's Goal
                </ThemedText>
                <ThemedText
                  style={{
                    fontSize: 14,
                    color: theme.secondary,
                    fontFamily: "Outfit_600SemiBold",
                  }}
                >
                  75% Complete
                </ThemedText>
              </View>
              <View
                style={{
                  height: 12,
                  backgroundColor:
                    mode === "dark"
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(0,0,0,0.05)",
                  borderRadius: 6,
                  overflow: "hidden",
                  marginBottom: 16,
                }}
              >
                <MotiView
                  from={{ width: "0%" }}
                  animate={{ width: "75%" }}
                  transition={{ type: "timing", duration: 1000, delay: 1000 }}
                >
                  <LinearGradient
                    colors={[theme.secondary, theme.primary]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{ height: "100%", width: "100%", borderRadius: 6 }}
                  />
                </MotiView>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View>
                  <ThemedText
                    style={{
                      fontSize: 12,
                      opacity: 0.6,
                      marginBottom: 4,
                      fontFamily: "Outfit_400Regular",
                    }}
                  >
                    Steps
                  </ThemedText>
                  <ThemedText
                    style={{ fontSize: 16, fontFamily: "Outfit_700Bold" }}
                  >
                    7,500 / 10,000
                  </ThemedText>
                </View>
                <View>
                  <ThemedText
                    style={{
                      fontSize: 12,
                      opacity: 0.6,
                      marginBottom: 4,
                      fontFamily: "Outfit_400Regular",
                    }}
                  >
                    Calories
                  </ThemedText>
                  <ThemedText
                    style={{ fontSize: 16, fontFamily: "Outfit_700Bold" }}
                  >
                    450 / 600
                  </ThemedText>
                </View>
              </View>
            </PremiumCard>

            {/* Quick Stats Header with Log Button */}
            <MotiView
              from={{ opacity: 0, translateX: -10 }}
              animate={{ opacity: 1, translateX: 0 }}
              transition={{ delay: 1000 }}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <ThemedText
                style={{ fontSize: 20, fontFamily: "Outfit_700Bold" }}
              >
                Quick Stats
              </ThemedText>
              <ThemedButton
                variant="secondary"
                size="sm"
                onPress={() => router.push("/workout/log")}
                haptic="medium"
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                  borderRadius: 12,
                }}
              >
                <Dumbbell size={16} color="#000" />
                <Text
                  style={{
                    fontFamily: "Outfit_700Bold",
                    fontSize: 12,
                    color: "#000",
                  }}
                >
                  Log Workout
                </Text>
              </ThemedButton>
            </MotiView>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 24,
              }}
            >
              <PremiumCard
                delay={400}
                glass={true}
                style={{
                  flex: 1,
                  marginRight: 8,
                  alignItems: "center",
                  padding: 16,
                }}
              >
                <Trophy size={24} color="#FFD700" />
                <AnimatedCounter
                  value={24}
                  duration={1500}
                  delay={1100}
                  style={{
                    fontSize: 24,
                    fontFamily: "Outfit_700Bold",
                    marginTop: 8,
                    color: theme.text,
                  }}
                />
                <ThemedText
                  style={{
                    fontSize: 12,
                    opacity: 0.6,
                    marginTop: 4,
                    fontFamily: "Outfit_400Regular",
                  }}
                >
                  Wins
                </ThemedText>
              </PremiumCard>
              <PremiumCard
                delay={500}
                glass={true}
                style={{
                  flex: 1,
                  marginHorizontal: 8,
                  alignItems: "center",
                  padding: 16,
                }}
              >
                <Target size={24} color={theme.secondary} />
                <AnimatedCounter
                  value={67}
                  duration={1500}
                  delay={1200}
                  style={{
                    fontSize: 24,
                    fontFamily: "Outfit_700Bold",
                    marginTop: 8,
                    color: theme.text,
                  }}
                />
                <ThemedText
                  style={{
                    fontSize: 12,
                    opacity: 0.6,
                    marginTop: 4,
                    fontFamily: "Outfit_400Regular",
                  }}
                >
                  Battles
                </ThemedText>
              </PremiumCard>
              <PremiumCard
                delay={600}
                glass={true}
                style={{
                  flex: 1,
                  marginLeft: 8,
                  alignItems: "center",
                  padding: 16,
                }}
              >
                <TrendingUp size={24} color={theme.primary} />
                <AnimatedCounter
                  value={47}
                  duration={1500}
                  delay={1300}
                  format={(value) => `#${value}`}
                  style={{
                    fontSize: 24,
                    fontFamily: "Outfit_700Bold",
                    marginTop: 8,
                    color: theme.text,
                  }}
                />
                <ThemedText
                  style={{
                    fontSize: 12,
                    opacity: 0.6,
                    marginTop: 4,
                    fontFamily: "Outfit_400Regular",
                  }}
                >
                  Rank
                </ThemedText>
              </PremiumCard>
            </View>

            {/* Upcoming Competitions */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <ThemedText
                style={{ fontSize: 20, fontFamily: "Outfit_700Bold" }}
              >
                Live Now
              </ThemedText>
              <TouchableOpacity onPress={() => router.push("/(tabs)/compete")}>
                <ThemedText
                  style={{
                    fontSize: 14,
                    color: theme.secondary,
                    fontFamily: "Outfit_600SemiBold",
                  }}
                >
                  View All
                </ThemedText>
              </TouchableOpacity>
            </View>

            <PremiumCard
              delay={700}
              glass={true}
              style={{ padding: 0, marginBottom: 16 }}
            >
              <TouchableOpacity onPress={() => router.push("/competition/1")}>
                <LinearGradient
                  colors={[theme.danger, theme.primary]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{ padding: 16 }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 18,
                        color: "#fff",
                        fontFamily: "Outfit_700Bold",
                      }}
                    >
                      💪 Push-Up Challenge
                    </Text>
                    <View
                      style={{
                        backgroundColor: "rgba(0,255,136,0.2)",
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        borderRadius: 12,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          color: "#00FF88",
                          fontFamily: "Outfit_700Bold",
                        }}
                      >
                        LIVE
                      </Text>
                    </View>
                  </View>
                </LinearGradient>
                <View style={{ padding: 16 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginBottom: 12,
                    }}
                  >
                    <View>
                      <ThemedText
                        style={{
                          fontSize: 12,
                          opacity: 0.6,
                          marginBottom: 4,
                          fontFamily: "Outfit_400Regular",
                        }}
                      >
                        Prize Pool
                      </ThemedText>
                      <ThemedText
                        style={{
                          fontSize: 18,
                          color: theme.secondary,
                          fontFamily: "Outfit_700Bold",
                        }}
                      >
                        $500
                      </ThemedText>
                    </View>
                    <View>
                      <ThemedText
                        style={{
                          fontSize: 12,
                          opacity: 0.6,
                          marginBottom: 4,
                          fontFamily: "Outfit_400Regular",
                        }}
                      >
                        Participants
                      </ThemedText>
                      <ThemedText
                        style={{ fontSize: 18, fontFamily: "Outfit_700Bold" }}
                      >
                        234
                      </ThemedText>
                    </View>
                    <View>
                      <ThemedText
                        style={{
                          fontSize: 12,
                          opacity: 0.6,
                          marginBottom: 4,
                          fontFamily: "Outfit_400Regular",
                        }}
                      >
                        Ends In
                      </ThemedText>
                      <ThemedText
                        style={{
                          fontSize: 18,
                          color: theme.danger,
                          fontFamily: "Outfit_700Bold",
                        }}
                      >
                        2h 15m
                      </ThemedText>
                    </View>
                  </View>
                  <TouchableOpacity>
                    <LinearGradient
                      colors={[theme.secondary, theme.primary]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={{
                        height: 48,
                        borderRadius: 12,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          color: "#000",
                          fontSize: 16,
                          fontFamily: "Outfit_700Bold",
                        }}
                      >
                        Join Battle
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </PremiumCard>
          </View>
        </ScrollView>
      </ThemedScreen>
    </DynamicBackground>
  );
}
