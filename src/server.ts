import http from 'http';

import { logger } from '@/logger/logger';

import { app } from './app';
import { PORT } from './constants';
import { connectToDatabase } from './database/prisma.client';

const port = PORT || 8080;

const startServer = async () => {
  await connectToDatabase();

  const server = http.createServer(app);

  server.listen(port, () => logger.info(`Server listening on port ${port}`));
};

startServer();
