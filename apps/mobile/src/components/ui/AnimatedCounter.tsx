import React, { useEffect, useState } from "react";
import { MotiText } from "moti";

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  format?: (value: number) => string;
  style?: any;
  delay?: number;
}

export function AnimatedCounter({
  value,
  duration = 1000,
  format,
  style,
  delay = 0,
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = value / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value, duration]);

  return (
    <MotiText
      from={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        type: "spring", 
        stiffness: 200, 
        damping: 20, 
        delay 
      }}
      style={style}
    >
      {format ? format(count) : count}
    </MotiText>
  );
}
