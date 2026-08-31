import { AppError } from '../errors/AppError';
import type { SupplyRequest, RequestStatus } from '../models';
import {
  SupplyRequestRepository,
  type SupplyRequestCreateData,
} from '../repositories/SupplyRequestRepository';

export type CreateRequestInput = SupplyRequestCreateData;

const transitions: Record<RequestStatus, RequestStatus[]> = {
  PENDING: ['APPROVED', 'REJECTED', 'CANCELLED'],
  APPROVED: ['DISPATCHED', 'CANCELLED'],
  DISPATCHED: ['DELIVERED'],
  DELIVERED: [],
  REJECTED: [],
  CANCELLED: [],
};

/** Applies the business rules for supply requests and inventory reservations. */
export class SupplyRequestService {
  constructor(private readonly repository = new SupplyRequestRepository()) {}

  async create(data: CreateRequestInput): Promise<SupplyRequest> {
    return this.repository.transaction(async (transaction) => {
      const [clinic, medicine, warehouse] = await Promise.all([
        this.repository.findActiveClinic(data.clinicId, transaction),
        this.repository.findActiveMedicine(data.medicineId, transaction),
        this.repository.findActiveWarehouse(data.warehouseId, transaction),
      ]);
      if (!clinic) throw new AppError(404, 'Clinic not found');
      if (!medicine) throw new AppError(404, 'Medicine not found');
      if (!warehouse) throw new AppError(404, 'Warehouse not found');

      const inventory = await this.repository.findInventoryForUpdate(
        data.warehouseId,
        data.medicineId,
        transaction,
      );
      if (!inventory || inventory.quantity < data.quantity) {
        throw new AppError(409, 'Insufficient inventory');
      }

      await this.repository.reserveInventory(inventory, data.quantity, transaction);
      return this.repository.create(data, transaction);
    });
  }

  listActive(): Promise<SupplyRequest[]> {
    return this.repository.listActive();
  }

  async history(clinicId?: number): Promise<SupplyRequest[]> {
    if (clinicId && !(await this.repository.findActiveClinic(clinicId))) {
      throw new AppError(404, 'Clinic not found');
    }
    return this.repository.listHistory(clinicId);
  }

  async getById(id: number): Promise<SupplyRequest> {
    const request = await this.repository.findActiveById(id);
    if (!request) throw new AppError(404, 'Request not found');
    return request;
  }

  async changeStatus(id: number, status: RequestStatus): Promise<SupplyRequest> {
    return this.repository.transaction(async (transaction) => {
      const request = await this.repository.findActiveByIdForUpdate(id, transaction);
      if (!request) throw new AppError(404, 'Request not found');
      if (!transitions[request.status].includes(status)) {
        throw new AppError(400, `Invalid transition from ${request.status} to ${status}`);
      }

      if (status === 'REJECTED' || status === 'CANCELLED') {
        const inventory = await this.repository.findInventoryForUpdate(
          request.warehouseId,
          request.medicineId,
          transaction,
        );
        if (inventory) {
          await this.repository.restoreInventory(inventory, request.quantity, transaction);
        }
      }

      return this.repository.updateStatus(request, status, transaction);
    });
  }

  async remove(id: number): Promise<void> {
    await this.repository.deactivate(await this.getById(id));
  }
}
