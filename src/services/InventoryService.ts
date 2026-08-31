import type { UpsertInventoryDto } from '../dtos/inventory/UpsertInventoryDto';
import { AppError } from '../errors/AppError';
import type { Inventory } from '../models';
import { InventoryRepository } from '../repositories/InventoryRepository';

export interface InventoryUpsertResult {
  item: Inventory;
  created: boolean;
}

/** Aplica las reglas de negocio de existencias sin depender de Express. */
export class InventoryService {
  constructor(private readonly repository = new InventoryRepository()) {}

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

  list(): Promise<Inventory[]> {
    return this.repository.findAllWithActiveResources();
  }
}
