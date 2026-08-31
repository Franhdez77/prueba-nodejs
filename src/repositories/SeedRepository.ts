import type { Transaction } from 'sequelize';
import { sequelize } from '../config/database';
import { Clinic, Inventory, Medicine, User, Warehouse } from '../models';
import type { ClinicAttributes } from '../models/Clinic';
import type { InventoryAttributes } from '../models/Inventory';
import type { MedicineAttributes } from '../models/Medicine';
import type { UserAttributes } from '../models/User';
import type { WarehouseAttributes } from '../models/Warehouse';

type SeedUser = Omit<UserAttributes, 'id' | 'active'>;
type SeedClinic = Omit<ClinicAttributes, 'id' | 'active'>;
type SeedWarehouse = Omit<WarehouseAttributes, 'id' | 'active'>;
type SeedMedicine = Omit<MedicineAttributes, 'id' | 'active'>;
type SeedInventory = Omit<InventoryAttributes, 'id'>;

/** Encapsulates all persistence operations used by the project seeder. */
export class SeedRepository {
  transaction<T>(callback: (transaction: Transaction) => Promise<T>): Promise<T> {
    return sequelize.transaction(callback);
  }

  async findOrCreateUser(
    data: SeedUser,
    transaction: Transaction,
  ): Promise<void> {
    await User.findOrCreate({ where: { email: data.email }, defaults: data, transaction });
  }

  async findOrCreateClinic(
    data: SeedClinic,
    transaction: Transaction,
  ): Promise<void> {
    await Clinic.findOrCreate({ where: { nit: data.nit }, defaults: data, transaction });
  }

  async findOrCreateWarehouse(
    data: SeedWarehouse,
    transaction: Transaction,
  ): Promise<void> {
    await Warehouse.findOrCreate({ where: { name: data.name }, defaults: data, transaction });
  }

  async findOrCreateMedicine(
    data: SeedMedicine,
    transaction: Transaction,
  ): Promise<void> {
    await Medicine.findOrCreate({ where: { sku: data.sku }, defaults: data, transaction });
  }

  async upsertInventory(
    data: SeedInventory,
    transaction: Transaction,
  ): Promise<void> {
    await Inventory.upsert(data, { transaction });
  }
}
