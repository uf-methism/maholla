import { Request, Response } from 'express';
import prisma from '../config/prismaClient';
import { AppError } from '../utils/appError.util';
import { asyncHandler } from '../utils/asyncHandler.util';
import { sarvamService } from '../services/ai/sarvam.service';
import { openRouterService } from '../ai/openrouter';

export const processVoiceInventory = asyncHandler(async (req: Request, res: Response) => {
  const vendorId = req.params.vendorId as string;

  // 1. Validate Upload
  if (!req.file) {
    throw new AppError('No audio file provided', 400);
  }

  // 2. Transcribe Audio via Sarvam AI
  const transcript = await sarvamService.transcribeAudio(
    req.file.buffer,
    req.file.originalname,
    req.file.mimetype
  );

  // 3. Parse Intent via OpenRouter
  const intent = await openRouterService.parseInventoryIntent(transcript);

  // 4. Update Database in a Transaction
  const result = await prisma.$transaction(async (tx) => {
    // Save VoiceCommand log
    const voiceCommand = await tx.voiceCommand.create({
      data: {
        vendorId,
        audioUrl: 'local_memory_buffer', // Mocking URL since we process directly from memory
        transcript,
        parsedAction: intent as any,
        isApplied: !intent.fallback_required && intent.items.length > 0,
      },
    });

    const appliedUpdates: Array<{
      productName: string;
      matchedProductId: string;
      quantityChange: number;
    }> = [];
    const unmatchedItems: string[] = [];

    // If parsing was successful, update products
    if (!intent.fallback_required) {
      // Fetch all products for this vendor to match against
      const vendorProducts = await tx.product.findMany({
        where: { vendorId, deletedAt: null },
      });

      for (const item of intent.items) {
        // Simple case-insensitive matching
        // In a real production system, this could be semantic search via pgvector
        const matchedProduct = vendorProducts.find((p) =>
          p.name.toLowerCase().includes(item.name.toLowerCase())
        );

        if (matchedProduct) {
          // Update stock
          const newStock = Math.max(0, matchedProduct.stockQuantity + item.quantity_change);
          const reason = item.quantity_change > 0 ? 'RESTOCK' : 'SALE';

          await tx.product.update({
            where: { id: matchedProduct.id },
            data: { stockQuantity: newStock },
          });

          // Log inventory change
          await tx.inventoryLog.create({
            data: {
              productId: matchedProduct.id,
              previousStock: matchedProduct.stockQuantity,
              newStock,
              reason,
            },
          });

          appliedUpdates.push({
            productName: matchedProduct.name,
            matchedProductId: matchedProduct.id,
            quantityChange: item.quantity_change,
          });
        } else {
          unmatchedItems.push(item.name);
        }
      }
    }

    return {
      voiceCommand,
      appliedUpdates,
      unmatchedItems,
    };
  });

  res.status(200).json({
    status: 'success',
    data: {
      transcript,
      intentSummary: intent.intent_summary,
      fallbackRequired: intent.fallback_required,
      updates: result.appliedUpdates,
      unmatchedItems: result.unmatchedItems,
    },
  });
});
