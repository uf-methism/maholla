import { cache } from '../utils/redis.util';
import { vendorRepository } from '../repositories/vendor.repository';
import { CreateVendorInput, UpdateVendorInput } from '../validators/api.validators';
import { PaginationParams } from '../utils/pagination.util';

const CACHE_TTL = 60; // seconds

export const vendorService = {
  createVendor: async (data: CreateVendorInput) => {
    return vendorRepository.create(data);
  },

  getVendor: async (id: string) => {
    const cacheKey = `vendor:${id}`;
    const cached = await cache.get(cacheKey);
    if (cached) return cached;

    const vendor = await vendorRepository.findById(id);
    await cache.set(cacheKey, vendor, CACHE_TTL);
    return vendor;
  },

  updateVendor: async (id: string, data: UpdateVendorInput) => {
    const vendor = await vendorRepository.update(id, data);
    await cache.del(`vendor:${id}`);
    return vendor;
  },

  deleteVendor: async (id: string) => {
    await vendorRepository.softDelete(id);
    await cache.del(`vendor:${id}`);
  },

  getNearbyVendors: async (
    lat: number,
    lng: number,
    radiusKm: number,
    search: string | undefined,
    pagination: PaginationParams
  ) => {
    const cacheKey = `vendors:nearby:${lat}:${lng}:${radiusKm}:${search || ''}:${pagination.page}`;
    const cached = await cache.get(cacheKey);
    if (cached) return cached;

    const result = await vendorRepository.findNearby(lat, lng, radiusKm, search, pagination);
    await cache.set(cacheKey, result, CACHE_TTL);
    return result;
  },
};
