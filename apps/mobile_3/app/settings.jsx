import React from "react";
import { View, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft, Moon } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedScreen } from "@/components/ui/ThemedScreen";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useTheme } from "@/theme/useTheme";

export default function SettingsScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const theme = useTheme();

    return (
        <ThemedScreen>
            <View style={{ paddingTop: insets.top + 20, paddingHorizontal: 20 }}>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 32,
                    }}
                >
                    <TouchableOpacity onPress={() => router.back()}>
                        <ArrowLeft size={24} color={theme.text} />
                    </TouchableOpacity>
                    <ThemedText
                        style={{
                            fontSize: 24,
                            fontWeight: "bold",
                            marginLeft: 16,
                        }}
                    >
                        Settings
                    </ThemedText>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            paddingVertical: 16,
                            borderBottomWidth: 1,
                            borderBottomColor: theme.card,
                        }}
                    >
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <View
                                style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 20,
                                    backgroundColor: theme.card,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    marginRight: 16,
                                }}
                            >
                                <Moon size={20} color={theme.primary} />
                            </View>
                            <ThemedText style={{ fontSize: 16, fontWeight: "600" }}>
                                Dark Mode
                            </ThemedText>
                        </View>
                        <ThemeToggle />
                    </View>
                </ScrollView>
            </View>
        </ThemedScreen>
    );
}
