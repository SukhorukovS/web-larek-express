import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Product from '../models/product';
import Order from '../models/order';

interface IOrderBody {
  payment: string;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
}

const createOrder = async (req: Request, res: Response) => {
  try {
    const body = req.body as IOrderBody;
    const { total, items } = body;

    if (!Array.isArray(items) || items.length === 0 || items.some((id) => typeof id !== 'string')) {
      return res.status(400).send({ message: 'Некорректный список товаров' });
    }

    const products = await Product.find({ _id: { $in: items } });

    if (products.length !== items.length) {
      return res.status(404).send({ message: 'Один из товаров не найден' });
    }

    if (products.some((product) => product.price === null)) {
      return res.status(400).send({ message: 'Один из товаров не продаётся' });
    }

    const calculatedTotal = products.reduce((acc, product) => acc + (product.price ?? 0), 0);

    if (typeof total !== 'number' || total !== calculatedTotal) {
      return res.status(400).send({ message: 'Некорректная сумма заказа' });
    }

    const order = await Order.create(body);

    return res.send({ id: order._id, total: order.total });
  } catch (err) {
    console.error(err);
    if (err instanceof mongoose.Error.ValidationError || err instanceof mongoose.Error.CastError) {
      return res.status(400).send({ message: err.message });
    }
    return res.status(500).send({ message: 'Произошла ошибка' });
  }
};

export default createOrder;
