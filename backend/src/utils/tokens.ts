import jwt from 'jsonwebtoken';
import ms from 'ms';
import type { StringValue } from 'ms';
import type { CookieOptions } from 'express';
import config from '../config';

export const REFRESH_TOKEN_COOKIE_NAME = 'refreshToken';

const baseCookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: false,
  path: '/',
} as const;

export const refreshTokenCookieOptions: CookieOptions = {
  ...baseCookieOptions,
  maxAge: ms(config.AUTH_REFRESH_TOKEN_EXPIRY as StringValue),
};

export const clearRefreshTokenCookieOptions: CookieOptions = { ...baseCookieOptions };

interface TokenPayload {
  _id: string;
}

export const createAccessToken = (_id: string): string => jwt.sign(
  { _id },
  config.JWT_SECRET,
  { expiresIn: ms(config.AUTH_ACCESS_TOKEN_EXPIRY as StringValue) },
);

export const createRefreshToken = (_id: string): string => jwt.sign(
  { _id },
  config.JWT_SECRET,
  { expiresIn: ms(config.AUTH_REFRESH_TOKEN_EXPIRY as StringValue) },
);

export const verifyAccessToken = (token: string): TokenPayload => (
  jwt.verify(token, config.JWT_SECRET) as TokenPayload
);

export const verifyRefreshToken = (token: string): TokenPayload => (
  jwt.verify(token, config.JWT_SECRET) as TokenPayload
);
