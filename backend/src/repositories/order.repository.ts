import { OrderStatus } from '@prisma/client';
import prisma from '../config/prismaClient';
import { AppError } from '../utils/appError.util';
import { CreateOrderInput } from '../validators/api.validators';
import { PaginationParams } from '../utils/pagination.util';

export const orderRepository = {
  create: async (data: CreateOrderInput) => {
    // Fetch all products at once and validate stock
    const productIds = data.items.map((i) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, vendorId: data.vendorId, deletedAt: null },
    });

    if (products.length !== productIds.length) {
      throw new AppError('One or more products not found or do not belong to this vendor', 400);
    }

    // Check customer exists
    const customer = await prisma.customer.findFirst({
      where: { id: data.customerId, deletedAt: null },
    });
    if (!customer) throw new AppError('Customer not found', 404);

    // Calculate total and prepare order items
    let totalAmount = 0;
    const orderItemsData = data.items.map((item) => {
      const product = products.find((p: { id: string; }) => p.id === item.productId)!;
      if (product.stockQuantity < item.quantity) {
        throw new AppError(`Insufficient stock for product: ${product.name}`, 400);
      }
      totalAmount += product.price * item.quantity;
      return {
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: product.price,
      };
    });

    // Create order + deduct stock in a single transaction
    const order = await prisma.$transaction(async (tx: { order: { create: (arg0: { data: { customerId: string; vendorId: string; totalAmount: number; notes: string | undefined; orderItems: { create: { productId: string; quantity: number; unitPrice: any; }[]; }; }; include: { orderItems: boolean; }; }) => any; }; product: { update: (arg0: { where: { id: string; }; data: { stockQuantity: { decrement: number; }; }; }) => any; }; inventoryLog: { create: (arg0: { data: { productId: string; previousStock: any; newStock: number; reason: string; }; }) => any; }; }) => {
      const newOrder = await tx.order.create({
        data: {
          customerId: data.customerId,
          vendorId: data.vendorId,
          totalAmount,
          notes: data.notes,
          orderItems: { create: orderItemsData },
        },
        include: { orderItems: true },
      });

      // Deduct stock and log each change
      for (const item of data.items) {
        const product = products.find((p: { id: string; }) => p.id === item.productId)!;
        await tx.product.update({
          where: { id: item.productId },
          data: { stockQuantity: { decrement: item.quantity } },
        });
        await tx.inventoryLog.create({
          data: {
            productId: item.productId,
            previousStock: product.stockQuantity,
            newStock: product.stockQuantity - item.quantity,
            reason: 'SALE',
          },
        });
      }

      return newOrder;
    });

    return order;
  },

  findById: async (orderId: string) => {
    const order = await prisma.order.findFirst({
      where: { id: orderId, deletedAt: null },
      include: {
        orderItems: { include: { product: { select: { name: true, price: true } } } },
        customer: { select: { id: true, name: true, phone: true } },
        vendor: { select: { id: true, name: true, phone: true } },
      },
    });
    if (!order) throw new AppError('Order not found', 404);
    return order;
  },

  updateStatus: async (orderId: string, status: OrderStatus) => {
    const order = await prisma.order.findFirst({ where: { id: orderId, deletedAt: null } });
    if (!order) throw new AppError('Order not found', 404);

    // Guard invalid transitions (e.g., can't reopen a COMPLETED order)
    const terminalStatuses: OrderStatus[] = ['COMPLETED', 'CANCELLED'];
    if (terminalStatuses.includes(order.status)) {
      throw new AppError(`Order is already ${order.status} and cannot be updated`, 400);
    }

    return prisma.order.update({ where: { id: orderId }, data: { status } });
  },

  findByVendor: async (
    vendorId: string,
    status: OrderStatus | undefined,
    { skip, limit }: PaginationParams
  ) => {
    const where = {
      vendorId,
      deletedAt: null,
      ...(status && { status }),
    };

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        include: {
          customer: { select: { id: true, name: true, phone: true } },
          _count: { select: { orderItems: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.order.count({ where }),
    ]);

    return { orders, total };
  },
};
