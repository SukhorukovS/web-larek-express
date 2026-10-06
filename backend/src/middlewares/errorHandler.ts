import { Request, Response, NextFunction } from 'express';
import { Error as MongooseError } from 'mongoose';
import { CelebrateError, Segments } from 'celebrate';
import { MulterError } from 'multer';
import BadRequestError from '../errors/BadRequestError';
import ConflictError from '../errors/ConflictError';

interface ErrorWithStatusCode extends Error {
  statusCode?: number;
}

const errorHandler = (
  err: ErrorWithStatusCode,
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  let error = err;

  if (error instanceof CelebrateError) {
    const validationMessage = error.details.get(Segments.BODY)?.message
      ?? error.details.values().next().value?.message
      ?? 'Ошибка валидации данных';
    error = new BadRequestError(validationMessage);
  }

  if (error instanceof MongooseError.ValidationError || error instanceof MongooseError.CastError) {
    error = new BadRequestError(error.message);
  }

  if (error instanceof MulterError) {
    const message = error.code === 'LIMIT_FILE_SIZE'
      ? 'Файл слишком большой. Максимальный размер - 5 МБ'
      : 'Ошибка загрузки файла';
    error = new BadRequestError(message);
  }

  if ((error as { code?: number }).code === 11000) {
    error = new ConflictError('Запись с такими данными уже существует');
  }

  const { statusCode = 500 } = error;

  res.status(statusCode).send({
    message: statusCode === 500 ? 'Произошла ошибка' : error.message,
  });

  return next();
};

export default errorHandler;
