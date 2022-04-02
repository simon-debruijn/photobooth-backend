import { logger } from '@/logger/logger';
import { PrismaClient } from '@prisma/client';

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
