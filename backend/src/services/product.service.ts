import { cache } from '../utils/redis.util';
import { productRepository } from '../repositories/product.repository';
import {
  CreateProductInput,
  UpdateProductInput,
  UpdateInventoryInput,
} from '../validators/api.validators';
import { PaginationParams } from '../utils/pagination.util';

const CACHE_TTL = 60;

const vendorProductsCacheKey = (vendorId: string, page: number, search?: string) =>
  `products:vendor:${vendorId}:${page}:${search || ''}`;

export const productService = {
  createProduct: async (vendorId: string, data: CreateProductInput) => {
    const product = await productRepository.create(vendorId, data);
    // Bust vendor product list cache (page 1, no search)
    await cache.del(vendorProductsCacheKey(vendorId, 1));
    return product;
  },

  getProduct: async (vendorId: string, productId: string) => {
    const cacheKey = `product:${productId}`;
    const cached = await cache.get(cacheKey);
    if (cached) return cached;

    const product = await productRepository.findById(vendorId, productId);
    await cache.set(cacheKey, product, CACHE_TTL);
    return product;
  },

  updateProduct: async (vendorId: string, productId: string, data: UpdateProductInput) => {
    const product = await productRepository.update(vendorId, productId, data);
    await cache.del(`product:${productId}`);
    return product;
  },

  updateInventory: async (
    vendorId: string,
    productId: string,
    data: UpdateInventoryInput
  ) => {
    const product = await productRepository.updateInventory(vendorId, productId, data);
    await cache.del(`product:${productId}`);
    return product;
  },

  deleteProduct: async (vendorId: string, productId: string) => {
    await productRepository.softDelete(vendorId, productId);
    await cache.del(`product:${productId}`);
  },

  getVendorProducts: async (
    vendorId: string,
    search: string | undefined,
    pagination: PaginationParams
  ) => {
    const cacheKey = vendorProductsCacheKey(vendorId, pagination.page, search);
    const cached = await cache.get(cacheKey);
    if (cached) return cached;

    const result = await productRepository.findByVendor(vendorId, search, pagination);
    await cache.set(cacheKey, result, CACHE_TTL);
    return result;
  },
};
