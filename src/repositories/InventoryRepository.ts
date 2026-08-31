import type { UpsertInventoryDto } from '../dtos/inventory/UpsertInventoryDto';
import { Inventory, Medicine, Warehouse } from '../models';

/** Encapsula todas las consultas relacionadas con existencias. */
export class InventoryRepository {
  findActiveWarehouse(id: number): Promise<Warehouse | null> {
    return Warehouse.findOne({ where: { id, active: true } });
  }

  findActiveMedicine(id: number): Promise<Medicine | null> {
    return Medicine.findOne({ where: { id, active: true } });
  }

  findByWarehouseAndMedicine(warehouseId: number, medicineId: number): Promise<Inventory | null> {
    return Inventory.findOne({ where: { warehouseId, medicineId } });
  }

  create(data: UpsertInventoryDto): Promise<Inventory> {
    return Inventory.create(data);
  }

  updateQuantity(item: Inventory, quantity: number): Promise<Inventory> {
    return item.update({ quantity });
  }

  findAllWithActiveResources(): Promise<Inventory[]> {
    return Inventory.findAll({
      include: [
        { model: Warehouse, where: { active: true } },
        { model: Medicine, where: { active: true } },
      ],
    });
  }
}
