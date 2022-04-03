import { app } from './app';
import http from 'http';
import { connectToDatabase } from './database/prisma.client';
import { logger } from '@/logger/logger';
import { PORT } from './constants';

const port = PORT || 8080;

const startServer = async () => {
  await connectToDatabase();

  const server = http.createServer(app);

  server.listen(port, () => logger.info(`Server listening on port ${port}`));
};

startServer();
