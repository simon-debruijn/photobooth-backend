import 'dotenv/config';

import express from 'express';
import { createErrorHandler } from '@/error/handleErrors';
import { createExceptionHandler } from '@/exception/handleExceptions';
import { customerRouter } from '@/domain/customer/customer.router';
import { orderRouter } from '@/domain/order/order.router';
import { logger } from './logger/logger';
import cors from 'cors';

export const app = express();

app.use(cors());
app.use(express.json());

app.use('/customers', customerRouter);
app.use('/orders', orderRouter);

app.use(createExceptionHandler({ logger }));
app.use(createErrorHandler({ logger }));
