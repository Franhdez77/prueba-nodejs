import { AppError } from '../errors/AppError';

export type InputRecord = Record<string, unknown>;

/**
 * Ensures that an incoming value is a plain request object.
 * @param input Unknown value received from the client.
 * @returns The value as a key-value input record.
 * @throws {AppError} If the value is null, an array, or not an object.
 */
export function readObject(input: unknown): InputRecord {
  if (typeof input !== 'object' || input === null || Array.isArray(input)) {
    throw new AppError(400, 'Request body must be an object');
  }
  return input as InputRecord;
}

/**
 * Reads and trims a required string field with a minimum length.
 * @param data Input record containing the field.
 * @param field Name of the field to read.
 * @param minimumLength Minimum accepted trimmed length.
 * @returns The normalized string.
 * @throws {AppError} If the field is missing, not a string, or too short.
 */
export function readString(data: InputRecord, field: string, minimumLength = 1): string {
  const value = data[field];
  if (typeof value !== 'string' || value.trim().length < minimumLength) {
    throw new AppError(400, `${field} must contain at least ${minimumLength} characters`);
  }
  return value.trim();
}

/**
 * Reads a field that must be a positive integer.
 * @param data Input record containing the field.
 * @param field Name of the field to read.
 * @returns The validated positive integer.
 * @throws {AppError} If the field is not a positive integer.
 */
export function readPositiveInteger(data: InputRecord, field: string): number {
  const value = data[field];
  if (typeof value !== 'number' || !Number.isInteger(value) || value <= 0) {
    throw new AppError(400, `${field} must be a positive integer`);
  }
  return value;
}

/**
 * Reads a field that must be a non-negative integer.
 * @param data Input record containing the field.
 * @param field Name of the field to read.
 * @returns The validated non-negative integer.
 * @throws {AppError} If the field is not a non-negative integer.
 */
export function readNonNegativeInteger(data: InputRecord, field: string): number {
  const value = data[field];
  if (typeof value !== 'number' || !Number.isInteger(value) || value < 0) {
    throw new AppError(400, `${field} must be a non-negative integer`);
  }
  return value;
}

/**
 * Parses and validates a positive integer received as a route parameter.
 * @param value Raw route parameter value.
 * @param field Name used in validation errors.
 * @returns The parsed positive integer.
 * @throws {AppError} If the value is not a safe positive integer.
 */
export function readPositiveIntegerParam(value: unknown, field = 'id'): number {
  const parsed = typeof value === 'string' && /^\d+$/.test(value) ? Number(value) : NaN;
  if (!Number.isSafeInteger(parsed) || parsed <= 0) {
    throw new AppError(400, `${field} must be a positive integer`);
  }
  return parsed;
}

/**
 * Performs a lightweight structural check for an email address.
 * @param value Email candidate.
 * @returns Whether the value has a valid email structure.
 */
export function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
