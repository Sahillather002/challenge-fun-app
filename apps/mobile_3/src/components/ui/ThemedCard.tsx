import React from "react";
import { View, ViewStyle, StyleProp } from "react-native";
import { useTheme } from "@/theme/useTheme";

export function ThemedCard({
    children,
    style,
    ...props
}: {
    children?: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    [key: string]: any;
}) {
    const theme = useTheme();

    return (
        <View
            style={[
                {
                    backgroundColor: theme.card,
                    borderRadius: 16,
                    padding: 16,
                },
                style,
            ]}
            {...props}
        >
            {children}
        </View>
    );
}
