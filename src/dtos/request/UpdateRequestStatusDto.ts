import type { RequestStatus } from '../../models';
import { AppError } from '../../errors/AppError';
import { readObject } from '../validation';

const statuses: RequestStatus[] = [
  'PENDING',
  'APPROVED',
  'DISPATCHED',
  'DELIVERED',
  'REJECTED',
  'CANCELLED',
];

export interface UpdateRequestStatusDto {
  status: RequestStatus;
}

export function validateUpdateRequestStatus(input: unknown): UpdateRequestStatusDto {
  const data = readObject(input);
  if (typeof data.status !== 'string' || !statuses.includes(data.status as RequestStatus)) {
    throw new AppError(400, 'Invalid request status');
  }
  return { status: data.status as RequestStatus };
}
