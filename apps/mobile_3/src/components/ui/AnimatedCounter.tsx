import React, { useEffect } from 'react';
import { Text } from 'react-native';
import { MotiText } from 'moti';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  format?: (val: number) => string;
  style?: any;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 1000,
  format = (val) => val.toString(),
  style,
}) => {
  const [displayValue, setDisplayValue] = React.useState(0);

  useEffect(() => {
    let start = displayValue;
    const end = value;
    const startTime = Date.now();
    
    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuad = (t: number) => t * (2 - t);
      const easedProgress = easeOutQuad(progress);
      
      const currentValue = start + (end - start) * easedProgress;
      setDisplayValue(currentValue);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    animate();
  }, [value, duration]);

  return (
    <MotiText
      style={style}
      from={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        type: 'timing',
        duration: 300,
      }}
    >
      {format(Math.round(displayValue))}
    </MotiText>
  );
};
