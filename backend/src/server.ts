import app from './app';
import { env } from './config/env.config';
import { logger } from './utils/logger.util';
import prisma from './config/prismaClient';
import { redis } from './utils/redis.util';

const startServer = async () => {
  try {
    // Attempt DB connection to ensure it's up before accepting requests
    await prisma.$connect();
    logger.info('Database Connected successfully');

    const server = app.listen(env.PORT, () => {
      logger.info(`Server is running on port ${env.PORT} in ${env.NODE_ENV} mode`);
    });

    // Graceful Shutdown Setup
    const exitHandler = () => {
      if (server) {
        server.close(async () => {
          logger.info('Server closed');
          await prisma.$disconnect();
          if (redis) {
            redis.disconnect();
          }
          process.exit(1);
        });
      } else {
        process.exit(1);
      }
    };

    const unexpectedErrorHandler = (error: Error) => {
      logger.error('Unexpected error:', error);
      exitHandler();
    };

    process.on('uncaughtException', unexpectedErrorHandler);
    process.on('unhandledRejection', unexpectedErrorHandler);

    process.on('SIGTERM', () => {
      logger.info('SIGTERM received');
      if (server) {
        server.close();
      }
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
