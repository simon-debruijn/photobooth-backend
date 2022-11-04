import { ErrorRequestHandler } from 'express';

import { logger, Logger } from '@/logger/logger';

type Dependencies = {
  logger: Logger;
};

export const createErrorHandler: (dependencies: Dependencies) => ErrorRequestHandler =
  ({ logger }) =>
  (err, req, res, _next) => {
    const { name, message, stack } = err;

    logger.error({ name, message, stack });

    res.status(500).send('Internal Server Error');
  };

export const handleErrors = createErrorHandler({ logger });
