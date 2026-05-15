import Redis from 'ioredis';
import { env } from '../config/env.config';
import { logger } from './logger.util';

let redisClient: Redis | null = null;

if (env.REDIS_URL) {
  redisClient = new Redis(env.REDIS_URL, {
    maxRetriesPerRequest: 3,
  });

  redisClient.on('error', (err) => {
    logger.error('Redis Client Error', err);
  });

  redisClient.on('connect', () => {
    logger.info('Redis Client Connected');
  });
} else {
  logger.warn('REDIS_URL not provided. Redis client will not be initialized.');
}

export const redis = redisClient;

// Simple cache wrapper
export const cache = {
  get: async (key: string): Promise<any | null> => {
    if (!redis) return null;
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  },
  set: async (key: string, value: any, ttlSeconds?: number): Promise<void> => {
    if (!redis) return;
    const stringValue = JSON.stringify(value);
    if (ttlSeconds) {
      await redis.setex(key, ttlSeconds, stringValue);
    } else {
      await redis.set(key, stringValue);
    }
  },
  del: async (key: string): Promise<void> => {
    if (!redis) return;
    await redis.del(key);
  },
};
