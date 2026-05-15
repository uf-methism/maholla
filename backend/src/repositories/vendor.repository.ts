import prisma from '../config/prismaClient';
import { AppError } from '../utils/appError.util';
import { CreateVendorInput, UpdateVendorInput } from '../validators/api.validators';
import { PaginationParams } from '../utils/pagination.util';

export const vendorRepository = {
  create: async (data: CreateVendorInput) => {
    const existing = await prisma.vendor.findUnique({ where: { phone: data.phone } });
    if (existing) throw new AppError('A vendor with this phone number already exists', 409);
    return prisma.vendor.create({ data });
  },

  findById: async (id: string) => {
    const vendor = await prisma.vendor.findFirst({
      where: { id, deletedAt: null },
      include: { _count: { select: { products: true, reviews: true, orders: true } } },
    });
    if (!vendor) throw new AppError('Vendor not found', 404);
    return vendor;
  },

  update: async (id: string, data: UpdateVendorInput) => {
    await vendorRepository.findById(id); // ensure exists
    return prisma.vendor.update({ where: { id }, data });
  },

  softDelete: async (id: string) => {
    await vendorRepository.findById(id);
    return prisma.vendor.update({ where: { id }, data: { deletedAt: new Date() } });
  },

  findNearby: async (
    lat: number,
    lng: number,
    radiusKm: number,
    search: string | undefined,
    { skip, limit }: PaginationParams
  ) => {
    // Bounding box approximation: 1 degree ≈ 111km
    const delta = radiusKm / 111;

    const where = {
      deletedAt: null,
      latitude: { gte: lat - delta, lte: lat + delta },
      longitude: { gte: lng - delta, lte: lng + delta },
      ...(search && { name: { contains: search, mode: 'insensitive' as const } }),
    };

    const [vendors, total] = await Promise.all([
      prisma.vendor.findMany({
        where,
        skip,
        take: limit,
        include: { _count: { select: { products: true, reviews: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.vendor.count({ where }),
    ]);

    return { vendors, total };
  },
};
