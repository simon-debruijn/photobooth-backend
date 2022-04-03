/* eslint-disable node/no-unsupported-features/es-builtins */
import { logger } from '@/logger/logger';
import { Prisma, PrismaClient } from '@prisma/client';
import Hashids from 'hashids';

type Dependencies = {
  prismaClient: PrismaClient;
  hashids: Hashids;
};

export const createOrderService = ({ prismaClient, hashids }: Dependencies) => {
  const getOrders = async () => {
    return await prismaClient.order.findMany();
  };

  const getOrderById = async (id: string) => {
    let decodedId: BigInt;

    if (Number.isNaN(parseInt(id))) {
      decodedId = BigInt(hashids.decode(id)[0]);
    } else {
      decodedId = BigInt(id);
    }

    return await prismaClient.order.findUnique({
      where: {
        id: parseInt(decodedId.toString()),
      },
    });
  };

  const getOrdersForCustomerId = async (customerId: number) => {
    return await prismaClient.order.findMany({
      where: {
        customer_id: customerId,
      },
    });
  };

  const addOrder = async (newOrder: Prisma.orderUncheckedCreateInput) => {
    const order = await prismaClient.order.create({ data: newOrder });

    const url_friendly_id = hashids.encode(order.id);

    const orderWithUrlFriendlyId = {
      ...order,
      url_friendly_id,
    };

    const updatedOrder = await prismaClient.order.update({
      where: { id: order.id },
      data: orderWithUrlFriendlyId,
    });

    return updatedOrder;
  };

  return {
    getOrders,
    getOrderById,
    getOrdersForCustomerId,
    addOrder,
  };
};

export type OrderService = ReturnType<typeof createOrderService>;
