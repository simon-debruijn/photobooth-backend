import fs from 'fs/promises';
import multer from 'multer';
import path from 'path';

import { IMAGES_DIRECTORY } from '@/constants';

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const orderId = req.params.orderId;

    const directory = IMAGES_DIRECTORY
      ? path.join(IMAGES_DIRECTORY, orderId + '/')
      : path.join(__dirname, '/../../../images/', orderId + '/');

    try {
      await fs.access(directory, 1);
    } catch {
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      await fs.mkdir(directory, { recursive: true });
    } finally {
      cb(null, directory);
    }
  },
  filename: (req, file, cb) => {
    const orderId = req.params.orderId;
    const timeStamp = Date.now();
    const fileTypeParts = file.mimetype.split('/');
    const fileExtension = fileTypeParts[fileTypeParts.length - 1];
    const fileName = `image-${orderId}-${timeStamp}.${fileExtension}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage });

export const uploadImagesMiddleware = upload.array('images');
