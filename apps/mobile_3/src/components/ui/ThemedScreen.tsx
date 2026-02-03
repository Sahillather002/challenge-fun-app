import React from "react";
import { View } from "react-native";
import { useTheme } from "@/theme/useTheme";

export function ThemedScreen({ children }: { children: React.ReactNode }) {
    const theme = useTheme();

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            {children}
        </View>
    );
}
