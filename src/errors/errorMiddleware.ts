import type { NextFunction, Request, Response } from 'express';
import { AppError } from './AppError';
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) =>
  (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({ message: error.message });
    return;
  }
  const err = error as { name?: string; message?: string; errors?: Array<{ message: string }> };
  if (err.name === 'SequelizeUniqueConstraintError') {
    res.status(409).json({ message: err.errors?.[0]?.message ?? 'Duplicate record' });
    return;
  }
  console.error(error);
  res.status(500).json({ message: 'Internal server error' });
};
