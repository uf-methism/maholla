import { Request, Response } from 'express';
import { vendorService } from '../services/vendor.service';
import { asyncHandler } from '../utils/asyncHandler.util';
import { getPaginationParams, sendPaginatedResponse } from '../utils/pagination.util';

/**
 * @swagger
 * /vendors:
 *   post:
 *     summary: Create a new vendor
 *     tags: [Vendors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateVendorInput'
 *     responses:
 *       201:
 *         description: Vendor created successfully
 *       409:
 *         description: Phone number already in use
 */
export const createVendor = asyncHandler(async (req: Request, res: Response) => {
  const vendor = await vendorService.createVendor(req.body);
  res.status(201).json({ status: 'success', data: vendor });
});

/**
 * @swagger
 * /vendors/{id}:
 *   get:
 *     summary: Get a vendor by ID
 *     tags: [Vendors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Vendor details
 *       404:
 *         description: Vendor not found
 */
export const getVendor = asyncHandler(async (req: Request, res: Response) => {
  const vendor = await vendorService.getVendor(req.params.id);
  res.status(200).json({ status: 'success', data: vendor });
});

/**
 * @swagger
 * /vendors/{id}:
 *   patch:
 *     summary: Update a vendor
 *     tags: [Vendors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateVendorInput'
 *     responses:
 *       200:
 *         description: Vendor updated
 *       404:
 *         description: Vendor not found
 */
export const updateVendor = asyncHandler(async (req: Request, res: Response) => {
  const vendor = await vendorService.updateVendor(req.params.id, req.body);
  res.status(200).json({ status: 'success', data: vendor });
});

/**
 * @swagger
 * /vendors/{id}:
 *   delete:
 *     summary: Soft-delete a vendor
 *     tags: [Vendors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Vendor deleted
 *       404:
 *         description: Vendor not found
 */
export const deleteVendor = asyncHandler(async (req: Request, res: Response) => {
  await vendorService.deleteVendor(req.params.id);
  res.status(204).send();
});

/**
 * @swagger
 * /vendors/nearby:
 *   get:
 *     summary: List vendors near a location
 *     tags: [Vendors]
 *     parameters:
 *       - in: query
 *         name: lat
 *         required: true
 *         schema:
 *           type: number
 *       - in: query
 *         name: lng
 *         required: true
 *         schema:
 *           type: number
 *       - in: query
 *         name: radius
 *         schema:
 *           type: number
 *           default: 5
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
 *         description: List of nearby vendors
 */
export const getNearbyVendors = asyncHandler(async (req: Request, res: Response) => {
  const lat = parseFloat(req.query.lat as string);
  const lng = parseFloat(req.query.lng as string);
  const radius = parseFloat((req.query.radius as string) || '5');
  const search = req.query.search as string | undefined;
  const pagination = getPaginationParams(req);

  const { vendors, total } = await vendorService.getNearbyVendors(
    lat,
    lng,
    radius,
    search,
    pagination
  );

  sendPaginatedResponse(res, vendors, total, pagination);
});
