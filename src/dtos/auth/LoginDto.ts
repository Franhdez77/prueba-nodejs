import { AppError } from '../../errors/AppError';
import { isEmail, readObject, readString } from '../validation';

export interface LoginDto {
  email: string;
  password: string;
}

/**
 * Validates and normalizes an authentication request body.
 * @param input Unknown request payload.
 * @returns Validated login credentials with a normalized email.
 * @throws {AppError} If a required credential is missing or invalid.
 */
export function validateLogin(input: unknown): LoginDto {
  const data = readObject(input);
  const email = readString(data, 'email').toLowerCase();
  const password = readString(data, 'password');
  if (!isEmail(email)) throw new AppError(400, 'email must be valid');
  return { email, password };
}
