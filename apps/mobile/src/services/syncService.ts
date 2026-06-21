import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from './api';

const SYNC_QUEUE_KEY = 'fitbattle:sync:queue';
const LAST_STEP_SYNC_KEY = 'fitbattle:sync:lastSteps';
const LAST_WATER_SYNC_KEY = 'fitbattle:sync:lastWater';

type SyncEvent = {
  id: string;
  type: 'steps' | 'water' | 'workout';
  payload: any;
  createdAt: number;
};

class SyncService {
  private isSyncing = false;

  async init() {
    this.flush();
  }

  async enqueueSteps(date: string, steps: number, deviceId?: string) {
    const lastSync = Number(await AsyncStorage.getItem(`${LAST_STEP_SYNC_KEY}:${date}`) || 0);
    if (steps - lastSync < 500) return;

    await this.enqueue({
      id: `${date}:steps:${deviceId || 'device'}`,
      type: 'steps',
      createdAt: Date.now(),
      payload: {
        date,
        steps,
        deviceId,
        idempotencyKey: `${date}:steps:${deviceId || 'device'}`,
        source: 'mobile-pedometer',
      },
    });
    this.flush();
  }

  async enqueueWater(date: string, amount: number, deviceId?: string) {
    await this.enqueue({
      id: `${date}:water:${deviceId || 'device'}`,
      type: 'water',
      createdAt: Date.now(),
      payload: {
        date,
        amount,
        deviceId,
        idempotencyKey: `${date}:water:${deviceId || 'device'}`,
        source: 'mobile-manual',
      },
    });
    this.flush();
  }

  async enqueueWorkout(payload: any, deviceId?: string) {
    await this.enqueue({
      id: `${Date.now()}:workout:${deviceId || 'device'}`,
      type: 'workout',
      createdAt: Date.now(),
      payload: {
        ...payload,
        deviceId,
        idempotencyKey: `${Date.now()}:workout:${deviceId || 'device'}`,
        source: payload.source || 'mobile',
      },
    });
    this.flush();
  }

  private async enqueue(event: SyncEvent) {
    const queue = await this.getQueue();
    await AsyncStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify([...queue, event]));
  }

  private async getQueue(): Promise<SyncEvent[]> {
    const raw = await AsyncStorage.getItem(SYNC_QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  private async flush() {
    if (this.isSyncing) return;

    this.isSyncing = true;
    try {
      const queue = await this.getQueue();
      const remaining: SyncEvent[] = [];

      for (const event of queue) {
        try {
          if (event.type === 'steps') {
            await api.syncSteps(event.payload);
            await AsyncStorage.setItem(`${LAST_STEP_SYNC_KEY}:${event.payload.date}`, String(event.payload.steps));
          } else if (event.type === 'water') {
            await api.logWater(event.payload);
            const current = Number(await AsyncStorage.getItem(`${LAST_WATER_SYNC_KEY}:${event.payload.date}`) || 0);
            await AsyncStorage.setItem(`${LAST_WATER_SYNC_KEY}:${event.payload.date}`, String(current + event.payload.amount));
          } else if (event.type === 'workout') {
            await api.createWorkout(event.payload);
          }
        } catch (error) {
          remaining.push(event);
        }
      }

      await AsyncStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(remaining));
    } finally {
      this.isSyncing = false;
    }
  }
}

export const syncService = new SyncService();
