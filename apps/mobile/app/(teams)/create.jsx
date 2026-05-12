import { View, ScrollView, TouchableOpacity, TextInput, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeft, Users } from "lucide-react-native";
import { ThemedScreen } from "@/components/ui/ThemedScreen";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedCard } from "@/components/ui/ThemedCard";
import { useTheme } from "@/theme/useTheme";
import { useThemeStore } from "@/theme/themeStore";
import { useState } from "react";

export default function CreateTeamScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const theme = useTheme();
  const mode = useThemeStore((s) => s.mode);

  const [teamName, setTeamName] = useState("");
  const [description, setDescription] = useState("");

  const handleCreate = () => {
    if (!teamName.trim()) {
      Alert.alert("Error", "Please enter a team name");
      return;
    }
    Alert.alert("Success", `Team "${teamName}" created!`);
    router.back();
  };

  return (
    <ThemedScreen>
      <StatusBar style={mode === "dark" ? "light" : "dark"} />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View style={{ paddingTop: insets.top + 20, paddingHorizontal: 20 }}>
          <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 24 }}>
            <ArrowLeft size={24} color={theme.text} />
          </TouchableOpacity>

          <ThemedText style={{ fontSize: 28, fontWeight: "bold", marginBottom: 8 }}>
            Create Team
          </ThemedText>
          <ThemedText style={{ opacity: 0.6, marginBottom: 32 }}>
            Build your battle squad
          </ThemedText>

          <View style={{ marginBottom: 24 }}>
            <ThemedText style={{ fontWeight: "600", marginBottom: 8 }}>Team Name</ThemedText>
            <ThemedCard style={{ padding: 0 }}>
              <TextInput
                style={{ padding: 16, color: theme.text, fontSize: 16 }}
                placeholder="e.g. Morning Warriors"
                placeholderTextColor={theme.muted}
                value={teamName}
                onChangeText={setTeamName}
              />
            </ThemedCard>
          </View>

          <View style={{ marginBottom: 24 }}>
            <ThemedText style={{ fontWeight: "600", marginBottom: 8 }}>Description</ThemedText>
            <ThemedCard style={{ padding: 0 }}>
              <TextInput
                style={{ padding: 16, color: theme.text, fontSize: 16, height: 100 }}
                placeholder="What's your team about?"
                placeholderTextColor={theme.muted}
                value={description}
                onChangeText={setDescription}
                multiline
                textAlignVertical="top"
              />
            </ThemedCard>
          </View>

          <TouchableOpacity onPress={handleCreate}>
            <LinearGradient
              colors={[theme.primary, theme.secondary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ height: 56, borderRadius: 28, justifyContent: "center", alignItems: "center" }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Users size={20} color="#000" style={{ marginRight: 8 }} />
                <ThemedText style={{ color: "#000", fontWeight: "bold", fontSize: 18 }}>
                  Create Team
                </ThemedText>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ThemedScreen>
  );
}