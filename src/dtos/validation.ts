import { AppError } from '../errors/AppError';

export type InputRecord = Record<string, unknown>;

export function readObject(input: unknown): InputRecord {
  if (typeof input !== 'object' || input === null || Array.isArray(input)) {
    throw new AppError(400, 'Request body must be an object');
  }
  return input as InputRecord;
}

export function readString(data: InputRecord, field: string, minimumLength = 1): string {
  const value = data[field];
  if (typeof value !== 'string' || value.trim().length < minimumLength) {
    throw new AppError(400, `${field} must contain at least ${minimumLength} characters`);
  }
  return value.trim();
}

export function readPositiveInteger(data: InputRecord, field: string): number {
  const value = data[field];
  if (typeof value !== 'number' || !Number.isInteger(value) || value <= 0) {
    throw new AppError(400, `${field} must be a positive integer`);
  }
  return value;
}

export function readNonNegativeInteger(data: InputRecord, field: string): number {
  const value = data[field];
  if (typeof value !== 'number' || !Number.isInteger(value) || value < 0) {
    throw new AppError(400, `${field} must be a non-negative integer`);
  }
  return value;
}

export function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
