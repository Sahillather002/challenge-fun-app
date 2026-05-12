import { View, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
  useAnimatedScrollHandler,
  withRepeat,
  withTiming,
  withSequence
} from "react-native-reanimated";
import {
  Settings, Users, Share2, Award, BarChart3, Edit, LogOut, Camera, MessageSquare, ChevronRight, Zap, Target, Trophy
} from "lucide-react-native";

import { ThemedScreen } from "@/components/ui/ThemedScreen";
import { ThemedText } from "@/components/ui/ThemedText";
import { PremiumCard } from "@/components/ui/PremiumCard";
import { DynamicBackground } from "@/components/ui/DynamicBackground";
import { useTheme } from "@/theme/useTheme";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/services/api";

const HEADER_HEIGHT = 120;

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const theme = useTheme();
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState(null);

  const scrollY = useSharedValue(0);

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

  const onScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const headerStyle = useAnimatedStyle(() => {
    const height = interpolate(
      scrollY.value,
      [0, 60],
      [HEADER_HEIGHT, insets.top + 55],
      Extrapolate.CLAMP
    );
    return { height };
  });

  const avatarScale = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollY.value,
      [0, 100],
      [1, 0.45],
      Extrapolate.CLAMP
    );
    const translateY = interpolate(
      scrollY.value,
      [0, 100],
      [0, -5],
      Extrapolate.CLAMP
    );
    return { transform: [{ scale }, { translateY }] };
  });

  const infoOpacity = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, 50],
      [1, 0],
      Extrapolate.CLAMP
    );
    return { opacity };
  });

  const displayName = user?.user_metadata?.name || user?.email?.split('@')[0] || "Fit Fighter";
  const initials = displayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <DynamicBackground>
      <ThemedScreen transparent={true}>
        {/* Dynamic Sticky Header Overlay */}
        <Animated.View style={[styles.headerContainer, headerStyle]}>
          <LinearGradient
            colors={[theme.secondary + '40', theme.primary + '10', 'transparent']}
            style={StyleSheet.absoluteFill}
          />
          <View style={{ marginTop: insets.top, height: 55, justifyContent: 'center', alignItems: 'center' }}>
            <ThemedText style={{ fontSize: 20, fontFamily: 'Outfit_700Bold' }}>My Profile</ThemedText>
          </View>
        </Animated.View>

        <Animated.ScrollView
          onScroll={onScroll}
          scrollEventThrottle={16}
          contentContainerStyle={{
            paddingTop: HEADER_HEIGHT,
            paddingBottom: 150,
            paddingHorizontal: 20,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Brand/User Focus Header */}
          <View style={styles.focusContainer}>
            <Animated.View style={[styles.avatarBackdrop, avatarScale]}>
              <View style={[styles.avatarRing, { borderColor: theme.primary + '60' }]}>
                <LinearGradient
                  colors={[theme.secondary, theme.primary]}
                  style={styles.avatarGradient}
                >
                  <ThemedText style={styles.avatarText}>{initials}</ThemedText>
                </LinearGradient>
              </View>
            </Animated.View>

            <Animated.View style={[styles.userInfoContainer, infoOpacity]}>
              <ThemedText style={styles.userNameText}>
                {profile?.name || displayName}
              </ThemedText>
              <ThemedText style={styles.userEmailText}>
                {user?.email}
              </ThemedText>
              {profile?.bio && (
                <View style={styles.bioContainer}>
                  <ThemedText style={styles.bioText}>"{profile.bio}"</ThemedText>
                </View>
              )}
            </Animated.View>
          </View>

          {/* Quick Stats Header */}
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>Quick Stats</ThemedText>
            <TouchableOpacity style={styles.logWorkoutButton}>
              <Zap size={16} color="#000" style={{ marginRight: 6 }} />
              <ThemedText style={styles.logWorkoutText}>Log Workout</ThemedText>
            </TouchableOpacity>
          </View>

          {/* High-Vibrancy Stats Dashboard */}
          <View style={styles.statsDashboard}>
            <StatTile
              label="Total Wins"
              value={profile?.wins || 0}
              icon={<Trophy size={18} color="#FFD700" />}
              color="#4ADE80"
              delay={100}
            />
            <StatTile
              label="Day Streak"
              value={profile?.streak || 0}
              icon={<Zap size={18} color="#FF6B35" />}
              color="#FB923C"
              delay={200}
            />
            <StatTile
              label="Current Rank"
              value={profile?.rank || 'Rookie'}
              icon={<Target size={18} color="#00F0FF" />}
              color="#60A5FA"
              delay={300}
            />
          </View>

          {/* Premium Settings Surface */}
          <PremiumCard glass={true} style={styles.surfaceCard} delay={400}>
            <ThemedText style={styles.surfaceTitle}>Account Management</ThemedText>
            <ActionRow icon={<Edit size={20} color={theme.secondary} />} title="Edit Profile Details" desc="Avatar, bio, and social links" onPress={() => router.push("/(profile)/edit-profile")} />
            <ActionRow icon={<Users size={20} color={theme.primary} />} title="Friends & Squads" desc="Manage your active workout circle" onPress={() => router.push("/(profile)/friends")} />
            <ActionRow icon={<Award size={20} color="#FFD700" />} title="Achievement Gallery" desc="View collected badges and level milestones" onPress={() => router.push("/(profile)/achievements")} />
            <ActionRow icon={<MessageSquare size={20} color="#00F0FF" />} title="Private Snaps" desc="Your secure media inbox" onPress={() => router.push("/snaps/inbox")} />
            <ActionRow icon={<Settings size={20} color={theme.muted} />} title="System Preferences" desc="Notifications, theme, and privacy" onPress={() => router.push("/(profile)/settings")} />
          </PremiumCard>

          {/* Integrated Logout Surface */}
          <TouchableOpacity onPress={handleLogout} activeOpacity={0.7} style={styles.logoutWrapper}>
            <PremiumCard glass={true} style={styles.logoutSurface}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <LogOut size={20} color="#FF4D4D" />
                <ThemedText style={styles.logoutLabel}>Logout</ThemedText>
              </View>
            </PremiumCard>
          </TouchableOpacity>
        </Animated.ScrollView>
      </ThemedScreen>
    </DynamicBackground >
  );
}

