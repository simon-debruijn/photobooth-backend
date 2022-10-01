import { RequestHandler } from 'express';
import Hashids from 'hashids';
import { BadRequest, NotFound } from 'http-errors';

import { HASH_ID_SALT } from '@/constants';

import { prismaClient } from '../../database/prisma.client';
import { orderModel } from '../../database/prisma/zod';
import { createOrderService } from './order.service';

const hashids = new Hashids(HASH_ID_SALT, 8);

export const orderService = createOrderService({ prismaClient, hashids });

export const getOrders: RequestHandler = async (req, res) => {
  const orders = await orderService.getOrders();

  res.send({
    data: orders,
    count: orders.length,
  });
};

export const getOrderById: RequestHandler = async (req, res) => {
  const { id } = req.params;

  const order = await orderService.getOrderById(id);

  if (!order) {
    throw new NotFound('Order not found');
  }

  res.send({
    data: order,
  });
};

export const getOrdersForUserId: RequestHandler = async (req, res) => {
  const { userId } = req.params;

  const orders = await orderService.getOrdersForUserId(parseInt(userId));

  res.send({
    data: orders,
    count: orders.length,
  });
};

export const addOrder: RequestHandler = async (req, res) => {
  const addOrderInput = req.body;

  const newOrder = await orderModel.parseAsync(addOrderInput).catch((e) => {
    throw new BadRequest('Invalid order input data');
  });

  const order = await orderService.addOrder(newOrder);

  res.status(201).send({
    data: order,
  });
};
