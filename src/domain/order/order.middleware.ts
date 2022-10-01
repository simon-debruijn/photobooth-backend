import { NextFunction, Request, Response } from 'express';
import { Unauthorized } from 'http-errors';

import { prismaClient } from '../../database/prisma.client';

export const isOrderIdFromUserIdMiddleware = async (
  req: Request & { userId: number },
  res: Response,
  next: NextFunction,
) => {
  const userId = req.userId;
  const orderId = req.params.orderId;

  const order = await prismaClient.order.findUnique({
    where: {
      id: parseInt(orderId),
    },
  });

  if (order && order.user_id === userId) {
    next();
    return;
  }

  throw new Unauthorized('You have no access to this order');
};