/* Luxury View Components */

function StatTile({ label, value, color, delay, icon }) {
  return (
    <PremiumCard glass={true} delay={delay} style={styles.statTile}>
      <View style={{ alignItems: 'center', width: '100%' }}>
        <View style={styles.statIconHeader}>{icon}</View>
        <ThemedText style={styles.statValueText}>{value}</ThemedText>
        <ThemedText style={styles.statLabelText}>{label}</ThemedText>
      </View>
    </PremiumCard>
  );
}

function ActionRow({ icon, title, desc, onPress }) {
  const theme = useTheme();
  return (
    <TouchableOpacity onPress={onPress} style={styles.actionRow} activeOpacity={0.6}>
      <View style={styles.actionIconContainer}>{icon}</View>
      <View style={styles.actionTextContainer}>
        <ThemedText style={styles.actionTitleText}>{title}</ThemedText>
        <ThemedText style={styles.actionDescText} numberOfLines={1}>{desc}</ThemedText>
      </View>
      <ChevronRight size={18} color={theme.text} style={{ opacity: 0.3 }} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  focusContainer: {
    alignItems: "center",
    zIndex: 20,
    marginTop: -20,
    marginBottom: 20,
  },
  avatarBackdrop: {
    marginBottom: 20,
  },
  avatarRing: {
    padding: 6,
    borderRadius: 65,
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  avatarGradient: {
    width: 105,
    height: 105,
    borderRadius: 55,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: '#00F0FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  avatarText: {
    fontSize: 36,
    fontFamily: 'Outfit_700Bold',
    color: '#fff',
    letterSpacing: 2,
  },
  userInfoContainer: {
    alignItems: 'center',
  },
  userNameText: {
    fontSize: 28,
    fontFamily: 'Outfit_700Bold',
    letterSpacing: -0.5,
  },
  userEmailText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    opacity: 0.4,
    marginTop: 2,
  },
  bioContainer: {
    marginTop: 12,
    paddingHorizontal: 30,
  },
  bioText: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    fontStyle: 'italic',
    textAlign: 'center',
    opacity: 0.7,
  },
  statsDashboard: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 25,
  },
  statTile: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
    height: 140,
    justifyContent: 'center',
  },
  statIconHeader: {
    marginBottom: 8,
    opacity: 1,
  },
  statValueText: {
    fontSize: 28,
    fontFamily: 'Outfit_700Bold',
    color: '#fff',
    marginBottom: 4,
    textShadowColor: 'rgba(255,255,255,0.2)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  statLabelText: {
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
    opacity: 0.5,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Outfit_700Bold',
  },
  logWorkoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4ADE80',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#4ADE80',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  logWorkoutText: {
    fontSize: 12,
    fontFamily: 'Outfit_700Bold',
    color: '#000',
  },
  surfaceCard: {
    paddingVertical: 10,
    marginBottom: 25,
  },
  surfaceTitle: {
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
    opacity: 0.3,
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 5,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  actionIconContainer: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitleText: {
    fontSize: 15,
    fontFamily: 'Outfit_600SemiBold',
  },
  actionDescText: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    opacity: 0.4,
    marginTop: 2,
  },
  logoutWrapper: {
    marginTop: 5,
    marginBottom: 30,
  },
  logoutSurface: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderStyle: 'dashed',
    backgroundColor: 'rgba(255,77,77,0.03)',
  },
  logoutLabel: {
    marginLeft: 12,
    fontFamily: 'Outfit_700Bold',
    color: '#FF4D4D',
    fontSize: 15,
  }
});
