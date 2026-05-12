import React, { useState } from "react";
import { View, ViewStyle, StyleProp, TouchableOpacity } from "react-native";
import { useTheme } from "@/theme/useTheme";
import { MotiView } from "moti";

interface ThemedCardProps {
    children?: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    elevation?: number;
    delay?: number;
    onPress?: () => void;
    [key: string]: any;
}

export function ThemedCard({
    children,
    style,
    elevation = 3,
    delay = 0,
    onPress,
    ...props
}: ThemedCardProps) {
    const theme = useTheme();
    const [isPressed, setIsPressed] = useState(false);

    const handlePressIn = () => {
        setIsPressed(true);
    };

    const handlePressOut = () => {
        setIsPressed(false);
    };

    const baseStyle: ViewStyle = {
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
    };

    const CardContent = () => (
        <MotiView
            from={{ opacity: 0, translateY: 20, scale: 0.95 }}
            animate={{ opacity: 1, translateY: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20, delay }}
        >
            <MotiView
                animate={{
                    scale: isPressed ? 0.98 : 1,
                    translateY: isPressed ? 2 : 0,
                }}
                transition={{ type: "timing", duration: 150 }}
                style={[baseStyle, style]}
                {...props}
            >
                {children}
            </MotiView>
        </MotiView>
    );

    if (onPress) {
        return (
            <TouchableOpacity
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={1}
                style={{ borderRadius: 20 }}
            >
                <CardContent />
            </TouchableOpacity>
        );
    }

    return <CardContent />;
}
