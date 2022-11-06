import { Request } from 'express';

export function getTokenFromRequest(req: Request) {
  const tokenWithPrefix = req.headers.authorization;

  const token = tokenWithPrefix?.split('Bearer ')?.[1];
  const tokenInQuery = req.query.token as string | undefined;

  return token || tokenInQuery;
}
