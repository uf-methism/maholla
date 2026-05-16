import { z } from 'zod';

// ─── Vendor ──────────────────────────────────────────────────────────────────

export const createVendorSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100),
    phone: z.string().regex(/^\+[1-9]\d{7,14}$/, 'Must be a valid E.164 phone number'),
    address: z.string().min(5).max(255),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  }),
});

export const updateVendorSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    name: z.string().min(2).max(100).optional(),
    address: z.string().min(5).max(255).optional(),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
  }),
});

export const nearbyVendorsSchema = z.object({
  query: z.object({
    lat: z.string().transform(Number),
    lng: z.string().transform(Number),
    radius: z.string().transform(Number).optional().default(5),
    search: z.string().optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
  }),
});

// ─── Product ─────────────────────────────────────────────────────────────────

export const createProductSchema = z.object({
  params: z.object({ vendorId: z.string().uuid() }),
  body: z.object({
    name: z.string().min(1).max(150),
    description: z.string().max(500).optional(),
    price: z.number().positive(),
    stockQuantity: z.number().int().min(0).default(0),
  }),
});

export const updateProductSchema = z.object({
  params: z.object({ vendorId: z.string().uuid(), productId: z.string().uuid() }),
  body: z.object({
    name: z.string().min(1).max(150).optional(),
    description: z.string().max(500).optional(),
    price: z.number().positive().optional(),
  }),
});

export const updateInventorySchema = z.object({
  params: z.object({ vendorId: z.string().uuid(), productId: z.string().uuid() }),
  body: z.object({
    stockQuantity: z.number().int().min(0),
    reason: z.enum(['RESTOCK', 'MANUAL']).default('MANUAL'),
  }),
});

export const getVendorProductsSchema = z.object({
  params: z.object({ vendorId: z.string().uuid() }),
  query: z.object({
    search: z.string().optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
  }),
});

// ─── Order ───────────────────────────────────────────────────────────────────

export const createOrderSchema = z.object({
  body: z.object({
    customerId: z.string().uuid(),
    vendorId: z.string().uuid(),
    notes: z.string().max(500).optional(),
    items: z
      .array(
        z.object({
          productId: z.string().uuid(),
          quantity: z.number().int().positive(),
        })
      )
      .min(1),
  }),
});

export const updateOrderStatusSchema = z.object({
  params: z.object({ orderId: z.string().uuid() }),
  body: z.object({
    status: z.enum(['ACCEPTED', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED']),
  }),
});

export const getVendorOrdersSchema = z.object({
  params: z.object({ vendorId: z.string().uuid() }),
  query: z.object({
    status: z
      .enum(['PENDING', 'ACCEPTED', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED'])
      .optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
  }),
});

export type CreateVendorInput = z.infer<typeof createVendorSchema>['body'];
export type UpdateVendorInput = z.infer<typeof updateVendorSchema>['body'];
export type CreateProductInput = z.infer<typeof createProductSchema>['body'];
export type UpdateProductInput = z.infer<typeof updateProductSchema>['body'];
export type UpdateInventoryInput = z.infer<typeof updateInventorySchema>['body'];
export type CreateOrderInput = z.infer<typeof createOrderSchema>['body'];
