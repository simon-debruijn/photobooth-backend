import { app } from './app';
import http from 'http';
import { connectToDatabase } from './database/prisma.client';
import { logger } from '@/logger/logger';

const PORT = 8080;

const startServer = async () => {
  await connectToDatabase();

  const server = http.createServer(app);

  server.listen(PORT, () => logger.info(`Server listening on port ${PORT}`));
};

startServer();
