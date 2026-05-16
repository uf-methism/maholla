import { Router } from 'express';
import {
  verifyWebhook,
  handleIncomingMessage,
} from '../controllers/whatsapp.controller';

const router = Router();

// Meta webhook verification (called once during setup)
router.get('/webhook', verifyWebhook);

// Incoming WhatsApp messages
router.post('/webhook', handleIncomingMessage);

export default router;
