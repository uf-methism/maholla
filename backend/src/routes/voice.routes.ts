import { Router } from 'express';
import { processVoiceInventory } from '../controllers/voice.controller';
import { uploadAudio } from '../middlewares/upload.middleware';

const router = Router({ mergeParams: true });

/**
 * @swagger
 * /api/v1/vendors/{vendorId}/voice-inventory:
 *   post:
 *     summary: Upload voice note for AI inventory parsing
 *     tags: [Voice]
 *     parameters:
 *       - in: path
 *         name: vendorId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               audio:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Successfully parsed and updated inventory
 *       400:
 *         description: Bad request (invalid audio)
 */
router.post('/voice-inventory', uploadAudio.single('audio'), processVoiceInventory);

export default router;
