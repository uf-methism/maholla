import { Request, Response } from 'express';
import { OrderStatus } from '@prisma/client';
import { orderService } from '../services/order.service';
import { asyncHandler } from '../utils/asyncHandler.util';
import { getPaginationParams, sendPaginatedResponse } from '../utils/pagination.util';

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOrderInput'
 *     responses:
 *       201:
 *         description: Order created successfully
 *       404:
 *         description: Vendor not found
 */
export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const order = await orderService.createOrder(req.body);
  res.status(201).json({ status: 'success', data: order });
});

/**
 * @swagger
 * /orders/{orderId}/status:
 *   patch:
 *     summary: Update an order's status
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateOrderStatusInput'
 *     responses:
 *       200:
 *         description: Order status updated
 *       400:
 *         description: Invalid status transition
 *       404:
 *         description: Order not found
 */
export const updateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
  const order = await orderService.updateOrderStatus(req.params.orderId as string, req.body.status as OrderStatus);
  res.status(200).json({ status: 'success', data: order });
});

/**
 * @swagger
 * /vendors/{vendorId}/orders:
 *   get:
 *     summary: Get all orders for a vendor
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: vendorId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, accepted, preparing, ready, completed, cancelled]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of vendor orders
 */
export const getVendorOrders = asyncHandler(async (req: Request, res: Response) => {
  const status = req.query.status as OrderStatus | undefined;
  const pagination = getPaginationParams(req);

  const { orders, total } = await orderService.getVendorOrders(
    req.params.vendorId as string,
    status,
    pagination
  );

  sendPaginatedResponse(res, orders, total, pagination);
});
