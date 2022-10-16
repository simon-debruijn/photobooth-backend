import fs from 'fs';
import path from 'path';

import { IMAGES_DIRECTORY } from '@/constants';

export const createImageService = () => {
  const getImagesForOrderId = async (orderId: string, url: string) => {
    const directory = IMAGES_DIRECTORY
      ? path.join(IMAGES_DIRECTORY, orderId + './')
      : path.join(__dirname, './../../../images/', orderId + '/');

    if (!fs.existsSync(directory)) {
      return [];
    }

    // eslint-disable-next-line security/detect-non-literal-fs-filename, node/no-unsupported-features/node-builtins
    const imageNamesForOrder = await fs.promises.readdir(directory);

    const imageUrls = imageNamesForOrder.map((name) => `${url}/images/${orderId}/${name}`);

    return imageUrls;
  };

  return {
    getImagesForOrderId,
  };
};
