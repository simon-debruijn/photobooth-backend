import { RequestHandler } from 'express';
import { BadRequest } from 'http-errors';

export const addImage: RequestHandler = async (req, res) => {
  const images = req.files;

  if (!images) {
    throw new BadRequest('Image files where not passed properly');
  }

  const imageNames = (images as Express.Multer.File[]).map(
    (image: Express.Multer.File) => image.originalname,
  );

  res.status(201).send({
    message: 'Images were successfully added',
    image_names: imageNames,
  });
};
