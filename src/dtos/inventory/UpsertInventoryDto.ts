import { readNonNegativeInteger, readObject, readPositiveInteger } from '../validation';

export interface UpsertInventoryDto {
  warehouseId: number;
  medicineId: number;
  quantity: number;
}

export function validateUpsertInventory(input: unknown): UpsertInventoryDto {
  const data = readObject(input);
  return {
    warehouseId: readPositiveInteger(data, 'warehouseId'),
    medicineId: readPositiveInteger(data, 'medicineId'),
    quantity: readNonNegativeInteger(data, 'quantity'),
  };
}
