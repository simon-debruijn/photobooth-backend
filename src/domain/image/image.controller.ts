import { RequestHandler } from 'express';
import { BadRequest } from 'http-errors';

import { createImageService } from '@/domain/image/image.service';

import { orderService } from '../order/order.controller';

const imageService = createImageService();

export const addImageToOrder: RequestHandler = async (req, res) => {
  const images = req.files;
  const orderId = req.params.orderId;

  if (!images) {
    throw new BadRequest('Image files where not passed properly');
  }

  const imageNames = (images as Express.Multer.File[]).map(
    (image: Express.Multer.File) => image.filename,
  );

  await orderService.addImagesToOrder(imageNames, parseInt(orderId));

  res.status(201).send({
    message: 'Images were successfully added',
    image_names: imageNames,
  });
};

export const getImagesForOrderId: RequestHandler = async (req, res) => {
  const orderId = req.params.orderId;

  const images = (await imageService.getImagesForOrderId(orderId)) ?? [];

  res.send({
    count: images.length,
    data: images,
  });
};
