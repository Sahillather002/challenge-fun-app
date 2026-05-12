import React from 'react';
import { MotiView } from 'moti';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface PageTransitionProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade';
  duration?: number;
  delay?: number;
  forceAnimation?: boolean;
}

export function PageTransition({ 
  children, 
  direction = 'fade', 
  duration = 500, 
  delay = 0,
  forceAnimation = false,
}: PageTransitionProps) {
  const reducedMotion = useReducedMotion();
  const shouldAnimate = !reducedMotion || forceAnimation;

  // Base configurations for different transition directions
  const transitions = {
    fade: {
      from: { opacity: 0 },
      animate: { opacity: 1 },
    },
    up: {
      from: { opacity: 0, translateY: 20 },
      animate: { opacity: 1, translateY: 0 },
    },
    down: {
      from: { opacity: 0, translateY: -20 },
      animate: { opacity: 1, translateY: 0 },
    },
    left: {
      from: { opacity: 0, translateX: 20 },
      animate: { opacity: 1, translateX: 0 },
    },
    right: {
      from: { opacity: 0, translateX: -20 },
      animate: { opacity: 1, translateX: 0 },
    },
  };

  const config = transitions[direction];

  if (!shouldAnimate) {
    return <>{children}</>;
  }

  return (
    <MotiView
      from={config.from}
      animate={config.animate}
      transition={{ 
        duration, 
        delay, 
        type: 'timing',
      }}
    >
      {children}
    </MotiView>
  );
}

export function StaggeredTransition({ 
  children, 
  duration = 300, 
  delay = 0, 
  stagger = 100,
  forceAnimation = false,
}: { 
  children: React.ReactNode[]; 
  duration?: number; 
  delay?: number;
  stagger?: number;
  forceAnimation?: boolean;
}) {
  const reducedMotion = useReducedMotion();
  const shouldAnimate = !reducedMotion || forceAnimation;

  if (!shouldAnimate) {
    return <>{children}</>;
  }

  return (
    <>
      {children.map((child, index) => (
        <MotiView
          key={index}
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{
            duration,
            delay: delay + index * stagger,
            type: 'timing',
          }}
        >
          {child}
        </MotiView>
      ))}
    </>
  );
}
