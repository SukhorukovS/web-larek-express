import { Request, Response } from 'express';
import Product from '../models/product';

export const getProducts = (_req: Request, res: Response) => Product.find({})
  .then((products) => res.send({ items: products, total: products.length }))
  .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));

export const createProduct = async (req: Request, res: Response) => {
  Product.create(req.body)
    .then((product) => res.send({ data: product }))
    .catch((err) => {
      console.error(err);
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};
