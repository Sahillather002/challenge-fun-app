import { View, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeft, Camera, Save } from "lucide-react-native";
import { ThemedScreen } from "@/components/ui/ThemedScreen";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedCard } from "@/components/ui/ThemedCard";
import { useTheme } from "@/theme/useTheme";
import { useThemeStore } from "@/theme/themeStore";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/services/api";
import { Alert, ActivityIndicator } from "react-native";

export default function EditProfileScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const theme = useTheme();
    const mode = useThemeStore((s) => s.mode);
    const { user } = useAuth();

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    const [profile, setProfile] = useState({
        name: "",
        username: "",
        email: "",
        bio: "",
        height: "",
        weight: "",
        age: "",
    });

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const response = await api.getProfile();
            const data = response.data;
            setProfile({
                name: data.name || "",
                username: data.username || "",
                email: data.email || "",
                bio: data.bio || "",
                height: data.height || "",
                weight: data.weight || "",
                age: data.age?.toString() || "",
            });
        } catch (error) {
            console.error("Error loading profile:", error);
            Alert.alert("Error", "Failed to load profile data");
        } finally {
            setFetching(false);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            await api.updateProfile({
                name: profile.name,
                bio: profile.bio,
                height: profile.height,
                weight: profile.weight,
                age: profile.age,
            });
            Alert.alert("Success", "Profile updated successfully");
            router.back();
        } catch (error) {
            console.error("Error updating profile:", error);
            Alert.alert("Error", "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    const displayName = profile.name || user?.email?.split('@')[0] || "User";
    const initials = displayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    console.log(displayName)

    return (
        <ThemedScreen>
            <StatusBar style={mode === "dark" ? "light" : "dark"} />
            <View style={{ paddingTop: insets.top + 20, paddingHorizontal: 20 }}>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 24,
                    }}
                >
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <TouchableOpacity onPress={() => router.back()}>
                            <ArrowLeft size={24} color={theme.text} />
                        </TouchableOpacity>
                        <ThemedText
                            style={{
                                fontSize: 28,
                                fontWeight: "bold",
                                marginLeft: 16,
                            }}
                        >
                            Edit Profile
                        </ThemedText>
                    </View>
                    <TouchableOpacity onPress={handleSave} disabled={loading}>
                        <LinearGradient
                            colors={[theme.secondary, theme.primary]}
                            style={{
                                paddingHorizontal: 16,
                                paddingVertical: 8,
                                borderRadius: 8,
                                flexDirection: "row",
                                alignItems: "center",
                                opacity: loading ? 0.6 : 1,
                            }}
                        >
                            {loading ? (
                                <ActivityIndicator size="small" color="#000" />
                            ) : (
                                <>
                                    <Save size={16} color="#000" />
                                    <ThemedText
                                        style={{ marginLeft: 8, fontWeight: "600", color: "#000" }}
                                    >
                                        Save
                                    </ThemedText>
                                </>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Profile Photo */}
                <View style={{ alignItems: "center", marginBottom: 32 }}>
                    <View style={{ position: "relative" }}>
                        <LinearGradient
                            colors={[theme.secondary, theme.primary]}
                            style={{
                                width: 120,
                                height: 120,
                                borderRadius: 60,
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <ThemedText style={{ fontSize: 40, fontWeight: "bold" }}>
                                {initials}
                            </ThemedText>
                        </LinearGradient>
                        <TouchableOpacity
                            style={{
                                position: "absolute",
                                bottom: 0,
                                right: 0,
                                backgroundColor: theme.secondary,
                                width: 40,
                                height: 40,
                                borderRadius: 20,
                                justifyContent: "center",
                                alignItems: "center",
                                borderWidth: 3,
                                borderColor: theme.background,
                            }}
                        >
                            <Camera size={20} color="#000" />
                        </TouchableOpacity>
                    </View>
                    <ThemedText
                        style={{ marginTop: 12, fontSize: 14, color: theme.secondary }}
                    >
                        Change Profile Photo
                    </ThemedText>
                </View>

                {/* Form Fields */}
                <FormField
                    label="Full Name"
                    value={profile.name}
                    onChangeText={(text) => setProfile({ ...profile, name: text })}
                    placeholder="Enter your name"
                />

                <FormField
                    label="Username"
                    value={profile.username}
                    onChangeText={(text) => setProfile({ ...profile, username: text })}
                    placeholder="Choose a username"
                    editable={false} // Username usually shouldn't be changed easily
                />

                <FormField
                    label="Email"
                    value={profile.email}
                    onChangeText={(text) => setProfile({ ...profile, email: text })}
                    placeholder="Enter your email"
                    keyboardType="email-address"
                    editable={false} // Email should also be handled carefully
                />

                <FormField
                    label="Bio"
                    value={profile.bio}
                    onChangeText={(text) => setProfile({ ...profile, bio: text })}
                    placeholder="Tell us about yourself"
                    multiline
                    numberOfLines={3}
                />

                <ThemedText
                    style={{ fontSize: 18, fontWeight: "bold", marginTop: 24, marginBottom: 16 }}
                >
                    Physical Stats
                </ThemedText>

                <View style={{ flexDirection: "row", gap: 12 }}>
                    <View style={{ flex: 1 }}>
                        <FormField
                            label="Height"
                            value={profile.height}
                            onChangeText={(text) => setProfile({ ...profile, height: text })}
                            placeholder="cm"
                        />
                    </View>
                    <View style={{ flex: 1 }}>
                        <FormField
                            label="Weight"
                            value={profile.weight}
                            onChangeText={(text) => setProfile({ ...profile, weight: text })}
                            placeholder="kg"
                        />
                    </View>
                </View>

                <FormField
                    label="Age"
                    value={profile.age}
                    onChangeText={(text) => setProfile({ ...profile, age: text })}
                    placeholder="Enter your age"
                    keyboardType="numeric"
                />
            </ScrollView>
        </ThemedScreen>
    );
}

function FormField({
    label,
    value,
    onChangeText,
    placeholder,
    multiline = false,
    numberOfLines = 1,
    keyboardType = "default",
    editable = true,
}) {
    const theme = useTheme();

    return (
        <View style={{ marginBottom: 20 }}>
            <ThemedText style={{ fontSize: 14, fontWeight: "600", marginBottom: 8 }}>
                {label}
            </ThemedText>
            <ThemedCard>
                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={theme.muted}
                    multiline={multiline}
                    numberOfLines={numberOfLines}
                    keyboardType={keyboardType}
                    editable={editable}
                    style={{
                        color: editable ? theme.text : theme.muted,
                        fontSize: 16,
                        minHeight: multiline ? 80 : 48,
                        textAlignVertical: multiline ? "top" : "center",
                    }}
                />
            </ThemedCard>
        </View>
    );
}
