import 'dotenv/config';

import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import path from 'path';

import { imageRouter } from '@/domain/image/image.router';
import { orderRouter } from '@/domain/order/order.router';
import { userRouter } from '@/domain/user/user.router';
import { createErrorHandler } from '@/error/handleErrors';
import { handleExceptions } from '@/exception/handleExceptions';

import { logger } from './logger/logger';

export const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use('/users', userRouter);
app.use('/orders', orderRouter);
app.use('/images', imageRouter);

app.use(handleExceptions);
app.use(handleErrors);
