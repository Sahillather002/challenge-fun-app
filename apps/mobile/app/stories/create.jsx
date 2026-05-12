import { View, TouchableOpacity, TextInput, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeft, Send, Image, Smile } from "lucide-react-native";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedCard } from "@/components/ui/ThemedCard";
import { useTheme } from "@/theme/useTheme";
import { useThemeStore } from "@/theme/themeStore";
import { useState } from "react";

export default function CreateStoryScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const theme = useTheme();
  const mode = useThemeStore((s) => s.mode);
  const { type } = useLocalSearchParams();
  
  const [caption, setCaption] = useState("");
  
  const storyTypeInfo = {
    workout: { label: "Workout Story", placeholder: "Share your workout details...", icon: "💪" },
    steps: { label: "Steps Story", placeholder: "How many steps did you crush today?", icon: "👟" },
    water: { label: "Water Story", placeholder: "Track your hydration!", icon: "💧" },
    calories: { label: "Calories Story", placeholder: "Log your calorie burn!", icon: "🔥" },
    achievement: { label: "Achievement Story", placeholder: "Celebrate your win!", icon: "🏆" },
  };
  
  const info = storyTypeInfo[type] || storyTypeInfo.workout;
  
  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar style={mode === "dark" ? "light" : "dark"} />
      <View style={{ paddingTop: insets.top + 20, paddingHorizontal: 20 }}>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 24 }}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color={theme.text} />
          </TouchableOpacity>
          <ThemedText style={{ fontSize: 20, fontWeight: "600", marginLeft: 16 }}>
            {info.label}
          </ThemedText>
        </View>
        
        <ThemedCard style={{ marginBottom: 24 }}>
          <View style={{ alignItems: "center", padding: 20 }}>
            <ThemedText style={{ fontSize: 64, marginBottom: 16 }}>{info.icon}</ThemedText>
            <ThemedText style={{ fontSize: 16, opacity: 0.6, textAlign: "center" }}>
              {info.label}
            </ThemedText>
          </View>
        </ThemedCard>
        
        <ThemedText style={{ fontSize: 16, fontWeight: "600", marginBottom: 12 }}>
          Add Caption
        </ThemedText>
        
        <TextInput
          style={{
            backgroundColor: theme.card,
            borderRadius: 16,
            padding: 16,
            color: theme.text,
            minHeight: 100,
            textAlignVertical: "top",
            marginBottom: 24,
          }}
          placeholder={info.placeholder}
          placeholderTextColor={theme.muted}
          value={caption}
          onChangeText={setCaption}
          multiline
        />
        
        <View style={{ flexDirection: "row", gap: 12 }}>
          <TouchableOpacity style={{ flex: 1 }}>
            <LinearGradient
              colors={[theme.primary, theme.secondary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ padding: 16, borderRadius: 16, alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 8 }}
            >
              <Send size={20} color="#000" />
              <ThemedText style={{ color: "#000", fontWeight: "600" }}>Share Story</ThemedText>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}