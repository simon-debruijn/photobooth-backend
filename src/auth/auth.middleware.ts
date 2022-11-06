import { RequestHandler } from 'express';
import { Unauthorized } from 'http-errors';

import { tokenProvider } from '../token/token.provider';
import { getTokenFromRequest } from './getJwtFromRequest';

export const isUserAuthenticated: RequestHandler = async (req, res, next) => {
  try {
    const token = getTokenFromRequest(req);

    if (!token) {
      throw new Unauthorized('Invalid token');
    }

    const { id } = (await tokenProvider.verify(token)) ?? {};

    if (!id) {
      new Unauthorized('Invalid token');
    }

    // @ts-expect-error
    req.userId = id;

    next();
  } catch {
    next(new Unauthorized('Invalid token'));
  }
};
