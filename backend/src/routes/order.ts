import { Router } from 'express';
import { celebrate } from 'celebrate';
import createOrder from '../controllers/order';
import { orderBodySchema } from '../middlewares/validations';

const router = Router();

router.post('/', celebrate({ body: orderBodySchema }), createOrder);

export default router;
