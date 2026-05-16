import { Router } from 'express';
import vendorRoutes from './vendor.routes';
import orderRoutes from './order.routes';

const router = Router();

// API Health Check
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Mohalla API is running' });
});

// Mount Routes
router.use('/vendors', vendorRoutes);
router.use('/orders', orderRoutes); // For global order routes (e.g. createOrder)

export default router;
