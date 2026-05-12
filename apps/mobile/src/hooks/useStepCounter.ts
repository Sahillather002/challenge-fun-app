import { useEffect, useState } from 'react';
import { Pedometer } from 'expo-sensors';
import { Platform } from 'react-native';

interface StepData {
  today: number;
  week: number[];
  isAvailable: boolean;
  error: string | null;
}

export const useStepCounter = () => {
  const [stepData, setStepData] = useState<StepData>({
    today: 0,
    week: Array(7).fill(0),
    isAvailable: false,
    error: null,
  });

  useEffect(() => {
    const checkAvailability = async () => {
      const { status } = await Pedometer.getPermissionsAsync();
      const available = await Pedometer.isAvailableAsync();
      
      if (status !== 'granted') {
        const { status: newStatus } = await Pedometer.requestPermissionsAsync();
        if (newStatus !== 'granted') {
          setStepData(prev => ({ ...prev, error: 'Permission not granted' }));
          return;
        }
      }

      setStepData(prev => ({ ...prev, isAvailable: available }));
    };

    checkAvailability();
  }, []);

  useEffect(() => {
    if (!stepData.isAvailable) return;

    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

    const subscription = Pedometer.watchStepCount(result => {
      setStepData(prev => ({ ...prev, today: result.steps }));
    }, { startDate: startOfDay });

    Pedometer.getStepCountAsync(startOfDay, endOfDay).then(result => {
      setStepData(prev => ({ ...prev, today: result.steps }));
    }).catch(err => {
      console.error('Error getting step count:', err);
    });

    const weekData = [];
    const promises = [];
    for (let i = 0; i < 7; i++) {
      const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const dayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i + 1);
      promises.push(
        Pedometer.getStepCountAsync(dayStart, dayEnd).then(r => r.steps).catch(() => 0)
      );
    }

    Promise.all(promises).then(steps => {
      setStepData(prev => ({ ...prev, week: steps.reverse() }));
    });

    return () => subscription && subscription.remove && subscription.remove();
  }, [stepData.isAvailable]);

  return stepData;
};