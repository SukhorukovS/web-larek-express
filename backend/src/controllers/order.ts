import { Request, Response, NextFunction } from 'express';
import Product from '../models/product';
import Order from '../models/order';
import BadRequestError from '../errors/BadRequestError';
import NotFoundError from '../errors/NotFoundError';

interface IOrderBody {
  payment: string;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
}

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = req.body as IOrderBody;
    const { total, items } = body;

    const products = await Product.find({ _id: { $in: items } });

    if (products.length !== items.length) {
      return next(new NotFoundError('Один из товаров не найден'));
    }

    if (products.some((product) => product.price === null)) {
      return next(new BadRequestError('Один из товаров не продаётся'));
    }

    const calculatedTotal = products.reduce((acc, product) => acc + (product.price ?? 0), 0);

    if (typeof total !== 'number' || total !== calculatedTotal) {
      return next(new BadRequestError('Некорректная сумма заказа'));
    }

    const order = await Order.create(body);

    return res.status(201).send({ id: order._id, total: order.total });
  } catch (error) {
    return next(error);
  }
};

export default createOrder;
