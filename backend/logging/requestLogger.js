import { randomUUID } from 'crypto';
import { logger } from './logger.js';

export function requestLogger(req, res, next) {
  const requestId = randomUUID();
  req.requestId = requestId;
  req.log = logger.child({ requestId });

  const start = Date.now();
  req.log.info({
    event: 'request_start',
    method: req.method,
    path: req.path,
  });

  res.on('finish', () => {
    req.log.info({
      event: 'request_finish',
      statusCode: res.statusCode,
      durationMs: Date.now() - start,
    });
  });

  next();
}
