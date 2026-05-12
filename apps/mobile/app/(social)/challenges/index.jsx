import { View, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Trophy, Users, Calendar, ArrowLeft } from "lucide-react-native";
import { ThemedScreen } from "@/components/ui/ThemedScreen";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedCard } from "@/components/ui/ThemedCard";
import { useTheme } from "@/theme/useTheme";
import { useThemeStore } from "@/theme/themeStore";
import { MotiView } from "moti";
import { useState } from "react";

const INITIAL_CHALLENGES = [
  {
    id: "1",
    title: "💪 10K Steps Daily",
    participants: 15420,
    endsIn: "5d",
    joined: true,
  },
  {
    id: "2",
    title: "🏃‍♀️ Morning Runs",
    participants: 8934,
    endsIn: "2d",
    joined: false,
  },
  {
    id: "3",
    title: "💧 Hydration Hero",
    participants: 12056,
    endsIn: "3d",
    joined: true,
  },
  {
    id: "4",
    title: "🧘 Meditation Streak",
    participants: 5678,
    endsIn: "7d",
    joined: false,
  },
];

export default function ChallengesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const theme = useTheme();
  const mode = useThemeStore((s) => s.mode);
  const [challenges, setChallenges] = useState(INITIAL_CHALLENGES);

  const toggleJoin = (id: string) => {
    setChallenges(prev => prev.map(c => 
      c.id === id 
        ? { ...c, joined: !c.joined, participants: c.joined ? c.participants - 1 : c.participants + 1 }
        : c
    ));
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
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 24 }}>
            <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
              <ArrowLeft size={24} color={theme.text} />
            </TouchableOpacity>
            <ThemedText style={{ fontSize: 28, fontWeight: "bold" }}>Challenges</ThemedText>
          </View>

          <ThemedText style={{ fontSize: 16, opacity: 0.6, marginBottom: 24 }}>
            Join challenges and compete with friends
          </ThemedText>

          {CHALLENGES.map((challenge, index) => (
            <MotiView
              key={challenge.id}
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ delay: index * 100 }}
            >
              <ThemedCard style={{ padding: 20, marginBottom: 16 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                  <View style={{ flex: 1 }}>
                    <ThemedText style={{ fontSize: 16, fontWeight: "600", marginBottom: 8 }}>
                      {challenge.title}
                    </ThemedText>
                    <View style={{ flexDirection: "row", gap: 16 }}>
                      <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Users size={14} color={theme.muted} />
                        <ThemedText style={{ fontSize: 12, marginLeft: 4, opacity: 0.6 }}>
                          {challenge.participants.toLocaleString()}
                        </ThemedText>
                      </View>
                      <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Calendar size={14} color={theme.muted} />
                        <ThemedText style={{ fontSize: 12, marginLeft: 4, opacity: 0.6 }}>
                          {challenge.endsIn} left
                        </ThemedText>
                      </View>
                    </View>
                  </View>
<TouchableOpacity onPress={() => toggleJoin(challenge.id)}>
                     <LinearGradient
                       colors={challenge.joined ? [theme.secondary, theme.primary] : [theme.card, theme.card]}
                       start={{ x: 0, y: 0 }}
                       end={{ x: 1, y: 0 }}
                       style={{ paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 }}
                     >
                       <ThemedText style={{ color: challenge.joined ? "#000" : theme.text, fontWeight: "600" }}>
                         {challenge.joined ? "Joined" : "Join"}
                       </ThemedText>
                     </LinearGradient>
                   </TouchableOpacity>
                </View>
              </ThemedCard>
            </MotiView>
          ))}
        </View>
      </ScrollView>
    </ThemedScreen>
  );
}