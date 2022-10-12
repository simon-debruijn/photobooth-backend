import { RequestHandler } from 'express';
import { Unauthorized } from 'http-errors';

import * as tokenProvider from '../token/token.provider';

export const isUserAuthenticated: RequestHandler = async (req, res, next) => {
  try {
    const tokenWithPrefix = req.headers['authorization'];

    const token = tokenWithPrefix?.split('Bearer ')?.[1];

    if (!token) {
      throw new Error();
    }

    const { id } = (await tokenProvider.verify(token)) ?? {};

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
