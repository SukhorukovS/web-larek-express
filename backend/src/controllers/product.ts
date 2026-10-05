import { Request, Response, NextFunction } from 'express';
import Product from '../models/product';

export const getProducts = (_req: Request, res: Response, next: NextFunction) => {
  Product.find({})
    .then((products) => res.send({ items: products, total: products.length }))
    .catch(next);
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.create(req.body);
    return res.status(201).send({ data: product });
  } catch (error) {
    return next(error);
  }
};
