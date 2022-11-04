import { RequestHandler } from 'express';
import { BadRequest, NotFound } from 'http-errors';

import { orderService, OrderService } from '@/domain/order/order.service';

import { orderModel } from '../../database/prisma/zod';

type Dependencies = {
  orderService: OrderService;
};

const createOrderController = ({ orderService }: Dependencies) => {
  const getOrders: RequestHandler = async (req, res) => {
    const orders = await orderService.getOrders();

    res.send({
      data: orders,
      count: orders.length,
    });
  };

  const getOrderById: RequestHandler = async (req, res) => {
    const { id } = req.params;

    const order = await orderService.getOrderById(id);

    if (!order) {
      throw new NotFound('Order not found');
    }

    res.send({
      data: order,
    });
  };

  const getOrdersForUserId: RequestHandler = async (req, res) => {
    const { userId } = req.params;

    const orders = await orderService.getOrdersForUserId(parseInt(userId));

    res.send({
      data: orders,
      count: orders.length,
    });
  };

  const addOrder: RequestHandler = async (req, res) => {
    const addOrderInput = req.body;

    const newOrder = await orderModel.parseAsync(addOrderInput).catch((e) => {
      throw new BadRequest('Invalid order input data');
    });

    const order = await orderService.addOrder(newOrder);

    res.status(201).send({
      data: order,
    });
  };

  return {
    getOrders,
    getOrderById,
    getOrdersForUserId,
    addOrder,
  };
};

export const __TESTS__ = {
  createOrderController,
};

export const orderController = createOrderController({ orderService });
