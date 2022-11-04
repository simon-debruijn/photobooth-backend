import { ErrorRequestHandler } from 'express';
import { HttpError } from 'http-errors';

import { Logger, logger } from '@/logger/logger';

// : ErrorRequestHandler

type Dependencies = {
  logger: Logger;
};

const createExceptionHandler: (dependencies: Dependencies) => ErrorRequestHandler =
  ({ logger }) =>
  (err, req, res, next) => {
    if (err instanceof HttpError) {
      const { status, name, message, stack } = err;

      logger.debug({ status, name, message, stack });

      return res.status(status).send({
        status,
        name,
        message,
      });
    }

    next(err);
  };

export const __TESTS__ = {
  createExceptionHandler,
};

export const handleExceptions = createExceptionHandler({ logger });
