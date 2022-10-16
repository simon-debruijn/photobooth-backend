import { Router } from 'express';

import { isUserAuthenticatedMiddleware } from '@/auth/auth.middleware';
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
  isUserAuthenticatedMiddleware,
  isOrderIdFromUserIdMiddleware,
  imageController.getImagesForOrderId,
);
orderRouter.post('/:orderId/images', uploadImagesMiddleware, imageController.addImageToOrder);
