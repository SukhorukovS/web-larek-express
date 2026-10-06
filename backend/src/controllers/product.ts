import path from 'path';
import fs from 'fs';
import { Request, Response, NextFunction } from 'express';

import Product from '../models/product';
import config from '../config';
import NotFoundError from '../errors/NotFoundError';

const moveImageFromTemp = async (fileName: string) => {
  const basename = path.basename(fileName);
  const sourcePath = path.join(config.UPLOAD_TEMP_DIR, basename);
  const destinationPath = path.join(config.UPLOAD_IMAGE_DIR, basename);

  if (!fs.existsSync(sourcePath)) {
    throw new NotFoundError('Файл не найден во временной папке');
  }

  await fs.promises.mkdir(config.UPLOAD_IMAGE_DIR, { recursive: true });
  await fs.promises.rename(sourcePath, destinationPath);
};

export const getProducts = (_req: Request, res: Response, next: NextFunction) => {
  Product.find({})
    .then((products) => res.send({ items: products, total: products.length }))
    .catch(next);
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  const { image } = req.body;

  try {
    await moveImageFromTemp(image.fileName);

    const product = await Product.create(req.body);
    return res.status(201).send({ data: product });
  } catch (error) {
    return next(error);
  }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  const { productId } = req.params;
  const { image } = req.body;

  try {
    if (image) {
      await moveImageFromTemp(image.fileName);
    }

    const product = await Product.findByIdAndUpdate(productId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      throw new NotFoundError('Товар не найден');
    }

    return res.send({ data: product });
  } catch (error) {
    return next(error);
  }
};
