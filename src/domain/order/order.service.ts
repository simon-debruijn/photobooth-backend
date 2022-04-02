import { Prisma, PrismaClient } from '@prisma/client';

type Dependencies = {
  prismaClient: PrismaClient;
};

export const createOrderService = ({ prismaClient }: Dependencies) => {
  const getOrders = async () => {
    return await prismaClient.order.findMany();
  };

  const getOrderById = async (id: number) => {
    return await prismaClient.order.findUnique({
      where: {
        id,
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
    return await prismaClient.order.create({ data: newOrder });
  };

  return {
    getOrders,
    getOrderById,
    getOrdersForCustomerId,
    addOrder,
  };
};

export type OrderService = ReturnType<typeof createOrderService>;
