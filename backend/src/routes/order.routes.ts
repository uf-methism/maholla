import { Router } from 'express';
import * as orderController from '../controllers/order.controller';
import { validateRequest } from '../middlewares/validateRequest.middleware';
import {
  createOrderSchema,
  updateOrderStatusSchema,
  getVendorOrdersSchema,
} from '../validators/api.validators';

// This file handles both root `/orders` routes and nested `/vendors/:vendorId/orders` routes
const router = Router({ mergeParams: true });

// Nested routes (mounted at /vendors/:vendorId/orders)
router.get('/', validateRequest(getVendorOrdersSchema), orderController.getVendorOrders);

// Global routes (should be mounted at /orders in index.ts)
router.post('/', validateRequest(createOrderSchema), orderController.createOrder);
router.patch('/:orderId/status', validateRequest(updateOrderStatusSchema), orderController.updateOrderStatus);

export default router;
