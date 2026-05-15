import { Request, Response } from 'express';

export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

export const getPaginationParams = (req: Request): PaginationParams => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

export const sendPaginatedResponse = <T>(
  res: Response,
  data: T[],
  total: number,
  { page, limit }: PaginationParams
) => {
  const totalPages = Math.ceil(total / limit);
  res.status(200).json({
    status: 'success',
    data,
    meta: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  });
};
