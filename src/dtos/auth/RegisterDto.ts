import { AppError } from '../../errors/AppError';
import type { Role } from '../../models';
import { isEmail, readObject, readString } from '../validation';

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  role: Role;
}

export function validateRegister(input: unknown): RegisterDto {
  const data = readObject(input);
  const name = readString(data, 'name', 2);
  const email = readString(data, 'email').toLowerCase();
  const password = readString(data, 'password', 6);
  if (!isEmail(email)) throw new AppError(400, 'email must be valid');
  if (data.role !== 'ADMIN' && data.role !== 'MANAGER') {
    throw new AppError(400, 'role must be ADMIN or MANAGER');
  }
  return { name, email, password, role: data.role };
}
