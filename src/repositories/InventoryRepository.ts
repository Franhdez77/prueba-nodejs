import { Inventory, Medicine, Warehouse } from '../models';
import type { InventoryAttributes } from '../models/Inventory';

type InventoryData = Omit<InventoryAttributes, 'id'>;

/** Encapsulates persistence operations related to inventory. */
export class InventoryRepository {
  /**
   * @param id Warehouse identifier.
   * @returns The active warehouse or `null`.
   */
  findActiveWarehouse(id: number): Promise<Warehouse | null> {
    return Warehouse.findOne({ where: { id, active: true } });
  }

  /**
   * @param id Medicine identifier.
   * @returns The active medicine or `null`.
   */
  findActiveMedicine(id: number): Promise<Medicine | null> {
    return Medicine.findOne({ where: { id, active: true } });
  }

  /**
   * @param warehouseId Warehouse identifier.
   * @param medicineId Medicine identifier.
   * @returns The matching inventory entry or `null`.
   */
  findByWarehouseAndMedicine(warehouseId: number, medicineId: number): Promise<Inventory | null> {
    return Inventory.findOne({ where: { warehouseId, medicineId } });
  }

  /**
   * @param data Inventory attributes to persist.
   * @returns The created inventory entry.
   */
  create(data: InventoryData): Promise<Inventory> {
    return Inventory.create(data);
  }

  /**
   * @param item Inventory entity to update.
   * @param quantity New stock quantity.
   * @returns The updated inventory entry.
   */
  updateQuantity(item: Inventory, quantity: number): Promise<Inventory> {
    return item.update({ quantity });
  }

  /** @returns Inventory entries whose associated resources are active. */
  findAllWithActiveResources(): Promise<Inventory[]> {
    return Inventory.findAll({
      include: [
        { model: Warehouse, where: { active: true } },
        { model: Medicine, where: { active: true } },
      ],
    });
  }
}
