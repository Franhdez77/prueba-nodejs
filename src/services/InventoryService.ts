import type { UpsertInventoryDto } from '../dtos/inventory/UpsertInventoryDto';
import { AppError } from '../errors/AppError';
import type { Inventory } from '../models';
import { InventoryRepository } from '../repositories/InventoryRepository';

export interface InventoryUpsertResult {
  item: Inventory;
  created: boolean;
}

/** Applies inventory business rules independently from the HTTP layer. */
export class InventoryService {
  constructor(private readonly repository = new InventoryRepository()) {}

  /**
   * Creates inventory or replaces its quantity after validating both resources.
   * @param data Warehouse, medicine, and desired quantity.
   * @returns The persisted inventory entry and whether it was newly created.
   * @throws {AppError} If the warehouse or medicine does not exist or is inactive.
   */
  async upsert(data: UpsertInventoryDto): Promise<InventoryUpsertResult> {
    const [warehouse, medicine] = await Promise.all([
      this.repository.findActiveWarehouse(data.warehouseId),
      this.repository.findActiveMedicine(data.medicineId),
    ]);
    if (!warehouse || !medicine) throw new AppError(404, 'Warehouse or medicine not found');

    const existing = await this.repository.findByWarehouseAndMedicine(
      data.warehouseId,
      data.medicineId,
    );
    if (existing) {
      return { item: await this.repository.updateQuantity(existing, data.quantity), created: false };
    }
    return { item: await this.repository.create(data), created: true };
  }

  /** @returns Inventory entries linked to active warehouses and medicines. */
  list(): Promise<Inventory[]> {
    return this.repository.findAllWithActiveResources();
  }
}
