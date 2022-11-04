import { Router } from 'express';

import { isUserAuthenticated } from '@/auth/auth.middleware';
import { uploadImages } from '@/domain/image/image.middleware';

import { imageController } from '../image/image.controller';
import { orderController } from './order.controller';
import { isOrderIdFromUserId } from './order.middleware';

export const orderRouter = Router();

orderRouter.get('/', orderController.getOrders);
orderRouter.get('/:id', orderController.getOrderById);
orderRouter.post('/', orderController.addOrder);
orderRouter.get(
  '/:orderId/images',
  isUserAuthenticated,
  isOrderIdFromUserId,
  imageController.getImagesForOrderId,
);
orderRouter.post('/:orderId/images', uploadImages, imageController.addImageToOrder);
