import { NextFunction, Request, Response } from 'express';
import { Unauthorized } from 'http-errors';

import { orderService } from '@/domain/order/order.service';

import { prismaClient } from '../../database/prisma.client';

export const isOrderIdFromUserId = async (req: Request, res: Response, next: NextFunction) => {
  // @ts-expect-error
  const userId = req.userId;
  const orderId = orderService.getDecodedId(req.params.orderId);

  const order = await prismaClient.order.findUnique({
    where: {
      id: parseInt(orderId.toString()),
    },
  });

  if (order && order.user_id === userId) {
    next();
    return;
  }

  throw new Unauthorized('You have no access to this order');
};
