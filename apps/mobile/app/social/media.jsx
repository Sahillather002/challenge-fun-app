import { View, TouchableOpacity, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { Image, Camera, Dumbbell, Footprints, Droplet, FileText, X } from "lucide-react-native";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedCard } from "@/components/ui/ThemedCard";
import { useTheme } from "@/theme/useTheme";
import { useThemeStore } from "@/theme/themeStore";

export default function MediaPickerScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const theme = useTheme();
  const mode = useThemeStore((s) => s.mode);
  
  const mediaOptions = [
    { id: 'photo', icon: Image, label: 'Photo', color: theme.primary },
    { id: 'camera', icon: Camera, label: 'Camera', color: theme.secondary },
    { id: 'workout', icon: Dumbbell, label: 'Workout', color: '#FF6B35' },
    { id: 'steps', icon: Footprints, label: 'Steps', color: '#00D9FF' },
    { id: 'water', icon: Droplet, label: 'Water', color: '#00D9FF' },
    { id: 'document', icon: FileText, label: 'Document', color: theme.muted },
  ];
  
  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar style={mode === "dark" ? "light" : "dark"} />
      <View style={{ paddingTop: insets.top + 20, paddingHorizontal: 20 }}>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 24 }}>
          <TouchableOpacity onPress={() => router.back()}>
            <X size={24} color={theme.text} />
          </TouchableOpacity>
          <ThemedText style={{ fontSize: 20, fontWeight: "600", marginLeft: 16 }}>
            Share Media
          </ThemedText>
        </View>
        
        <ThemedText style={{ fontSize: 16, opacity: 0.6, marginBottom: 24 }}>
          Select content to share in chat
        </ThemedText>
        
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 16 }}>
          {mediaOptions.map((option) => {
            const Icon = option.icon;
            return (
              <TouchableOpacity
                key={option.id}
                onPress={() => {
                  if (option.id === 'photo') router.push('/social/media/photo');
                  else if (option.id === 'camera') router.push('/camera');
                  else router.back();
                }}
                style={{ width: "45%", alignItems: "center" }}
              >
                <ThemedCard style={{ padding: 24, marginBottom: 16, width: "100%", alignItems: "center" }}>
                  <Icon size={32} color={option.color} />
                  <ThemedText style={{ marginTop: 12, fontWeight: "600" }}>
                    {option.label}
                  </ThemedText>
                </ThemedCard>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}