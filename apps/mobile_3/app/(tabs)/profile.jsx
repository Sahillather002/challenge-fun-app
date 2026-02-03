import { ScrollView, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

import {
  Settings,
  Users,
  Share2,
  Award,
  BarChart3,
  Edit,
  LogOut,
} from "lucide-react-native";

import { ThemedScreen } from "@/components/ui/ThemedScreen";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedCard } from "@/components/ui/ThemedCard";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useTheme } from "@/theme/useTheme";

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const theme = useTheme();

  return (
    <ThemedScreen>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 20,
          paddingBottom: 120,
          paddingHorizontal: 20,
        }}
      >

        {/* Header */}
        <View style={{ alignItems: "center", marginBottom: 40 }}>
          <LinearGradient
            colors={[theme.secondary, theme.primary]}
            style={{
              width: 110,
              height: 110,
              borderRadius: 55,
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <ThemedText style={{ fontSize: 32, fontWeight: "bold" }}>
              JD
            </ThemedText>
          </LinearGradient>

          <ThemedText style={{ fontSize: 24, fontWeight: "bold" }}>
            John Doe
          </ThemedText>

          <ThemedText style={{ marginTop: 4, opacity: 0.6 }}>
            @johndoe_fit
          </ThemedText>

          <TouchableOpacity style={{ marginTop: 20 }}>
            <ThemedCard style={{ flexDirection: "row", alignItems: "center" }}>
              <Edit size={18} color={theme.secondary} />
              <ThemedText style={{ marginLeft: 10, fontWeight: "600" }}>
                Edit Profile
              </ThemedText>
            </ThemedCard>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={{ flexDirection: "row", gap: 12, marginBottom: 40 }}>
          <StatCard label="Wins" value="24" />
          <StatCard label="Battles" value="67" />
          <StatCard label="Streak" value="7" />
        </View>

        {/* Menu */}
        <MenuItem
          icon={<Users size={22} color={theme.secondary} />}
          title="Friends & Teams"
          onPress={() => router.push("/friends")}
        />

        <MenuItem
          icon={<BarChart3 size={22} color={theme.primary} />}
          title="Statistics"
        />

        <MenuItem
          icon={<Award size={22} color="#FFD700" />}
          title="Achievements"
        />

        <MenuItem
          icon={<Share2 size={22} color={theme.danger} />}
          title="Invite Friends"
        />

        <MenuItem
          icon={<Settings size={22} color={theme.muted} />}
          title="Settings"
          onPress={() => router.push("/settings")}
        />

        {/* Logout */}
        <TouchableOpacity style={{ marginTop: 30 }}>
          <ThemedCard
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <LogOut size={20} color={theme.danger} />
            <ThemedText style={{ marginLeft: 10, fontWeight: "bold" }}>
              Log Out
            </ThemedText>
          </ThemedCard>
        </TouchableOpacity>
      </ScrollView>
    </ThemedScreen>
  );
}

/* Helpers */

function StatCard({ label, value }) {
  return (
    <ThemedCard style={{ flex: 1, alignItems: "center" }}>
      <ThemedText style={{ fontSize: 22, fontWeight: "bold" }}>
        {value}
      </ThemedText>
      <ThemedText style={{ opacity: 0.6, marginTop: 4 }}>
        {label}
      </ThemedText>
    </ThemedCard>
  );
}

function MenuItem({ icon, title, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={{ marginBottom: 12 }}>
      <ThemedCard style={{ flexDirection: "row", alignItems: "center" }}>
        {icon}
        <ThemedText style={{ marginLeft: 14, flex: 1, fontWeight: "600" }}>
          {title}
        </ThemedText>
        <ThemedText style={{ opacity: 0.4 }}>›</ThemedText>
      </ThemedCard>
    </TouchableOpacity>
  );
}
