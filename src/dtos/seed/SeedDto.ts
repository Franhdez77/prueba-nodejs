import type { Role } from '../../models';
import { AppError } from '../../errors/AppError';
import {
  InputRecord,
  isEmail,
  readNonNegativeInteger,
  readObject,
  readPositiveInteger,
  readString,
} from '../validation';

interface SeedUser {
  name: string;
  email: string;
  password: string;
  role: Role;
}
interface SeedClinic {
  name: string;
  nit: string;
  address: string;
  responsibleName: string;
  responsiblePhone: string;
}
interface SeedWarehouse {
  name: string;
  location: string;
}
interface SeedMedicine {
  name: string;
  sku: string;
  description: string;
}
interface SeedInventory {
  warehouseId: number;
  medicineId: number;
  quantity: number;
}

export interface SeedDto {
  users: SeedUser[];
  clinics: SeedClinic[];
  warehouses: SeedWarehouse[];
  medicines: SeedMedicine[];
  inventories: SeedInventory[];
}

function readArray(data: InputRecord, field: string): unknown[] {
  const value = data[field] ?? [];
  if (!Array.isArray(value)) throw new AppError(400, `${field} must be an array`);
  return value;
}

/**
 * Validates and normalizes every supported collection in a seed document.
 * @param input Parsed JSON value from the uploaded seed file.
 * @returns A validated seed document ready for persistence.
 * @throws {AppError} If a collection or nested record has an invalid structure.
 */
export function validateSeed(input: unknown): SeedDto {
  const data = readObject(input);
  const users = readArray(data, 'users').map((item) => {
    const user = readObject(item);
    const email = readString(user, 'email').toLowerCase();
    if (!isEmail(email)) throw new AppError(400, 'Every user email must be valid');
    if (user.role !== 'ADMIN' && user.role !== 'MANAGER') {
      throw new AppError(400, 'Every user role must be ADMIN or MANAGER');
    }
    const role: Role = user.role;
    return {
      name: readString(user, 'name'),
      email,
      password: readString(user, 'password', 6),
      role,
    };
  });
  const clinics = readArray(data, 'clinics').map((item) => {
    const clinic = readObject(item);
    return {
      name: readString(clinic, 'name'),
      nit: readString(clinic, 'nit'),
      address: readString(clinic, 'address'),
      responsibleName: readString(clinic, 'responsibleName'),
      responsiblePhone: readString(clinic, 'responsiblePhone'),
    };
  });
  const warehouses = readArray(data, 'warehouses').map((item) => {
    const warehouse = readObject(item);
    return {
      name: readString(warehouse, 'name'),
      location: readString(warehouse, 'location'),
    };
  });
  const medicines = readArray(data, 'medicines').map((item) => {
    const medicine = readObject(item);
    const description = medicine.description ?? '';
    if (typeof description !== 'string')
      throw new AppError(400, 'Medicine description must be a string');
    return {
      name: readString(medicine, 'name'),
      sku: readString(medicine, 'sku'),
      description: description.trim(),
    };
  });
  const inventories = readArray(data, 'inventories').map((item) => {
    const inventory = readObject(item);
    return {
      warehouseId: readPositiveInteger(inventory, 'warehouseId'),
      medicineId: readPositiveInteger(inventory, 'medicineId'),
      quantity: readNonNegativeInteger(inventory, 'quantity'),
    };
  });
  return { users, clinics, warehouses, medicines, inventories };
}
