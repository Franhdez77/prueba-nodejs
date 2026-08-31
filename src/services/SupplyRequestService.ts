import { sequelize } from '../config/database';
import {
  Clinic,
  Inventory,
  Medicine,
  SupplyRequest,
  Warehouse,
  type RequestStatus,
} from '../models';
import { AppError } from '../errors/AppError';

export interface CreateRequestInput {
  clinicId: number;
  medicineId: number;
  warehouseId: number;
  quantity: number;
  requestedBy: number;
  status?: RequestStatus;
}
export const createSupplyRequest = async (data: CreateRequestInput): Promise<SupplyRequest> =>
  sequelize.transaction(async (transaction) => {
    const [clinic, medicine, warehouse] = await Promise.all([
      Clinic.findOne({ where: { id: data.clinicId, active: true }, transaction }),
      Medicine.findOne({ where: { id: data.medicineId, active: true }, transaction }),
      Warehouse.findOne({ where: { id: data.warehouseId, active: true }, transaction }),
    ]);
    if (!clinic) throw new AppError(404, 'Clinic not found');
    if (!medicine) throw new AppError(404, 'Medicine not found');
    if (!warehouse) throw new AppError(404, 'Warehouse not found');
    const inventory = await Inventory.findOne({
      where: { warehouseId: data.warehouseId, medicineId: data.medicineId },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });
    if (!inventory || inventory.quantity < data.quantity)
      throw new AppError(409, 'Insufficient inventory');
    await inventory.decrement('quantity', { by: data.quantity, transaction });
    return SupplyRequest.create({ ...data, status: data.status ?? 'PENDING' }, { transaction });
  });
const transitions: Record<RequestStatus, RequestStatus[]> = {
  PENDING: ['APPROVED', 'REJECTED', 'CANCELLED'],
  APPROVED: ['DISPATCHED', 'CANCELLED'],
  DISPATCHED: ['DELIVERED'],
  DELIVERED: [],
  REJECTED: [],
  CANCELLED: [],
};
export const changeRequestStatus = async (
  id: number,
  status: RequestStatus,
): Promise<SupplyRequest> =>
  sequelize.transaction(async (transaction) => {
    const item = await SupplyRequest.findOne({
      where: { id, active: true },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });
    if (!item) throw new AppError(404, 'Request not found');
    if (!transitions[item.status].includes(status))
      throw new AppError(400, `Invalid transition from ${item.status} to ${status}`);
    if (['REJECTED', 'CANCELLED'].includes(status)) {
      const inventory = await Inventory.findOne({
        where: { warehouseId: item.warehouseId, medicineId: item.medicineId },
        transaction,
        lock: transaction.LOCK.UPDATE,
      });
      if (inventory) await inventory.increment('quantity', { by: item.quantity, transaction });
    }
    await item.update({ status }, { transaction });
    return item;
  });
