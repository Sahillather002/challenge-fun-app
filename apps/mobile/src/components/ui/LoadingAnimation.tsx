import React from "react";
import { View, StyleSheet } from "react-native";
import { MotiView } from "moti";

interface LoadingAnimationProps {
  size?: number;
  color?: string;
  style?: any;
}

export function LoadingAnimation({
  size = 24,
  color = "#3b82f6",
  style,
}: LoadingAnimationProps) {
  return (
    <View style={[styles.container, style]}>
      <MotiView
        animate={{ rotate: "360deg" }}
        transition={{
          duration: 1000,
          repeat: Infinity,
          type: "timing",
        }}
        style={[
          styles.loader,
          {
            width: size,
            height: size,
            borderColor: color,
            borderWidth: size / 6,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  loader: {
    borderRadius: "50%",
    borderTopColor: "transparent",
  },
});
