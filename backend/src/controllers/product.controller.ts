import { Request, Response } from 'express';
import { productService } from '../services/product.service';
import { asyncHandler } from '../utils/asyncHandler.util';
import { getPaginationParams, sendPaginatedResponse } from '../utils/pagination.util';

/**
 * @swagger
 * /vendors/{vendorId}/products:
 *   post:
 *     summary: Add a new product to a vendor
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: vendorId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProductInput'
 *     responses:
 *       201:
 *         description: Product added successfully
 *       404:
 *         description: Vendor not found
 */
export const addProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await productService.createProduct(req.params.vendorId as string, req.body);
  res.status(201).json({ status: 'success', data: product });
});

/**
 * @swagger
 * /vendors/{vendorId}/products/{productId}:
 *   patch:
 *     summary: Update product details
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: vendorId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProductInput'
 *     responses:
 *       200:
 *         description: Product updated
 *       404:
 *         description: Product or Vendor not found
 */
export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await productService.updateProduct(
    req.params.vendorId as string,
    req.params.productId as string,
    req.body
  );
  res.status(200).json({ status: 'success', data: product });
});

/**
 * @swagger
 * /vendors/{vendorId}/products/{productId}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: vendorId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Product deleted
 *       404:
 *         description: Product or Vendor not found
 */
export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  await productService.deleteProduct(req.params.vendorId as string, req.params.productId as string);
  res.status(204).send();
});

/**
 * @swagger
 * /vendors/{vendorId}/products:
 *   get:
 *     summary: Get all products for a vendor
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: vendorId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
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
 *         description: List of vendor products
 */
export const getVendorProducts = asyncHandler(async (req: Request, res: Response) => {
  const search = req.query.search as string | undefined;
  const pagination = getPaginationParams(req);

  const { products, total } = await productService.getVendorProducts(
    req.params.vendorId as string,
    search,
    pagination
  );

  sendPaginatedResponse(res, products, total, pagination);
});
