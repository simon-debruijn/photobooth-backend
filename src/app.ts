import 'dotenv/config';

import express from 'express';
import { createErrorHandler } from '@/error/handleErrors';
import { createExceptionHandler } from '@/exception/handleExceptions';
import { userRouter } from '@/domain/user/user.router';
import { orderRouter } from '@/domain/order/order.router';
import { imageRouter } from '@/domain/image/image.router';
import { logger } from './logger/logger';
import cors from 'cors';

export const app = express();

app.use(cors());
app.use(express.json());

app.use('/users', userRouter);
app.use('/orders', orderRouter);
app.use('/images', imageRouter);

app.use(createExceptionHandler({ logger }));
app.use(createErrorHandler({ logger }));
