import { Router } from 'express';
import * as productController from '../controllers/product.controller';
import { validateRequest } from '../middlewares/validateRequest.middleware';
import {
  createProductSchema,
  updateProductSchema,
  getVendorProductsSchema,
} from '../validators/api.validators';

// Nested under /vendors/:vendorId/products
const router = Router({ mergeParams: true });

router.post('/', validateRequest(createProductSchema), productController.addProduct);
router.get('/', validateRequest(getVendorProductsSchema), productController.getVendorProducts);
router.patch('/:productId', validateRequest(updateProductSchema), productController.updateProduct);
router.delete('/:productId', productController.deleteProduct);

export default router;
