import fs from 'fs/promises';
import path from 'path';

import { IMAGES_DIRECTORY } from '@/constants';

export const createImageService = () => {
  const getImagesForOrderId = async (orderId: string) => {
    const directory = IMAGES_DIRECTORY
      ? path.join(IMAGES_DIRECTORY, orderId + '/')
      : path.join(__dirname, '/../../../images/', orderId + '/');

    const imageNamesForOrder = await fs.readdir(directory);

    const imageUrls = imageNamesForOrder.map(
      (name) => `http://localhost:8080/images/${orderId}/${name}`,
    );

    return imageUrls;
  };

  return {
    getImagesForOrderId,
  };
};
