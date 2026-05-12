import React from 'react';
import { useReducedMotion, shouldAnimate } from '@/hooks/useReducedMotion';

interface AccessibleAnimationProps {
  children: (canAnimate: boolean) => React.ReactNode;
  forceAnimation?: boolean;
}

export function AccessibleAnimation({ 
  children, 
  forceAnimation = false 
}: AccessibleAnimationProps) {
  const reducedMotion = useReducedMotion();
  const canAnimate = shouldAnimate(reducedMotion, forceAnimation);

  return <>{children(canAnimate)}</>;
}

interface AnimatedWrapperProps {
  children: React.ReactNode;
  animate?: boolean;
  forceAnimation?: boolean;
}

export function AnimatedWrapper({
  children,
  animate = true,
  forceAnimation = false,
}: AnimatedWrapperProps) {
  const reducedMotion = useReducedMotion();
  const shouldAnimate = animate && (!reducedMotion || forceAnimation);

  if (!shouldAnimate) {
    return <>{children}</>;
  }

  return <>{children}</>;
}
