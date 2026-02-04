import React from "react";
import {
  TouchableOpacity,
  TouchableOpacityProps,
  Text,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import { useTheme } from "@/theme/useTheme";
import * as Haptics from "expo-haptics";

interface ThemedButtonProps extends TouchableOpacityProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  haptic?: "light" | "medium" | "heavy" | "success" | "warning" | "error";
}

export function ThemedButton({
  children,
  variant = "primary",
  size = "md",
  style,
  textStyle,
  haptic = "light",
  onPress,
  ...props
}: ThemedButtonProps) {
  const theme = useTheme();

  const handlePress = (event: any) => {
    // Trigger haptic feedback
    switch (haptic) {
      case "light":
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case "medium":
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case "heavy":
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        break;
      case "success":
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;
      case "warning":
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        break;
      case "error":
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        break;
    }

    if (onPress) {
      onPress(event);
    }
  };

  const getButtonStyle = (): StyleProp<ViewStyle> => {
    const baseStyle: ViewStyle = {
      borderRadius: size === "sm" ? 12 : size === "md" ? 16 : 20,
      paddingHorizontal: size === "sm" ? 16 : size === "md" ? 24 : 32,
      paddingVertical: size === "sm" ? 10 : size === "md" ? 14 : 18,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      gap: 8,
    };

    switch (variant) {
      case "primary":
        return [
          baseStyle,
          {
            backgroundColor: theme.primary,
            shadowColor: theme.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          },
        ];
      case "secondary":
        return [
          baseStyle,
          {
            backgroundColor: theme.secondary,
            shadowColor: theme.secondary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          },
        ];
      case "danger":
        return [
          baseStyle,
          {
            backgroundColor: theme.danger,
            shadowColor: theme.danger,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          },
        ];
      case "ghost":
        return [
          baseStyle,
          {
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            borderWidth: 1,
            borderColor: "rgba(255, 255, 255, 0.2)",
          },
        ];
      default:
        return baseStyle;
    }
  };

  const getTextStyle = (): StyleProp<TextStyle> => {
    const baseTextStyle: TextStyle = {
      fontSize: size === "sm" ? 14 : size === "md" ? 16 : 18,
      fontWeight: "600",
      textAlign: "center",
    };

    if (variant === "ghost") {
      return [baseTextStyle, { color: theme.text }];
    }

    return [baseTextStyle, { color: "#000" }];
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={handlePress}
      activeOpacity={0.7}
      {...props}
    >
      <Text style={[getTextStyle(), textStyle]}>{children}</Text>
    </TouchableOpacity>
  );
}
