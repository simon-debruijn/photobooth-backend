import { ErrorRequestHandler } from 'express';
import { HttpError } from 'http-errors';

import { withContext } from '@/context/withContext';

export const handleExceptions = withContext<ErrorRequestHandler>(
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
    },
);
