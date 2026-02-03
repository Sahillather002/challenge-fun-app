import React from "react";
import { Text, TextStyle, StyleProp } from "react-native";
import { useTheme } from "@/theme/useTheme";

export function ThemedText({
    children,
    style,
}: {
    children: React.ReactNode;
    style?: StyleProp<TextStyle>;
}) {
    const theme = useTheme();

    return <Text style={[{ color: theme.text }, style]}>{children}</Text>;
}
