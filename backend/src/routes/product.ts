import { Router } from 'express';
import { celebrate } from 'celebrate';
import { createProduct, getProducts } from '../controllers/product';
import { productBodySchema } from '../middlewares/validations';

const router = Router();
router.get('/', getProducts);

router.post('/', celebrate({ body: productBodySchema }), createProduct);

export default router;
