import { RequestHandler } from 'express';
import { Unauthorized } from 'http-errors';

import * as tokenProvider from '../token/token.provider';

export const isUserAuthenticated: RequestHandler = async (req, res, next) => {
  const tokenWithPrefix = req.headers['authorization'];

  const token = tokenWithPrefix?.split('Bearer ')?.[1];

  if (!token) {
    throw new Unauthorized('Invalid token');
  }

  const { id } = (await tokenProvider.decode(token)) ?? {};

  if (!id) {
    throw new Unauthorized('Invalid token');
  }

  // @ts-expect-error
  req.userId = id;

  next();
};
