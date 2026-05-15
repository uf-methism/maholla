import { Request, Response } from 'express';
import prisma from '../config/prismaClient.config';
import { redis } from '../utils/redis.util';

export const getHealthStatus = async (_req: Request, res: Response) => {
  const healthCheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now(),
    services: {
      database: 'down',
      redis: 'down',
    },
  };

  try {
    // Check DB
    await prisma.$queryRaw`SELECT 1`;
    healthCheck.services.database = 'up';

    // Check Redis
    if (redis && redis.status === 'ready') {
      healthCheck.services.redis = 'up';
    } else {
      healthCheck.services.redis = 'disconnected or not configured';
    }

    res.status(200).json(healthCheck);
  } catch (error) {
    healthCheck.message = 'Service Unavailable';
    res.status(503).json(healthCheck);
  }
};
