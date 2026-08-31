import type { Role } from '../models';

declare global {
  namespace Express {
    /** Request enriched with the identity decoded by the authentication middleware. */
    interface Request {
      user?: { id: number; role: Role };
    }
  }
}
export {};
