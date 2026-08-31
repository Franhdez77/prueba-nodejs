import type { Transaction } from 'sequelize';
import { sequelize } from '../config/database';
import {
  Clinic,
  Inventory,
  Medicine,
  SupplyRequest,
  User,
  Warehouse,
  type RequestStatus,
} from '../models';

export interface SupplyRequestCreateData {
  clinicId: number;
  medicineId: number;
  warehouseId: number;
  quantity: number;
  requestedBy: number;
  status?: RequestStatus;
}

const requestIncludes = [
  Clinic,
  Medicine,
  Warehouse,
  { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
];

/** Encapsulates all database operations for the supply-request workflow. */
export class SupplyRequestRepository {
  transaction<T>(callback: (transaction: Transaction) => Promise<T>): Promise<T> {
    return sequelize.transaction(callback);
  }

  findActiveClinic(id: number, transaction?: Transaction): Promise<Clinic | null> {
    return Clinic.findOne({ where: { id, active: true }, transaction });
  }

  findActiveMedicine(id: number, transaction: Transaction): Promise<Medicine | null> {
    return Medicine.findOne({ where: { id, active: true }, transaction });
  }

  findActiveWarehouse(id: number, transaction: Transaction): Promise<Warehouse | null> {
    return Warehouse.findOne({ where: { id, active: true }, transaction });
  }

  findInventoryForUpdate(
    warehouseId: number,
    medicineId: number,
    transaction: Transaction,
  ): Promise<Inventory | null> {
    return Inventory.findOne({
      where: { warehouseId, medicineId },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });
  }

  reserveInventory(
    inventory: Inventory,
    quantity: number,
    transaction: Transaction,
  ): Promise<Inventory> {
    return inventory.decrement('quantity', { by: quantity, transaction });
  }

  restoreInventory(
    inventory: Inventory,
    quantity: number,
    transaction: Transaction,
  ): Promise<Inventory> {
    return inventory.increment('quantity', { by: quantity, transaction });
  }

  create(data: SupplyRequestCreateData, transaction: Transaction): Promise<SupplyRequest> {
    return SupplyRequest.create({ ...data, status: data.status ?? 'PENDING' }, { transaction });
  }

  listActive(): Promise<SupplyRequest[]> {
    return SupplyRequest.findAll({
      where: { active: true, status: ['PENDING', 'APPROVED', 'DISPATCHED'] },
      include: requestIncludes,
      order: [['createdAt', 'DESC']],
    });
  }

  listHistory(clinicId?: number): Promise<SupplyRequest[]> {
    return SupplyRequest.findAll({
      where: { active: true, ...(clinicId ? { clinicId } : {}) },
      include: requestIncludes,
      order: [['createdAt', 'DESC']],
    });
  }

  findActiveById(id: number): Promise<SupplyRequest | null> {
    return SupplyRequest.findOne({ where: { id, active: true }, include: requestIncludes });
  }

  findActiveByIdForUpdate(id: number, transaction: Transaction): Promise<SupplyRequest | null> {
    return SupplyRequest.findOne({
      where: { id, active: true },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });
  }

  updateStatus(
    request: SupplyRequest,
    status: RequestStatus,
    transaction: Transaction,
  ): Promise<SupplyRequest> {
    return request.update({ status }, { transaction });
  }

  async deactivate(request: SupplyRequest): Promise<void> {
    await request.update({ active: false });
  }
}
