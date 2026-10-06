import path from 'path';
import crypto from 'crypto';
import fs from 'fs';
import multer from 'multer';

import BadRequestError from '../errors/BadRequestError';
import config from '../config';

const ALLOWED_MIME_TYPES = [
  'image/png',
  'image/jpg',
  'image/jpeg',
  'image/gif',
  'image/svg+xml',
];

fs.mkdirSync(config.UPLOAD_TEMP_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: config.UPLOAD_TEMP_DIR,
  filename: (_req, file, cb) => {
    const uniqueName = crypto.randomUUID().replace(/-/g, '');
    const extension = path.extname(file.originalname).toLowerCase();
    cb(null, `${uniqueName}${extension}`);
  },
});

const fileMiddleware = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return cb(null, true);
    }
    return cb(new BadRequestError('Недопустимый тип файла. Разрешены только изображения: png, jpg, jpeg, gif, svg'));
  },
});

export default fileMiddleware;
