/** Roles that control access to protected operations. */
export type Role = 'ADMIN' | 'MANAGER';
/** Valid states in the supply request workflow. */
export type RequestStatus =
  'PENDING' | 'APPROVED' | 'DISPATCHED' | 'DELIVERED' | 'REJECTED' | 'CANCELLED';
/** Shared fields for soft-deletable, timestamped models. */
export interface BaseAttributes {
  id: number;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
