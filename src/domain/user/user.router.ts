import { Router } from 'express';

import { orderController } from '../order/order.controller';
import { userController } from './user.controller';

export const userRouter = Router();

userRouter.get('/', userController.getUsers);
userRouter.get('/me', userController.getMe);
userRouter.get('/:id', userController.getUserById);
userRouter.get('/:userId/orders', orderController.getOrdersForUserId);
userRouter.post('/register', userController.registerUser);
userRouter.post('/login', userController.loginUser);
