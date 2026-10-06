import { Router } from 'express';
import { celebrate } from 'celebrate';
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from '../controllers/product';
import { productBodySchema, productUpdateBodySchema } from '../middlewares/validations';

const router = Router();
router.get('/', getProducts);

router.post('/', celebrate({ body: productBodySchema }), createProduct);

router.patch('/:productId', celebrate({ body: productUpdateBodySchema }), updateProduct);

router.delete('/:productId', deleteProduct);

export default router;
