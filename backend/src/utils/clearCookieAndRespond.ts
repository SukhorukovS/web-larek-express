import { Response } from 'express';
import {
  REFRESH_TOKEN_COOKIE_NAME,
  clearRefreshTokenCookieOptions,
} from './tokens';

export const clearAndRespond = (res: Response) => {
  res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, clearRefreshTokenCookieOptions);
  return res.send({ success: true });
};

export default clearAndRespond;
