import { Schema, model } from 'mongoose';
import { faker } from '@faker-js/faker';
import validator from 'validator';

interface IOrder {
  _id: string;
  payment: string;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
}

const orderSchema = new Schema<IOrder>({
  _id: {
    type: String,
    default: () => faker.string.uuid(),
  },
  payment: {
    type: String,
    enum: ['card', 'online'],
    required: true,
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: (value: string) => validator.isEmail(value),
      message: 'Некорректный email',
    },
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  items: {
    type: [String],
    required: true,
    validate: {
      validator: (value: string[]) => value.length > 0,
      message: 'Список товаров не может быть пустым',
    },
  },
});

export default model<IOrder>('order', orderSchema);
