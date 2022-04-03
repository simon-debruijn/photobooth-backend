import { createOrderService } from './order.service';
import { prismaClient } from '../../database/prisma.client';
import { RequestHandler } from 'express';
import { orderModel } from '../../database/prisma/zod';
import { NotFound, BadRequest } from 'http-errors';
import Hashids from 'hashids';
import { HASH_ID_SALT } from '@/constants';

const hashids = new Hashids(HASH_ID_SALT, 8);

const orderService = createOrderService({ prismaClient, hashids });

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

export const getOrdersForCustomerId: RequestHandler = async (req, res) => {
  const { customerId } = req.params;

  const orders = await orderService.getOrdersForCustomerId(parseInt(customerId));

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

  res.send({
    data: order,
  });
};
