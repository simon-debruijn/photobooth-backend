import { RequestHandler } from 'express';
import { BadRequest } from 'http-errors';

import { imageService } from '../image/image.service';
import { orderService } from '../order/order.service';

const createImageController = () => {
  const addImageToOrder: RequestHandler = async (req, res) => {
    const images = req.files;
    const orderId = req.params.orderId;

    if (!images) {
      throw new BadRequest('Image files where not passed properly');
    }

    const imageNames = (images as Express.Multer.File[]).map(
      (image: Express.Multer.File) => image.filename,
    );

    await orderService.addImagesToOrder(imageNames, orderId);

    const url = `${req.protocol}://${req.headers.host}`;

    const imageUrls = imageNames.map((name) => `${url}/images/${orderId}/${name}`);

    res.status(201).send({
      message: 'Images were successfully added',
      images: imageUrls,
    });
  };

  const getImagesForOrderId: RequestHandler = async (req, res) => {
    const orderId = req.params.orderId;

    const images =
      (await imageService.getImagesForOrderId(orderId, `${req.protocol}://${req.headers.host}`)) ??
      [];

    res.send({
      count: images.length,
      data: images,
    });
  };

  return {
    addImageToOrder,
    getImagesForOrderId,
  };
};

export const __TESTS__ = {
  createImageController,
};

export const imageController = createImageController();
