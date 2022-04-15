import { ErrorRequestHandler } from 'express';
import { Logger } from 'pino';

type Dependencies = {
  logger: Logger;
};

export const createErrorHandler =
  ({ logger }: Dependencies): ErrorRequestHandler =>
  (err, req, res, _next) => {
    const { name, message, stack } = err;

    logger.error({ name, message, stack });

    res.status(500).send('Internal Server Error');
  };
