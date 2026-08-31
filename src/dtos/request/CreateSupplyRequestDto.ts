import type { RequestStatus } from '../../models';
import { AppError } from '../../errors/AppError';
import { readObject, readPositiveInteger } from '../validation';

export interface CreateSupplyRequestDto {
  clinicId: number;
  medicineId: number;
  warehouseId: number;
  quantity: number;
  status?: RequestStatus;
}

/**
 * Validates a new supply request and enforces its initial PENDING status.
 * @param input Unknown request payload.
 * @returns Validated supply request data.
 * @throws {AppError} If a field is invalid or the initial status is not PENDING.
 */
export function validateCreateSupplyRequest(input: unknown): CreateSupplyRequestDto {
  const data = readObject(input);
  if (data.status !== undefined && data.status !== 'PENDING') {
    throw new AppError(400, 'Initial status must be PENDING');
  }
  return {
    clinicId: readPositiveInteger(data, 'clinicId'),
    medicineId: readPositiveInteger(data, 'medicineId'),
    warehouseId: readPositiveInteger(data, 'warehouseId'),
    quantity: readPositiveInteger(data, 'quantity'),
    ...(data.status === 'PENDING' ? { status: 'PENDING' as const } : {}),
  };
}
