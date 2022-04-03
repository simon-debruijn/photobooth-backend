import { Router } from 'express';
import multer from 'multer';

import * as imageController from './image.controller';

export const imageRouter = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${__dirname}/../../../images/`);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  },
});

const upload = multer({ storage });

imageRouter.post('/', upload.array('images'), imageController.addImage);
