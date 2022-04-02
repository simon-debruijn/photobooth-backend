import { ErrorRequestHandler } from 'express';
import { HttpError } from 'http-errors';
import { Logger } from 'pino';

type Dependencies = {
  logger: Logger;
};

export const createUncaughtExceptionHandler =
  ({ logger }: Dependencies): ErrorRequestHandler =>
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
