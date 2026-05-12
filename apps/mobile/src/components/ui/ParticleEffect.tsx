import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { MotiView } from "moti";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const { width, height } = Dimensions.get("window");

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
}

interface ParticleEffectProps {
  count?: number;
  colors?: string[];
  minSize?: number;
  maxSize?: number;
  minDuration?: number;
  maxDuration?: number;
  style?: any;
  forceAnimation?: boolean;
}

export function ParticleEffect({
  count = 20,
  colors = ["rgba(59, 130, 246, 0.5)", "rgba(16, 185, 129, 0.5)", "rgba(239, 68, 68, 0.5)"],
  minSize = 2,
  maxSize = 6,
  minDuration = 3000,
  maxDuration = 7000,
  style,
  forceAnimation = false,
}: ParticleEffectProps) {
  const reducedMotion = useReducedMotion();
  
  if (reducedMotion && !forceAnimation) {
    return null;
  }
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const particles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        id: i,
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * (maxSize - minSize) + minSize,
        duration: Math.random() * (maxDuration - minDuration) + minDuration,
        delay: Math.random() * 2000,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    particlesRef.current = particles;
  }, []);

  return (
    <View style={[styles.container, style]}>
      {particlesRef.current.map((particle) => (
        <MotiView
          key={particle.id}
          style={[
            styles.particle,
            {
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
              borderRadius: particle.size / 2,
              backgroundColor: particle.color,
            },
          ]}
          from={{
            translateY: 0,
            opacity: 0,
            scale: 0,
          }}
          animate={{
            translateY: [-50, 50, -50],
            opacity: [0, 0.5, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            type: "timing",
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
          }}
        />
      ))}
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
    pointerEvents: "none",
  },
  particle: {
    position: "absolute",
  },
});
