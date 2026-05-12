import React, { useEffect, useRef } from "react";
import { View, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";

interface ConfettiAnimationProps {
  visible: boolean;
  onAnimationEnd?: () => void;
  style?: any;
}

export function ConfettiAnimation({
  visible,
  onAnimationEnd,
  style,
}: ConfettiAnimationProps) {
  const animationRef = useRef<LottieView>(null);

  useEffect(() => {
    if (visible && animationRef.current) {
      animationRef.current.play();
    }
  }, [visible]);

  const handleAnimationFinish = () => {
    if (onAnimationEnd) {
      onAnimationEnd();
    }
  };

  if (!visible) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <LottieView
        ref={animationRef}
        source={require("../../../assets/confetti.json")}
        autoPlay={false}
        loop={false}
        onAnimationFinish={handleAnimationFinish}
        style={styles.animation}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "flex-start",
    alignItems: "center",
    pointerEvents: "none",
    zIndex: 1000,
  },
  animation: {
    width: "100%",
    height: "100%",
  },
});
