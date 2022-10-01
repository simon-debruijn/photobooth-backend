import { ErrorRequestHandler } from 'express';

import { logger } from '@/logger/logger';

export const handleErrors: ErrorRequestHandler = (err, req, res, _next) => {
  const { name, message, stack } = err;

  logger.error({ name, message, stack });

  res.status(500).send('Internal Server Error');
};
