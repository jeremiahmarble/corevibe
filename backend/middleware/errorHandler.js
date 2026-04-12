import { logger } from '../logging/logger.js';

export function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    next(err);
    return;
  }

  const log = req.log || logger;
  log.error({
    event: 'error',
    err: { message: err.message, name: err.name },
  });

  const status = err.statusCode && Number.isInteger(err.statusCode) ? err.statusCode : 500;
  const body = {
    error: status === 500 ? 'Internal Server Error' : err.message,
    ...(req.requestId && { requestId: req.requestId }),
  };

  res.status(status).json(body);
}
