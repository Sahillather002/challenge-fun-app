import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Play, Pause, RotateCcw, Timer } from 'lucide-react-native';
import { useTheme } from '@/theme/useTheme';
import { ThemedText } from '@/components/ui/ThemedText';
import { PremiumCard } from '@/components/ui/PremiumCard';

interface WorkoutTimerProps {
  onComplete?: (duration: number) => void;
  initialMinutes?: number;
}

export function WorkoutTimer({ onComplete, initialMinutes = 0 }: WorkoutTimerProps) {
  const [seconds, setSeconds] = useState(initialMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isRest, setIsRest] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const theme = useTheme();

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            if (onComplete) onComplete(seconds);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartStop = () => setIsRunning(!isRunning);

  const handleReset = () => {
    setIsRunning(false);
    setSeconds(initialMinutes * 60);
    setIsRest(false);
  };

  const handleRest = () => {
    setIsRest(true);
    setSeconds(30);
    setIsRunning(true);
  };

  return (
    <PremiumCard glass={true} style={{ marginBottom: 24, alignItems: 'center' }}>
      <View style={{ alignItems: 'center', marginBottom: 20 }}>
        <Timer size={48} color={theme.primary} />
        <ThemedText style={{ fontSize: 48, fontFamily: 'Outfit_700Bold', marginTop: 16 }}>
          {formatTime(seconds)}
        </ThemedText>
        {isRest && (
          <ThemedText style={{ fontSize: 14, color: theme.danger, marginTop: 8 }}>
            Rest Time
          </ThemedText>
        )}
      </View>

      <View style={{ flexDirection: 'row', gap: 12 }}>
        <TouchableOpacity onPress={handleStartStop}>
          <LinearGradient
            colors={isRunning ? [theme.danger, '#FF006E'] : [theme.primary, theme.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center' }}
          >
            {isRunning ? (
              <Pause size={24} color="#fff" />
            ) : (
              <Play size={24} color="#fff" />
            )}
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleReset}>
          <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: theme.card, justifyContent: 'center', alignItems: 'center' }}>
            <RotateCcw size={24} color={theme.text} />
          </View>
        </TouchableOpacity>

        {!isRest && (
          <TouchableOpacity onPress={handleRest}>
            <LinearGradient
              colors={['#FF6B35', '#FF006E']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ paddingHorizontal: 20, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center' }}
            >
              <ThemedText style={{ color: '#fff', fontWeight: 'bold' }}>Rest</ThemedText>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>
    </PremiumCard>
  );
}