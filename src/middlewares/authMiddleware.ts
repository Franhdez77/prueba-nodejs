import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import type { Role } from '../models';
import { AppError } from '../errors/AppError';

/**
 * Verifies a bearer token and attaches its authenticated identity to the request.
 * @param req Request expected to contain an Authorization header.
 * @param _res Unused HTTP response.
 * @param next Function that continues the chain or receives an authentication error.
 * @returns Nothing after delegating control to the next middleware.
 */
export const authenticate = (req: Request, _res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.startsWith('Bearer ')
    ? req.headers.authorization.slice(7)
    : undefined;
  if (!token) return next(new AppError(401, 'Authentication token required'));
  try {
    req.user = jwt.verify(token, env.jwtSecret) as { id: number; role: Role };
    next();
  } catch {
    next(new AppError(401, 'Invalid or expired token'));
  }
};
/**
 * Restricts a route to authenticated users whose role is explicitly allowed.
 * @param roles Roles allowed to access the route.
 * @returns Express authorization middleware.
 */
export const authorize =
  (...roles: Role[]) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role))
      return next(new AppError(403, 'Insufficient permissions'));
    next();
  };
