import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { isValidObjectId } from 'mongoose';
import type { HydratedDocument } from 'mongoose';
import User, { IUser } from '../models/user';
import UnauthorizedError from '../errors/UnauthorizedError';
import BadRequestError from '../errors/BadRequestError';
import NotFoundError from '../errors/NotFoundError';
import {
  createAccessToken,
  createRefreshToken,
  verifyRefreshToken,
  REFRESH_TOKEN_COOKIE_NAME,
  refreshTokenCookieOptions,
} from '../utils/tokens';
import { clearAndRespond } from '../utils/clearCookieAndRespond';
import type { IUserRequest } from '../middlewares/auth';

const SALT_ROUNDS = 10;

type UserDocument = HydratedDocument<IUser>;

const sendUserWithTokens = (
  user: UserDocument,
  res: Response,
  next: NextFunction,
  statusCode = 200,
) => {
  const userId = String(user._id);
  const accessToken = createAccessToken(userId);
  const refreshToken = createRefreshToken(userId);

  user.tokens.push({ token: refreshToken });

  return user.save()
    .then(() => {
      res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, refreshTokenCookieOptions);
      return res.status(statusCode).send({
        user: { name: user.name, email: user.email },
        success: true,
        accessToken,
      });
    })
    .catch(next);
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  return User.findOne({ email }).select('+password +tokens')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Неправильные почта или пароль');
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError('Неправильные почта или пароль');
          }

          return sendUserWithTokens(user, res, next);
        });
    })
    .catch(next);
};

export const register = (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;

  return bcrypt.hash(password, SALT_ROUNDS)
    .then((hash) => User.create({ name, email, password: hash }))
    .then((user) => sendUserWithTokens(user, res, next, 201))
    .catch(next);
};

export const refreshAccessToken = (req: Request, res: Response, next: NextFunction) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  let userId: string;

  try {
    userId = verifyRefreshToken(refreshToken)._id;
  } catch {
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  return User.findOne({ _id: userId, 'tokens.token': refreshToken }).select('+tokens')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Необходима авторизация');
      }

      const tokenIndex = user.tokens.findIndex((item) => item.token === refreshToken);

      if (tokenIndex !== -1) {
        user.tokens.splice(tokenIndex, 1);
      }

      return sendUserWithTokens(user, res, next);
    })
    .catch(next);
};

export const logout = (req: Request, res: Response, next: NextFunction) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return clearAndRespond(res);
  }

  let userId: string;

  try {
    userId = verifyRefreshToken(refreshToken)._id;
  } catch {
    return clearAndRespond(res);
  }

  if (!isValidObjectId(userId)) {
    return next(new BadRequestError('Невалидный идентификатор пользователя'));
  }

  return User.findByIdAndUpdate(userId, { $pull: { tokens: { token: refreshToken } } })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }

      return clearAndRespond(res);
    })
    .catch(next);
};

export const getCurrentUser = (req: IUserRequest, res: Response, next: NextFunction) => {
  const userId = req.user?._id;

  return User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }

      return res.send({
        user: { name: user.name, email: user.email },
        success: true,
      });
    })
    .catch(next);
};
