import pino from 'pino';
import { env } from '../config/env.js';

const isDev = process.env.NODE_ENV !== 'production';

export const logger = pino({
  level: env.logLevel,
  ...(isDev && {
    transport: {
      target: 'pino-pretty',
      options: { colorize: true, translateTime: 'SYS:standard' },
    },
  }),
});
