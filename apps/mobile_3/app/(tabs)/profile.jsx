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
  Camera,
  MessageSquare,
} from "lucide-react-native";


import { ThemedScreen } from "@/components/ui/ThemedScreen";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedCard } from "@/components/ui/ThemedCard";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useTheme } from "@/theme/useTheme";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/services/api";
import { useState, useEffect } from "react";

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const theme = useTheme();
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await api.getProfile();
      setProfile(response.data);
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      router.replace("/auth/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const displayName = user?.user_metadata?.name || user?.email?.split('@')[0] || "User";
  const initials = displayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

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
              {initials}
            </ThemedText>
          </LinearGradient>

          <ThemedText style={{ fontSize: 24, fontWeight: "bold" }}>
            {profile?.name || displayName}
          </ThemedText>

          {profile?.bio && (
            <ThemedText style={{ marginTop: 8, opacity: 0.8, textAlign: "center" }}>
              {profile.bio}
            </ThemedText>
          )}

          <ThemedText style={{ marginTop: 4, opacity: 0.6 }}>
            {user?.email}
          </ThemedText>
        </View>

        <MenuItem
          icon={<Edit size={22} color={theme.secondary} />}
          title="Edit Profile"
          onPress={() => router.push("/(profile)/edit-profile")}
        />

        <MenuItem
          icon={<Users size={22} color={theme.secondary} />}
          title="Friends & Teams"
          onPress={() => router.push("/(profile)/friends")}
        />

        <MenuItem
          icon={<BarChart3 size={22} color={theme.primary} />}
          title="Statistics"
          onPress={() => router.push("/(profile)/statistics")}
        />

        <MenuItem
          icon={<Award size={22} color="#FFD700" />}
          title="Achievements"
          onPress={() => router.push("/(profile)/achievements")}
        />

        <MenuItem
          icon={<Share2 size={22} color={theme.danger} />}
          title="Invite Friends"
          onPress={() => router.push("/(profile)/invite")}
        />

        <MenuItem
          icon={<MessageSquare size={22} color={theme.primary} />}
          title="Snaps Inbox"
          onPress={() => router.push("/snaps/inbox")}
        />

        <MenuItem
          icon={<Camera size={22} color={theme.secondary} />}
          title="Open Camera"
          onPress={() => router.push("/camera")}
        />

        <MenuItem
          icon={<Settings size={22} color={theme.muted} />}
          title="Settings"
          onPress={() => router.push("/(profile)/settings")}
        />


        {/* Logout */}
        <TouchableOpacity onPress={handleLogout} style={{ marginTop: 30 }}>
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
