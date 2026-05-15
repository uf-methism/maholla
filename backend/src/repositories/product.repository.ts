import prisma from '../config/prismaClient.config';
import { AppError } from '../utils/appError.util';
import {
  CreateProductInput,
  UpdateProductInput,
  UpdateInventoryInput,
} from '../validators/api.validators';
import { PaginationParams } from '../utils/pagination.util';

export const productRepository = {
  create: async (vendorId: string, data: CreateProductInput) => {
    // Ensure vendor exists
    const vendor = await prisma.vendor.findFirst({ where: { id: vendorId, deletedAt: null } });
    if (!vendor) throw new AppError('Vendor not found', 404);

    return prisma.product.create({ data: { ...data, vendorId } });
  },

  findById: async (vendorId: string, productId: string) => {
    const product = await prisma.product.findFirst({
      where: { id: productId, vendorId, deletedAt: null },
    });
    if (!product) throw new AppError('Product not found', 404);
    return product;
  },

  update: async (vendorId: string, productId: string, data: UpdateProductInput) => {
    await productRepository.findById(vendorId, productId);
    return prisma.product.update({ where: { id: productId }, data });
  },

  updateInventory: async (
    vendorId: string,
    productId: string,
    data: UpdateInventoryInput
  ) => {
    const product = await productRepository.findById(vendorId, productId);

    const [updated] = await prisma.$transaction([
      prisma.product.update({
        where: { id: productId },
        data: { stockQuantity: data.stockQuantity },
      }),
      prisma.inventoryLog.create({
        data: {
          productId,
          previousStock: product.stockQuantity,
          newStock: data.stockQuantity,
          reason: data.reason,
        },
      }),
    ]);

    return updated;
  },

  softDelete: async (vendorId: string, productId: string) => {
    await productRepository.findById(vendorId, productId);
    return prisma.product.update({
      where: { id: productId },
      data: { deletedAt: new Date() },
    });
  },

  findByVendor: async (
    vendorId: string,
    search: string | undefined,
    { skip, limit }: PaginationParams
  ) => {
    const where = {
      vendorId,
      deletedAt: null,
      ...(search && { name: { contains: search, mode: 'insensitive' as const } }),
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: 'asc' },
      }),
      prisma.product.count({ where }),
    ]);

    return { products, total };
  },
};
