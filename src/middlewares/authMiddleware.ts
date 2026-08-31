import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import type { Role } from '../models';
import { AppError } from '../errors/AppError';

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
export const authorize =
  (...roles: Role[]) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role))
      return next(new AppError(403, 'Insufficient permissions'));
    next();
  };
