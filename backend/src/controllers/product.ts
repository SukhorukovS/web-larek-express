import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Product from '../models/product';

export const getProducts = (_req: Request, res: Response) => Product.find({})
  .then((products) => res.send({ items: products, total: products.length }))
  .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));

export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.create(req.body);
    return res.send({ data: product });
  } catch (err) {
    console.error(err);
    if ((err as { code?: number }).code === 11000) {
      return res.status(400).send({ message: 'Товар с таким названием уже существует' });
    }
    if (err instanceof mongoose.Error.ValidationError || err instanceof mongoose.Error.CastError) {
      return res.status(400).send({ message: err.message });
    }
    return res.status(500).send({ message: 'Произошла ошибка' });
  }
};
