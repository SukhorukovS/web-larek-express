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
    enum: {
      values: ['card', 'online'],
      message: 'Поле "payment" должно быть card или online',
    },
    required: [true, 'Поле "payment" должно быть заполнено'],
  },
  email: {
    type: String,
    required: [true, 'Поле "email" должно быть заполнено'],
    validate: {
      validator: (value: string) => validator.isEmail(value),
      message: 'Некорректный email',
    },
  },
  phone: {
    type: String,
    required: [true, 'Поле "phone" должно быть заполнено'],
    validate: {
      validator: (value: string) => /^\+?\d{6,15}$/.test(value),
      message: 'Некорректный номер телефона',
    },
  },
  address: {
    type: String,
    required: [true, 'Поле "address" должно быть заполнено'],
  },
  total: {
    type: Number,
    required: [true, 'Поле "total" должно быть заполнено'],
    min: [0, 'Поле "total" не может быть отрицательным'],
  },
  items: {
    type: [String],
    required: [true, 'Поле "items" должно быть заполнено'],
    validate: {
      validator: (value: string[]) => value.length > 0,
      message: 'Список товаров не может быть пустым',
    },
  },
});

export default model<IOrder>('order', orderSchema);
