/* eslint-disable node/no-unsupported-features/es-builtins */
import { Prisma, PrismaClient } from '@prisma/client';
import Hashids from 'hashids';
import { BadRequest } from 'http-errors';

type Dependencies = {
  prismaClient: PrismaClient;
  hashids: Hashids;
};

export const createOrderService = ({ prismaClient, hashids }: Dependencies) => {
  const getOrders = async () => {
    return await prismaClient.order.findMany();
  };

  const getOrderById = async (id: string) => {
    let decodedId: bigint;

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

  const getOrdersForUserId = async (userId: number) => {
    return await prismaClient.order.findMany({
      where: {
        user_id: userId,
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

  const addImagesToOrder = async (images: string[], orderId: number) => {
    const order = await prismaClient.order.findUnique({ where: { id: orderId } });

    if (!order) {
      throw new BadRequest('Order does not exist');
    }

    const currentImages = order?.images ?? [];

    await prismaClient.order.update({
      where: {
        id: orderId,
      },
      data: {
        images: [...currentImages, ...images],
      },
    });
  };

  return {
    getOrders,
    getOrderById,
    getOrdersForUserId,
    addOrder,
    addImagesToOrder,
  };
};

export type OrderService = ReturnType<typeof createOrderService>;
