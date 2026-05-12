import { View, ScrollView, TouchableOpacity, TextInput, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeft, Camera, Dumbbell, Footprints, Droplet, Flame, Send } from "lucide-react-native";
import { ThemedScreen } from "@/components/ui/ThemedScreen";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedCard } from "@/components/ui/ThemedCard";
import { useTheme } from "@/theme/useTheme";
import { useThemeStore } from "@/theme/themeStore";
import { useState } from "react";
import { useRouter } from "expo-router";

export default function CreatePostScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const mode = useThemeStore((s) => s.mode);
  const router = useRouter();
  
  const [caption, setCaption] = useState("");
  const [selectedWorkout, setSelectedWorkout] = useState<string | null>(null);

  const workoutOptions = [
    { id: "running", label: "Running", icon: Footprints },
    { id: "gym", label: "Gym Workout", icon: Dumbbell },
    { id: "water", label: "Hydration", icon: Droplet },
    { id: "cardio", label: "Cardio", icon: Flame },
  ];

  const handlePost = () => {
    if (!caption.trim() && !selectedWorkout) {
      Alert.alert("Error", "Please add a caption or select a workout");
      return;
    }
    Alert.alert("Success", "Post created!");
    router.back();
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
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft size={24} color={theme.text} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handlePost}>
              <LinearGradient
                colors={[theme.primary, theme.secondary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 }}
              >
                <ThemedText style={{ color: "#000", fontWeight: "bold" }}>Post</ThemedText>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <ThemedText style={{ fontSize: 24, fontWeight: "bold", marginBottom: 24 }}>
            Create Post
          </ThemedText>

          <View style={{ marginBottom: 24 }}>
            <ThemedText style={{ fontWeight: "600", marginBottom: 8 }}>Caption</ThemedText>
            <ThemedCard style={{ padding: 0 }}>
              <TextInput
                style={{ padding: 16, color: theme.text, fontSize: 16, minHeight: 120 }}
                placeholder="Share your workout..."
                placeholderTextColor={theme.muted}
                value={caption}
                onChangeText={setCaption}
                multiline
                textAlignVertical="top"
              />
            </ThemedCard>
          </View>

          <ThemedText style={{ fontSize: 18, fontWeight: "bold", marginBottom: 16 }}>
            Add Workout Data
          </ThemedText>

          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 32 }}>
            {workoutOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = selectedWorkout === option.id;
              return (
                <TouchableOpacity
                  key={option.id}
                  onPress={() => setSelectedWorkout(option.id)}
                  style={{ width: "45%" }}
                >
                  <LinearGradient
                    colors={isSelected ? [theme.primary, theme.secondary] : [theme.card, theme.card]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{ padding: 16, borderRadius: 16, alignItems: "center" }}
                  >
                    <Icon size={24} color={isSelected ? "#000" : theme.text} />
                    <ThemedText style={{ marginTop: 8, fontWeight: "600", color: isSelected ? "#000" : theme.text }}>
                      {option.label}
                    </ThemedText>
                  </LinearGradient>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity onPress={() => router.push("/camera")}>
            <ThemedCard style={{ alignItems: "center", padding: 32, borderWidth: 1, borderStyle: "dashed", borderColor: theme.primary }}>
              <Camera size={40} color={theme.primary} />
              <ThemedText style={{ marginTop: 12, fontWeight: "600", color: theme.primary }}>
                Add Photo/Video
              </ThemedText>
            </ThemedCard>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ThemedScreen>
  );
}