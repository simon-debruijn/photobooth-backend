import 'dotenv/config';

import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

import { orderRouter } from '@/domain/order/order.router';
import { userRouter } from '@/domain/user/user.router';
import { handleErrors } from '@/error/handleErrors';
import { handleExceptions } from '@/exception/handleExceptions';

import { isUserAuthenticated } from './auth/auth.middleware';
import { isOrderIdFromUserId } from './domain/order/order.middleware';

export const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use('/images/:orderId', isUserAuthenticated, isOrderIdFromUserId);
app.use('/images', express.static('images'));

app.use('/users', userRouter);
app.use('/orders', orderRouter);

app.use(handleExceptions);
app.use(handleErrors);
