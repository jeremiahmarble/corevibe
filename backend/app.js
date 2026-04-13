import cors from 'cors';
import express from 'express';
import { env } from './config/env.js';
import { requestLogger } from './logging/requestLogger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { chatRouter } from './routes/chat.js';
import { healthRouter } from './routes/health.js';
import { modelsRouter } from './routes/models.js';

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: env.corsOrigin,
      credentials: true,
    }),
  );
  app.use(express.json({ limit: '1mb' }));
  app.use(requestLogger);

  app.use('/api', healthRouter);
  app.use('/api', modelsRouter);
  app.use('/api', chatRouter);

  app.use(errorHandler);

  return app;
}
