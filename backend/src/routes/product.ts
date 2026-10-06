import { Router } from 'express';
import { celebrate } from 'celebrate';
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from '../controllers/product';
import auth from '../middlewares/auth';
import { productBodySchema, productUpdateBodySchema } from '../middlewares/validations';

const router = Router();
router.get('/', getProducts);

router.post('/', auth, celebrate({ body: productBodySchema }), createProduct);

router.patch('/:productId', auth, celebrate({ body: productUpdateBodySchema }), updateProduct);

router.delete('/:productId', auth, deleteProduct);

export default router;
