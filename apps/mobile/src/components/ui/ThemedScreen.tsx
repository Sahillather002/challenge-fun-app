import React from "react";
import { View } from "react-native";
import { useTheme } from "@/theme/useTheme";

export function ThemedScreen({ children, transparent = false }: { children: React.ReactNode, transparent?: boolean }) {
    const theme = useTheme();

    return (
        <View style={{ flex: 1, backgroundColor: transparent ? 'transparent' : theme.background }}>
            {children}
        </View>
    );
}
