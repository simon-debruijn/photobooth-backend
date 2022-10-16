import { RequestHandler } from 'express';
import { Unauthorized } from 'http-errors';

import * as tokenProvider from '../token/token.provider';

export const isUserAuthenticatedMiddleware: RequestHandler = async (req, res, next) => {
  try {
    const tokenWithPrefix = req.headers['authorization'];

    const token = tokenWithPrefix?.split('Bearer ')?.[1];
    const tokenInQuery = req.query.token as string;

    if (!token && !tokenInQuery) {
      throw new Error();
    }

    const jwt = token || tokenInQuery;

    const { id } = (await tokenProvider.verify(jwt)) ?? {};

    if (!id) {
      throw new Error();
    }

    // @ts-expect-error
    req.userId = id;

    next();
  } catch {
    next(new Unauthorized('Invalid token'));
  }
};
