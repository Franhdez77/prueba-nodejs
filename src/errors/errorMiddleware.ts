import type { NextFunction, Request, Response } from 'express';
import { AppError } from './AppError';
/**
 * Adapts an asynchronous Express handler so rejected promises reach the error middleware.
 * @param fn Asynchronous route handler to wrap.
 * @returns An Express handler that forwards rejected promises to `next`.
 */
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) =>
  (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
/**
 * Converts known application and persistence errors into consistent HTTP responses.
 * @param error Error raised while processing the request.
 * @param _req Unused HTTP request.
 * @param res HTTP response used to send the normalized error.
 * @param _next Unused next function required by the Express error-handler signature.
 * @returns Nothing after the error response is sent.
 */
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
