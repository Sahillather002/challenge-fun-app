import { MotiAnimationProp } from 'moti';

// Standard animation durations
export const ANIMATION_DURATIONS = {
  fast: 200,
  normal: 300,
  slow: 500,
  verySlow: 800,
};

// Standard animation stiffness values
export const ANIMATION_STIFFNESS = {
  soft: 100,
  normal: 300,
  stiff: 500,
};

// Standard animation damping values
export const ANIMATION_DAMPING = {
  bouncy: 10,
  normal: 25,
  stiff: 40,
};

// Fade animations
export const fadeIn: MotiAnimationProp<{ opacity: number }> = {
  animate: { opacity: 1 },
  transition: { type: 'spring', stiffness: ANIMATION_STIFFNESS.normal, damping: ANIMATION_DAMPING.normal },
};

export const fadeOut: MotiAnimationProp<{ opacity: number }> = {
  animate: { opacity: 0 },
  transition: { type: 'spring', stiffness: ANIMATION_STIFFNESS.normal, damping: ANIMATION_DAMPING.normal },
};

// Slide animations
export const slideInFromBottom: MotiAnimationProp<{ y: number; opacity: number }> = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: { type: 'spring', stiffness: ANIMATION_STIFFNESS.normal, damping: ANIMATION_DAMPING.normal },
};

export const slideInFromTop: MotiAnimationProp<{ y: number; opacity: number }> = {
  initial: { y: -20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: { type: 'spring', stiffness: ANIMATION_STIFFNESS.normal, damping: ANIMATION_DAMPING.normal },
};

export const slideInFromLeft: MotiAnimationProp<{ x: number; opacity: number }> = {
  initial: { x: -20, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  transition: { type: 'spring', stiffness: ANIMATION_STIFFNESS.normal, damping: ANIMATION_DAMPING.normal },
};

export const slideInFromRight: MotiAnimationProp<{ x: number; opacity: number }> = {
  initial: { x: 20, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  transition: { type: 'spring', stiffness: ANIMATION_STIFFNESS.normal, damping: ANIMATION_DAMPING.normal },
};

// Scale animations
export const scaleIn: MotiAnimationProp<{ scale: number; opacity: number }> = {
  initial: { scale: 0.95, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: { type: 'spring', stiffness: ANIMATION_STIFFNESS.normal, damping: ANIMATION_DAMPING.normal },
};

export const scaleOut: MotiAnimationProp<{ scale: number; opacity: number }> = {
  initial: { scale: 1, opacity: 1 },
  animate: { scale: 0.95, opacity: 0 },
  transition: { type: 'spring', stiffness: ANIMATION_STIFFNESS.normal, damping: ANIMATION_DAMPING.normal },
};

// Bounce animations
export const bounceIn: MotiAnimationProp<{ scale: number; opacity: number }> = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: { type: 'spring', stiffness: ANIMATION_STIFFNESS.soft, damping: ANIMATION_DAMPING.bouncy },
};

// Press animations
export const pressEffect: MotiAnimationProp<{ scale: number }> = {
  animate: { scale: 0.95 },
  transition: { type: 'spring', stiffness: ANIMATION_STIFFNESS.stiff, damping: ANIMATION_DAMPING.stiff },
};

// Pulse animations
export const pulse: MotiAnimationProp<{ scale: number }> = {
  animate: { scale: [1, 1.05, 1] },
  transition: { duration: 1000, repeat: Infinity, type: 'timing' },
};

// Shake animation
export const shake: MotiAnimationProp<{ x: number }> = {
  animate: { x: [0, -10, 10, -10, 10, 0] },
  transition: { duration: 500, type: 'timing' },
};
