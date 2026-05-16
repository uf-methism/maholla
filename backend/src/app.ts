import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { env } from './config/env.config';
import { errorHandler } from './middlewares/error.middleware';
import { requestLogger } from './middlewares/logger.middleware';
import { apiLimiter } from './middlewares/rateLimiter.middleware';
import appRouter from './routes/index';
import { AppError } from './utils/appError.util';

const app: Application = express();

// Security Middlewares
app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN === '*' ? '*' : env.CORS_ORIGIN.split(','),
    credentials: true,
  })
);

// General Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());

// Logging Middleware
app.use(requestLogger);

// Apply Rate Limiting
app.use('/api', apiLimiter);

// API Routes
app.use('/api/v1', appRouter);

// 404 Handler — Express 5 requires named wildcards
app.use('{*path}', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handler
app.use(errorHandler);

export default app;
