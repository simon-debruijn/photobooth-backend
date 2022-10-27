/* eslint-disable node/no-unsupported-features/es-builtins */
import { Prisma, PrismaClient } from '@prisma/client';
import Hashids from 'hashids';
import { BadRequest } from 'http-errors';

type Dependencies = {
  prismaClient: PrismaClient;
  hashids: Hashids;
};

export const createOrderService = ({ prismaClient, hashids }: Dependencies) => {
  const getDecodedId = (orderId: string | number) => {
    let decodedId: bigint;

    if (typeof orderId !== 'number') {
      decodedId = BigInt(hashids.decode(orderId)[0]);
    } else {
      decodedId = BigInt(orderId);
    }
    return decodedId;
  };

  const getOrders = async () => {
    return await prismaClient.order.findMany();
  };

  const getOrderById = async (id: string) => {
    const decodedId = getDecodedId(id);

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

  const addImagesToOrder = async (images: string[], orderId: string) => {
    const decodedId: bigint = getDecodedId(orderId);

    const order = await prismaClient.order.findUnique({
      where: { id: parseInt(decodedId.toString()) },
    });

    if (!order) {
      throw new BadRequest('Order does not exist');
    }

    const currentImages = order?.images ?? [];

    await prismaClient.order.update({
      where: {
        id: parseInt(decodedId.toString()),
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
