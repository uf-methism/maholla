import { Router } from 'express';
import * as vendorController from '../controllers/vendor.controller';
import { validateRequest } from '../middlewares/validateRequest.middleware';
import {
  createVendorSchema,
  updateVendorSchema,
  nearbyVendorsSchema,
} from '../validators/api.validators';
import productRoutes from './product.routes';
import orderRoutes from './order.routes';
import voiceRoutes from './voice.routes';

const router = Router();

router.get('/nearby', validateRequest(nearbyVendorsSchema), vendorController.getNearbyVendors);

router.post('/', validateRequest(createVendorSchema), vendorController.createVendor);
router.get('/:id', vendorController.getVendor);
router.patch('/:id', validateRequest(updateVendorSchema), vendorController.updateVendor);

// Nested routes
router.use('/:vendorId/products', productRoutes);
router.use('/:vendorId/orders', orderRoutes);
router.use('/:vendorId', voiceRoutes);

export default router;
