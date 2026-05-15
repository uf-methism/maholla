import { OrderStatus } from '@prisma/client';
import { orderRepository } from '../repositories/order.repository';
import { CreateOrderInput } from '../validators/api.validators';
import { PaginationParams } from '../utils/pagination.util';

export const orderService = {
  createOrder: async (data: CreateOrderInput) => {
    return orderRepository.create(data);
  },

  getOrder: async (orderId: string) => {
    return orderRepository.findById(orderId);
  },

  updateOrderStatus: async (orderId: string, status: OrderStatus) => {
    return orderRepository.updateStatus(orderId, status);
  },

  getVendorOrders: async (
    vendorId: string,
    status: OrderStatus | undefined,
    pagination: PaginationParams
  ) => {
    return orderRepository.findByVendor(vendorId, status, pagination);
  },
};
