import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { MotiView } from 'moti';
import { useTheme } from '@/theme/useTheme';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const { width, height } = Dimensions.get('window');

interface AnimatedBackgroundProps {
  children: React.ReactNode;
  style?: any;
}

export function AnimatedBackground({ children, style }: AnimatedBackgroundProps) {
  const theme = useTheme();
  const reducedMotion = useReducedMotion();

  return (
    <View style={[styles.container, style]}>
      {/* Animated gradient orbs */}
      {!reducedMotion && (
        <>
          <MotiView
            from={{ 
              opacity: 0.1, 
              scale: 1, 
              transform: [{ translateX: -100 }, { translateY: -100 }]
            }}
            animate={{ 
              opacity: [0.1, 0.2, 0.1], 
              scale: [1, 1.2, 1], 
              transform: [
                { translateX: [-100, -50, -100] }, 
                { translateY: [-100, -80, -100] }
              ]
            }}
            transition={{ 
              duration: 8000, 
              repeat: Infinity
            }}
            style={[
              styles.orb,
              {
                backgroundColor: theme.primary,
                left: '10%',
                top: '10%',
              },
            ]}
          />

          <MotiView
            from={{ 
              opacity: 0.15, 
              scale: 1, 
              transform: [{ translateX: width - 100 }, { translateY: height - 100 }]
            }}
            animate={{ 
              opacity: [0.15, 0.25, 0.15], 
              scale: [1, 1.3, 1], 
              transform: [
                { translateX: [width - 100, width - 50, width - 100] }, 
                { translateY: [height - 100, height - 80, height - 100] }
              ]
            }}
            transition={{ 
              duration: 10000, 
              repeat: Infinity
            }}
            style={[
              styles.orb,
              {
                backgroundColor: theme.secondary,
                right: '10%',
                bottom: '10%',
              },
            ]}
          />

          <MotiView
            from={{ 
              opacity: 0.12, 
              scale: 1, 
              transform: [{ translateX: width / 2 - 50 }, { translateY: height / 2 - 50 }]
            }}
            animate={{ 
              opacity: [0.12, 0.2, 0.12], 
              scale: [1, 1.15, 1], 
              transform: [
                { translateX: [width / 2 - 50, width / 2 - 30, width / 2 - 50] }, 
                { translateY: [height / 2 - 50, height / 2 - 40, height / 2 - 50] }
              ]
            }}
            transition={{ 
              duration: 6000, 
              repeat: Infinity
            }}
            style={[
              styles.orb,
              {
                backgroundColor: theme.danger,
                left: '50%',
                top: '50%',
              },
            ]}
          />

          {/* Floating particles */}
          {[...Array(8)].map((_, index) => (
            <MotiView
              key={index}
              from={{ 
                opacity: 0, 
                scale: 0, 
                transform: [
                  { translateX: Math.random() * width }, 
                  { translateY: height + 50 }
                ]
              }}
              animate={{ 
                opacity: [0, 0.3, 0], 
                scale: [0, 1, 0], 
                transform: [
                  { translateY: [height + 50, -50, -50] }
                ]
              }}
              transition={{ 
                duration: 4000 + index * 1000, 
                repeat: Infinity,
                delay: index * 500,
              }}
              style={[
                styles.particle,
                {
                  left: `${Math.random() * 100}%`,
                  backgroundColor: index % 2 === 0 ? theme.primary : theme.secondary,
                  width: 4 + index,
                  height: 4 + index,
                },
              ]}
            />
          ))}
        </>
      )}

      {/* Main content */}
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  orb: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    opacity: 0.1,
  },
  particle: {
    position: 'absolute',
    borderRadius: '50%',
  },
  content: {
    flex: 1,
    position: 'relative',
    zIndex: 1,
  },
});
