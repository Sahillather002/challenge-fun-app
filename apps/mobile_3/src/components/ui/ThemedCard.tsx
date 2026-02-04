import React from "react";
import { View, ViewStyle, StyleProp } from "react-native";
import { useTheme } from "@/theme/useTheme";

export function ThemedCard({
    children,
    style,
    elevation = 3,
    ...props
}: {
    children?: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    elevation?: number;
    [key: string]: any;
}) {
    const theme = useTheme();

    return (
        <View
            style={[
                {
                    backgroundColor: theme.card,
                    borderRadius: 20,
                    padding: 20,
                    shadowColor: theme.text,
                    shadowOffset: { width: 0, height: elevation * 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: elevation * 4,
                    elevation: elevation,
                    borderWidth: 1,
                    borderColor: theme.card,
                },
                style,
            ]}
            {...props}
        >
            {children}
        </View>
    );
}
