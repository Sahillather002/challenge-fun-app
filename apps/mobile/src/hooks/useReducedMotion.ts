import { useColorScheme } from "react-native";
import { useEffect, useState } from "react";

export function useReducedMotion() {
  const colorScheme = useColorScheme();
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // In a real app, this would detect system accessibility settings
    // For this implementation, we'll use a simple toggle based on user preference
    // This is a simplified version for the purpose of this demo
    
    // You could implement this with an async storage or context
    // For now, we'll default to false but provide a way to toggle
    
    // Check if user has set a preference
    // For this demo, we'll just use a default
    const checkAccessibilitySettings = async () => {
      try {
        // In a real React Native app, you would use AccessibilityInfo
        // import { AccessibilityInfo } from 'react-native';
        // const isReduceMotionEnabled = await AccessibilityInfo.isReduceMotionEnabled();
        // setReducedMotion(isReduceMotionEnabled);
        
        // For web implementation, check CSS media query
        if (typeof window !== 'undefined') {
          const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
          setReducedMotion(mediaQuery.matches);
          
          const handleChange = (e: MediaQueryListEvent) => {
            setReducedMotion(e.matches);
          };
          
          mediaQuery.addEventListener('change', handleChange);
          return () => mediaQuery.removeEventListener('change', handleChange);
        }
      } catch (error) {
        console.warn('Failed to check accessibility settings:', error);
      }
    };

    checkAccessibilitySettings();
  }, []);

  return reducedMotion;
}

export function shouldAnimate(reducedMotion: boolean, forceAnimation = false) {
  return !reducedMotion || forceAnimation;
}
