import { Router } from 'express';
import { celebrate } from 'celebrate';
import {
  login,
  register,
  refreshAccessToken,
  logout,
  getCurrentUser,
} from '../controllers/auth';
import auth from '../middlewares/auth';
import { loginBodySchema, registerBodySchema } from '../middlewares/validations';

const router = Router();

router.post('/login', celebrate({ body: loginBodySchema }), login);

router.post('/register', celebrate({ body: registerBodySchema }), register);

router.get('/token', refreshAccessToken);

router.get('/logout', logout);

router.get('/user', auth, getCurrentUser);

export default router;
