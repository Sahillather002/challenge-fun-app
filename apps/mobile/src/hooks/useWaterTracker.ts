import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface WaterEntry {
  date: string;
  amount: number;
}

const WATER_STORAGE_KEY = 'water_intake_data';
const DAILY_GOAL_KEY = 'water_daily_goal';

export const useWaterTracker = () => {
  const [waterData, setWaterData] = useState<Record<string, WaterEntry>>({});
  const [dailyGoal, setDailyGoal] = useState(2000);

  useEffect(() => {
    loadWaterData();
    loadDailyGoal();
  }, []);

  const loadWaterData = async () => {
    try {
      const data = await AsyncStorage.getItem(WATER_STORAGE_KEY);
      if (data) {
        setWaterData(JSON.parse(data));
      }
    } catch (error) {
      console.error('Error loading water data:', error);
    }
  };

  const loadDailyGoal = async () => {
    try {
      const goal = await AsyncStorage.getItem(DAILY_GOAL_KEY);
      if (goal) {
        setDailyGoal(parseInt(goal, 10));
      }
    } catch (error) {
      console.error('Error loading daily goal:', error);
    }
  };

  const saveWaterData = async (data: Record<string, WaterEntry>) => {
    try {
      await AsyncStorage.setItem(WATER_STORAGE_KEY, JSON.stringify(data));
      setWaterData(data);
    } catch (error) {
      console.error('Error saving water data:', error);
    }
  };

  const saveDailyGoal = async (goal: number) => {
    try {
      await AsyncStorage.setItem(DAILY_GOAL_KEY, goal.toString());
      setDailyGoal(goal);
    } catch (error) {
      console.error('Error saving daily goal:', error);
    }
  };

  const addWater = async (amount: number) => {
    const today = new Date().toISOString().split('T')[0];
    const newData = {
      ...waterData,
      [today]: {
        date: today,
        amount: (waterData[today]?.amount || 0) + amount,
      },
    };
    await saveWaterData(newData);
  };

  const getTodayIntake = (): number => {
    const today = new Date().toISOString().split('T')[0];
    return waterData[today]?.amount || 0;
  };

  const getWeekData = (): number[] => {
    const weekData: number[] = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      weekData.push(waterData[dateStr]?.amount || 0);
    }
    return weekData;
  };

  const getProgress = (): number => {
    return Math.min(getTodayIntake() / dailyGoal, 1);
  };

  const resetToday = async () => {
    const today = new Date().toISOString().split('T')[0];
    const newData = { ...waterData };
    delete newData[today];
    await saveWaterData(newData);
  };

  return {
    todayIntake: getTodayIntake(),
    dailyGoal,
    setDailyGoal: saveDailyGoal,
    addWater,
    getWeekData,
    getProgress,
    resetToday,
    waterData,
  };
};