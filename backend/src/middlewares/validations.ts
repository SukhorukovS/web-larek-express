import { Joi } from 'celebrate';

export const productBodySchema = {
  title: Joi.string().required().min(2).max(30)
    .messages({
      'string.min': 'Минимальная длина поля "title" - 2',
      'string.max': 'Максимальная длина поля "title" - 30',
      'any.required': 'Поле "title" должно быть заполнено',
      'string.empty': 'Поле "title" должно быть заполнено',
    }),
  image: Joi.object().required().keys({
    fileName: Joi.string().required()
      .messages({
        'any.required': 'Поле "fileName" должно быть заполнено',
        'string.empty': 'Поле "fileName" должно быть заполнено',
      }),
    originalName: Joi.string().required()
      .messages({
        'any.required': 'Поле "originalName" должно быть заполнено',
        'string.empty': 'Поле "originalName" должно быть заполнено',
      }),
  }),
  category: Joi.string().required()
    .messages({
      'any.required': 'Поле "category" должно быть заполнено',
      'string.empty': 'Поле "category" должно быть заполнено',
    }),
  description: Joi.string().allow(''),
  price: Joi.number().allow(null),
};

export const productUpdateBodySchema = {
  title: Joi.string().min(2).max(30)
    .messages({
      'string.min': 'Минимальная длина поля "title" - 2',
      'string.max': 'Максимальная длина поля "title" - 30',
      'string.empty': 'Поле "title" должно быть заполнено',
    }),
  image: Joi.object().keys({
    fileName: Joi.string().required()
      .messages({
        'any.required': 'Поле "fileName" должно быть заполнено',
        'string.empty': 'Поле "fileName" должно быть заполнено',
      }),
    originalName: Joi.string().required()
      .messages({
        'any.required': 'Поле "originalName" должно быть заполнено',
        'string.empty': 'Поле "originalName" должно быть заполнено',
      }),
  }),
  category: Joi.string()
    .messages({
      'string.empty': 'Поле "category" должно быть заполнено',
    }),
  description: Joi.string().allow(''),
  price: Joi.number().allow(null),
};

export const loginBodySchema = {
  email: Joi.string().required().email()
    .messages({
      'string.email': 'Некорректный email',
      'any.required': 'Поле "email" должно быть заполнено',
      'string.empty': 'Поле "email" должно быть заполнено',
    }),
  password: Joi.string().required()
    .messages({
      'any.required': 'Поле "password" должно быть заполнено',
      'string.empty': 'Поле "password" должно быть заполнено',
    }),
};

export const registerBodySchema = {
  name: Joi.string().required().min(2).max(30)
    .messages({
      'string.min': 'Минимальная длина поля "name" - 2',
      'string.max': 'Максимальная длина поля "name" - 30',
      'any.required': 'Поле "name" должно быть заполнено',
      'string.empty': 'Поле "name" должно быть заполнено',
    }),
  email: Joi.string().required().email()
    .messages({
      'string.email': 'Некорректный email',
      'any.required': 'Поле "email" должно быть заполнено',
      'string.empty': 'Поле "email" должно быть заполнено',
    }),
  password: Joi.string().required().min(6)
    .messages({
      'string.min': 'Минимальная длина поля "password" - 6',
      'any.required': 'Поле "password" должно быть заполнено',
      'string.empty': 'Поле "password" должно быть заполнено',
    }),
};

export const orderBodySchema = {
  payment: Joi.string().valid('card', 'online').required()
    .messages({
      'any.only': 'Поле "payment" должно быть card или online',
      'any.required': 'Поле "payment" должно быть заполнено',
      'string.empty': 'Поле "payment" должно быть заполнено',
    }),
  email: Joi.string().required().email()
    .messages({
      'string.email': 'Некорректный email',
      'any.required': 'Поле "email" должно быть заполнено',
      'string.empty': 'Поле "email" должно быть заполнено',
    }),
  phone: Joi.string().required().pattern(/^\+?\d{6,15}$/)
    .messages({
      'string.pattern.base': 'Некорректный номер телефона',
      'any.required': 'Поле "phone" должно быть заполнено',
      'string.empty': 'Поле "phone" должно быть заполнено',
    }),
  address: Joi.string().required()
    .messages({
      'any.required': 'Поле "address" должно быть заполнено',
      'string.empty': 'Поле "address" должно быть заполнено',
    }),
  total: Joi.number().required()
    .messages({
      'any.required': 'Поле "total" должно быть заполнено',
    }),
  items: Joi.array().required().items(Joi.string()).min(1)
    .messages({
      'array.min': 'Список товаров не может быть пустым',
      'any.required': 'Поле "items" должно быть заполнено',
    }),
};
