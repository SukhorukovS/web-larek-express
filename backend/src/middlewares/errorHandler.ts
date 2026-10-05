import { Request, Response, NextFunction } from 'express';
import { Error as MongooseError } from 'mongoose';
import { CelebrateError, Segments } from 'celebrate';
import BadRequestError from '../errors/BadRequestError';

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

  const { statusCode = 500 } = error;

  res.status(statusCode).send({
    message: statusCode === 500 ? 'Произошла ошибка' : error.message,
  });

  return next();
};

export default errorHandler;
