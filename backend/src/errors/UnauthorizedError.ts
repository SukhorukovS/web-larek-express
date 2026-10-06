import AppError from './AppError';

export default class UnauthorizedError extends AppError {
  constructor(message = 'Необходима авторизация') {
    super(message, 401);
  }
}
