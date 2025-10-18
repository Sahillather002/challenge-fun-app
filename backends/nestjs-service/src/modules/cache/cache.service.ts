import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class CacheService implements OnModuleInit, OnModuleDestroy {
  private client: Redis;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const redisUrl = this.configService.get<string>('REDIS_URL');
    this.client = new Redis(redisUrl);
    console.log('✅ Redis connected');
  }

  async onModuleDestroy() {
    await this.client.quit();
  }

  async set(key: string, value: any, expirationSeconds = 3600): Promise<void> {
    const data = JSON.stringify(value);
    await this.client.setex(key, expirationSeconds, data);
  }

  async get<T>(key: string): Promise<T | null> {
    const data = await this.client.get(key);
    if (!data) return null;
    return JSON.parse(data) as T;
  }

  async delete(key: string): Promise<void> {
    await this.client.del(key);
  }

  async exists(key: string): Promise<boolean> {
    const result = await this.client.exists(key);
    return result === 1;
  }

  async zadd(key: string, score: number, member: string): Promise<void> {
    await this.client.zadd(key, score, member);
  }

  async zrevrangeWithScores(
    key: string,
    start: number,
    stop: number,
  ): Promise<Array<{ member: string; score: number }>> {
    const result = await this.client.zrevrange(key, start, stop, 'WITHSCORES');
    const entries: Array<{ member: string; score: number }> = [];

    for (let i = 0; i < result.length; i += 2) {
      entries.push({
        member: result[i],
        score: parseFloat(result[i + 1]),
      });
    }

    return entries;
  }

  async zrevrank(key: string, member: string): Promise<number | null> {
    const rank = await this.client.zrevrank(key, member);
    return rank;
  }

  async zscore(key: string, member: string): Promise<number | null> {
    const score = await this.client.zscore(key, member);
    return score ? parseFloat(score) : null;
  }

  async zcard(key: string): Promise<number> {
    const count = await this.client.zcard(key);
    return count;
  }

  async publish(channel: string, message: any): Promise<void> {
    const data = JSON.stringify(message);
    await this.client.publish(channel, data);
  }

  async subscribe(
    channel: string,
    callback: (message: any) => void,
  ): Promise<void> {
    const subscriber = new Redis(this.configService.get<string>('REDIS_URL'));
    await subscriber.subscribe(channel);
    subscriber.on('message', (ch, msg) => {
      if (ch === channel) {
        try {
          const parsed = JSON.parse(msg);
          callback(parsed);
        } catch (e) {
          console.error('Error parsing message:', e);
        }
      }
    });
  }
}
