import { Request, Response, NextFunction } from 'express';
import { Error as MongooseError } from 'mongoose';
import Product from '../models/product';
import BadRequestError from '../errors/BadRequestError';
import ConflictError from '../errors/ConflictError';

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
    if (error instanceof Error && error.message.includes('E11000')) {
      return next(new ConflictError('Товар с таким названием уже существует'));
    }
    if (
      error instanceof MongooseError.ValidationError
      || error instanceof MongooseError.CastError
    ) {
      return next(new BadRequestError('Ошибка валидации данных при создании товара'));
    }
    return next(error);
  }
};
