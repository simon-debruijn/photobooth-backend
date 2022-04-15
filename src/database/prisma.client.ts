import { PrismaClient } from '@prisma/client';

import { logger } from '@/logger/logger';

export const prismaClient = new PrismaClient();

export const connectToDatabase = async () => {
  try {
    await prismaClient.$connect();
  } catch (error) {
    logger.error('Database connection failed', error);

    // eslint-disable-next-line no-process-exit
    process.exit(1);
  }
};
