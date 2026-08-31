import type { Role } from '../models';

declare global {
  namespace Express {
    interface Request {
      user?: { id: number; role: Role };
    }
  }
}
export {};