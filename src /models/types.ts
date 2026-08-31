export type Role = 'ADMIN' | 'MANAGER';
export type RequestStatus =
  'PENDING' | 'APPROVED' | 'DISPATCHED' | 'DELIVERED' | 'REJECTED' | 'CANCELLED';
export interface BaseAttributes {
  id: number;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}