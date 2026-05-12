import { useState, useRef, useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
} from 'react-native-reanimated';

// Hook for managing animation state
export const useAnimationState = (initialState: any = {}) => {
  const [state, setState] = useState(initialState);
  const animatedValues = Object.keys(initialState).reduce((acc, key) => {
    acc[key] = useSharedValue(initialState[key]);
    return acc;
  }, {} as any);

  const updateState = (newState: any) => {
    setState(newState);
    Object.entries(newState).forEach(([key, value]) => {
      if (animatedValues[key] !== undefined) {
        animatedValues[key].value = value;
      }
    });
  };

  const getAnimatedStyle = () => {
    return useAnimatedStyle(() => {
      const style: any = {};
      Object.entries(animatedValues).forEach(([key, value]) => {
        style[key] = value.value;
      });
      return style;
    });
  };

  return { state, updateState, getAnimatedStyle };
};

// Hook for animated counter
export const useCounterAnimation = (start: number, end: number, duration: number = 1000) => {
  const [count, setCount] = useState(start);
  const animatedValue = useSharedValue(start);

  useEffect(() => {
    const increment = (end - start) / (duration / 16);
    let currentValue = start;

    const timer = setInterval(() => {
      currentValue += increment;
      if ((increment > 0 && currentValue >= end) || (increment < 0 && currentValue <= end)) {
        setCount(end);
        animatedValue.value = withSpring(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(currentValue));
        animatedValue.value = Math.floor(currentValue);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [end, start, duration]);

  return count;
};

// Hook for scroll-based animations
export const useScrollAnimation = (scrollY: any, config: any = {}) => {
  const { start = 0, end = 100, output = [0, 1] } = config;
  
  const animatedValue = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            [start, end],
            output
          ),
        },
      ],
    };
  });

  return animatedValue;
};

// Hook for spring animation with damping and stiffness
export const useSpringAnimation = (value: number, config: any = {}) => {
  const { stiffness = 100, damping = 20, mass = 1 } = config;
  const animatedValue = useSharedValue(value);

  const animate = (toValue: number) => {
    animatedValue.value = withSpring(toValue, { stiffness, damping, mass });
  };

  const getAnimatedStyle = () => {
    return useAnimatedStyle(() => ({
      transform: [{ scale: animatedValue.value }],
    }));
  };

  return { value: animatedValue.value, animate, getAnimatedStyle };
};

// Hook for timing animation
export const useTimingAnimation = (value: number, config: any = {}) => {
  const { duration = 500 } = config;
  const animatedValue = useSharedValue(value);

  const animate = (toValue: number) => {
    animatedValue.value = withTiming(toValue, { duration });
  };

  const getAnimatedStyle = () => {
    return useAnimatedStyle(() => ({
      opacity: animatedValue.value,
    }));
  };

  return { value: animatedValue.value, animate, getAnimatedStyle };
};

// Hook for handling press interaction
export const usePressAnimation = () => {
  const [isPressed, setIsPressed] = useState(false);
  
  const handlePressIn = () => setIsPressed(true);
  const handlePressOut = () => setIsPressed(false);

  return {
    isPressed,
    onPressIn: handlePressIn,
    onPressOut: handlePressOut,
  };
};
