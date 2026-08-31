import { readNonNegativeInteger, readObject, readPositiveInteger } from '../validation';

export interface UpsertInventoryDto {
  warehouseId: number;
  medicineId: number;
  quantity: number;
}

/**
 * Validates the identifiers and quantity required to upsert inventory.
 * @param input Unknown request payload.
 * @returns Validated inventory data.
 * @throws {AppError} If an identifier or quantity is invalid.
 */
export function validateUpsertInventory(input: unknown): UpsertInventoryDto {
  const data = readObject(input);
  return {
    warehouseId: readPositiveInteger(data, 'warehouseId'),
    medicineId: readPositiveInteger(data, 'medicineId'),
    quantity: readNonNegativeInteger(data, 'quantity'),
  };
}
