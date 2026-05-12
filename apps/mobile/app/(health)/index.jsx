import { View, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { Footprints, Droplet, Flame, TrendingUp, Calendar, Settings } from "lucide-react-native";
import { ThemedScreen } from "@/components/ui/ThemedScreen";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedCard } from "@/components/ui/ThemedCard";
import { PremiumCard } from "@/components/ui/PremiumCard";
import { useTheme } from "@/theme/useTheme";
import { useThemeStore } from "@/theme/themeStore";
import { useStepCounter } from "@/hooks/useStepCounter";
import { useWaterTracker } from "@/hooks/useWaterTracker";
import { useState } from "react";
import { MotiView } from "moti";

export default function HealthDashboardScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const mode = useThemeStore((s) => s.mode);
  
  const { today: steps, isAvailable, error } = useStepCounter();
  const { todayIntake, dailyGoal, getProgress, getWeekData, addWater, setDailyGoal } = useWaterTracker();
  
  const [activeTab, setActiveTab] = useState("steps");
  const stepGoal = 10000;
  const stepProgress = Math.min(steps / stepGoal, 1);
  const waterProgress = getProgress();
  const weekSteps = [5234, 7890, 10234, 8567, 6432, steps, 0];
  const weekWater = getWeekData();

  const handleGoalPress = () => {
    Alert.prompt(
      "Set Daily Goal",
      "Enter your daily water intake goal (ml)",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Save", 
          onPress: (value) => {
            const goal = parseInt(value || "0", 10);
            if (!isNaN(goal) && goal > 0) {
              setDailyGoal(goal);
            }
          }
        }
      ],
      "plain-text",
      dailyGoal.toString()
    );
  };

  return (
    <ThemedScreen>
      <StatusBar style={mode === "dark" ? "light" : "dark"} />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ paddingTop: insets.top + 20, paddingHorizontal: 20 }}>
          <View style={{ marginBottom: 24 }}>
            <ThemedText style={{ fontSize: 28, fontWeight: "bold", marginBottom: 8 }}>
              Health Dashboard
            </ThemedText>
            <ThemedText style={{ opacity: 0.6 }}>
              Track your daily activity and wellness
            </ThemedText>
          </View>

          <View style={{ flexDirection: "row", marginBottom: 24, gap: 12 }}>
            <TouchableOpacity
              onPress={() => setActiveTab("steps")}
              style={{ flex: 1 }}
            >
              <LinearGradient
                colors={activeTab === "steps" ? [theme.primary, theme.secondary] : [theme.card, theme.card]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ padding: 16, borderRadius: 16, alignItems: "center" }}
              >
                <Footprints size={24} color={activeTab === "steps" ? "#000" : theme.text} />
                <ThemedText style={{ marginTop: 8, fontWeight: "600", color: activeTab === "steps" ? "#000" : theme.text }}>
                  Steps
                </ThemedText>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => setActiveTab("water")}
              style={{ flex: 1 }}
            >
              <LinearGradient
                colors={activeTab === "water" ? [theme.primary, theme.secondary] : [theme.card, theme.card]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ padding: 16, borderRadius: 16, alignItems: "center" }}
              >
                <Droplet size={24} color={activeTab === "water" ? "#000" : theme.text} />
                <ThemedText style={{ marginTop: 8, fontWeight: "600", color: activeTab === "water" ? "#000" : theme.text }}>
                  Water
                </ThemedText>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {activeTab === "steps" ? (
            <>
              <PremiumCard glass={true} style={{ marginBottom: 24 }}>
                <View style={{ alignItems: "center" }}>
                  <Footprints size={64} color={theme.primary} />
                  <ThemedText style={{ fontSize: 48, fontWeight: "bold", marginTop: 12 }}>
                    {steps.toLocaleString()}
                  </ThemedText>
                  <ThemedText style={{ fontSize: 16, opacity: 0.6, marginTop: 4 }}>
                    Steps Today
                  </ThemedText>
                  <View style={{ height: 8, backgroundColor: theme.card, borderRadius: 4, width: "100%", marginTop: 20, overflow: "hidden" }}>
                    <View style={{ height: "100%", width: `${stepProgress * 100}%`, backgroundColor: theme.primary }} />
                  </View>
                  <ThemedText style={{ fontSize: 12, opacity: 0.6, marginTop: 8 }}>
                    {Math.round(stepProgress * 100)}% of {stepGoal.toLocaleString()} goal
                  </ThemedText>
                </View>
              </PremiumCard>

              <ThemedText style={{ fontSize: 18, fontWeight: "bold", marginBottom: 16 }}>
                Weekly Activity
              </ThemedText>

              <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 24 }}>
                {weekSteps.map((daySteps, index) => {
                  const dayLabels = ["M", "T", "W", "T", "F", "S", "S"];
                  const maxValue = Math.max(...weekSteps);
                  const height = maxValue > 0 ? (daySteps / maxValue) * 100 : 0;
                  const isToday = index === 5;
                  
                  return (
                    <View key={index} style={{ alignItems: "center", flex: 1 }}>
                      <View style={{ height: 100, width: 20, backgroundColor: theme.card, borderRadius: 10, overflow: "hidden" }}>
                        <View style={{ height: `${height}%`, backgroundColor: isToday ? theme.primary : theme.muted, borderRadius: 10 }} />
                      </View>
                      <ThemedText style={{ fontSize: 10, marginTop: 8 }}>{dayLabels[index]}</ThemedText>
                    </View>
                  );
                })}
              </View>

              {error && (
                <ThemedCard style={{ marginBottom: 16 }}>
                  <ThemedText style={{ color: theme.danger, textAlign: "center" }}>
                    {error === "Permission not granted" 
                      ? "Please grant permission to access step data" 
                      : "Unable to access step counter"}
                  </ThemedText>
                </ThemedCard>
              )}
            </>
          ) : (
            <>
              <PremiumCard glass={true} style={{ marginBottom: 24 }}>
                <View style={{ alignItems: "center" }}>
                  <Droplet size={64} color="#00D9FF" />
                  <ThemedText style={{ fontSize: 48, fontWeight: "bold", marginTop: 12 }}>
                    {todayIntake}
                    <ThemedText style={{ fontSize: 24 }}>ml</ThemedText>
                  </ThemedText>
                  <ThemedText style={{ fontSize: 16, opacity: 0.6, marginTop: 4 }}>
                    Water Today
                  </ThemedText>
                  <View style={{ height: 8, backgroundColor: theme.card, borderRadius: 4, width: "100%", marginTop: 20, overflow: "hidden" }}>
                    <View style={{ height: "100%", width: `${waterProgress * 100}%`, backgroundColor: "#00D9FF" }} />
                  </View>
                  <ThemedText style={{ fontSize: 12, opacity: 0.6, marginTop: 8 }}>
                    {Math.round(waterProgress * 100)}% of {dailyGoal}ml goal
                  </ThemedText>
                </View>
              </PremiumCard>

              <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginBottom: 24 }}>
                {[250, 500, 750, 1000].map((amount) => (
                  <TouchableOpacity
                    key={amount}
                    onPress={() => addWater(amount)}
                    style={{ width: "48%", marginBottom: 12 }}
                  >
                    <LinearGradient
                      colors={["#00D9FF", "#00FF88"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={{ padding: 16, borderRadius: 12, alignItems: "center" }}
                    >
                      <ThemedText style={{ color: "#000", fontWeight: "bold" }}>
                        +{amount}ml
                      </ThemedText>
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
              </View>

              <ThemedText style={{ fontSize: 18, fontWeight: "bold", marginBottom: 16 }}>
                Weekly Water Intake
              </ThemedText>

              <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 24 }}>
                {weekWater.map((dayWater, index) => {
                  const dayLabels = ["M", "T", "W", "T", "F", "S", "S"];
                  const maxValue = Math.max(...weekWater, dailyGoal);
                  const height = maxValue > 0 ? (dayWater / maxValue) * 100 : 0;
                  const isToday = index === 5;
                  
                  return (
                    <View key={index} style={{ alignItems: "center", flex: 1 }}>
                      <View style={{ height: 100, width: 20, backgroundColor: theme.card, borderRadius: 10, overflow: "hidden" }}>
                        <View style={{ height: `${height}%`, backgroundColor: isToday ? "#00D9FF" : theme.muted, borderRadius: 10 }} />
                      </View>
                      <ThemedText style={{ fontSize: 10, marginTop: 8 }}>{dayLabels[index]}</ThemedText>
                    </View>
                  );
                })}
              </View>
            </>
          )}

          <PremiumCard glass={true} style={{ marginBottom: 16 }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Flame size={24} color="#FF6B35" />
                <ThemedText style={{ marginLeft: 12, fontSize: 16, fontWeight: "600" }}>
                  Calories Burned
                </ThemedText>
              </View>
              <ThemedText style={{ fontSize: 20, fontWeight: "bold", color: theme.secondary }}>
                450 kcal
              </ThemedText>
            </View>
          </PremiumCard>

          <PremiumCard glass={true}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TrendingUp size={24} color={theme.primary} />
                <ThemedText style={{ marginLeft: 12, fontSize: 16, fontWeight: "600" }}>
                  Activity Minutes
                </ThemedText>
              </View>
              <ThemedText style={{ fontSize: 20, fontWeight: "bold", color: theme.secondary }}>
                68 min
              </ThemedText>
            </View>
          </PremiumCard>
        </View>
      </ScrollView>
    </ThemedScreen>
  );
}