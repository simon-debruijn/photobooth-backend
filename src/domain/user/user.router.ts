import { Router } from 'express';
import * as userController from './user.controller';
import * as orderController from '../order/order.controller';

export const userRouter = Router();

userRouter.get('/', userController.getUsers);
userRouter.get('/:id', userController.getUserById);
userRouter.get('/:userId/orders', orderController.getOrdersForUserId);
userRouter.post('/register', userController.registerUser);
userRouter.post('/login', userController.loginUser);
