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
  // This expect error is needed because express doesn't like you extending the Request type
  // @ts-expect-error
  isOrderIdFromUserIdMiddleware,
  imageController.getImagesForOrderId,
);
orderRouter.post('/:orderId/images', uploadImagesMiddleware, imageController.addImageToOrder);
