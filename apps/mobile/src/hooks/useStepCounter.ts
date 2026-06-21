import { useEffect, useState } from 'react';
import { Pedometer } from 'expo-sensors';
import { Platform } from 'react-native';
import { syncService } from '../services/syncService';

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
    syncService.init();
  }, []);

  useEffect(() => {
    if (!stepData.isAvailable) return;

    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

    const subscription = Pedometer.watchStepCount(result => {
      const nextSteps = result.steps;
      setStepData(prev => ({ ...prev, today: nextSteps }));
      const now = new Date();
      const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      syncService.enqueueSteps(date, nextSteps, Platform.OS);
    });

    Pedometer.getStepCountAsync(startOfDay, endOfDay).then(result => {
      const nextSteps = result.steps;
      setStepData(prev => ({ ...prev, today: nextSteps }));
      const now = new Date();
      const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      syncService.enqueueSteps(date, nextSteps, Platform.OS);
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