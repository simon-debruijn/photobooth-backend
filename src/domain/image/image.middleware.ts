import fs from 'fs/promises';
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const orderId = req.params.orderId;

    const directory = path.resolve(__dirname, '/../../../images/', orderId + '/');
    try {
      await fs.access(directory, 1);
    } catch (e) {
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      await fs.mkdir(directory, { recursive: true });
    } finally {
      cb(null, directory);
    }
  },
  filename: (req, file, cb) => {
    const orderId = req.params.orderId;
    const timeStamp = Date.now();
    const fileName = `image-${orderId}-${timeStamp}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage });

export const uploadImagesMiddleware = upload.array('images');
