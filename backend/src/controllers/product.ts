import path from 'path';
import fs from 'fs';
import { Request, Response, NextFunction } from 'express';

import Product from '../models/product';
import config from '../config';
import NotFoundError from '../errors/NotFoundError';

export const getProducts = (_req: Request, res: Response, next: NextFunction) => {
  Product.find({})
    .then((products) => res.send({ items: products, total: products.length }))
    .catch(next);
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  const { image } = req.body;

  try {
    const fileName = path.basename(image.fileName);
    const sourcePath = path.join(config.UPLOAD_TEMP_DIR, fileName);
    const destinationPath = path.join(config.UPLOAD_IMAGE_DIR, fileName);

    if (!fs.existsSync(sourcePath)) {
      throw new NotFoundError('Файл не найден во временной папке');
    }

    await fs.promises.mkdir(config.UPLOAD_IMAGE_DIR, { recursive: true });
    await fs.promises.rename(sourcePath, destinationPath);

    const product = await Product.create(req.body);
    return res.status(201).send({ data: product });
  } catch (error) {
    return next(error);
  }
};
