import { Router } from 'express';

import { isUserAuthenticated } from '@/auth/auth';
import { uploadImagesMiddleware } from '@/domain/image/image.middleware';

import * as imageController from '../image/image.controller';
import * as orderController from './order.controller';
import { isOrderIdFromUserIdMiddleware } from './order.middleware';

export const orderRouter = Router();

orderRouter.get('/', orderController.getOrders);
orderRouter.get('/:id', orderController.getOrderById);
orderRouter.post('/', orderController.addOrder);
orderRouter.get(
  '/:orderId/images',
  isUserAuthenticated,
  isOrderIdFromUserIdMiddleware,
  imageController.getImagesForOrderId,
);
orderRouter.post('/:orderId/images', uploadImagesMiddleware, imageController.addImageToOrder);
