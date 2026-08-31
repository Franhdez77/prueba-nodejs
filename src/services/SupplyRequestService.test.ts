import type { Inventory, SupplyRequest } from '../models';
import type { SupplyRequestRepository } from '../repositories/SupplyRequestRepository';
import { SupplyRequestService } from './SupplyRequestService';

describe('supply request service', () => {
  const transaction = { LOCK: { UPDATE: 'UPDATE' } };
  const repository = {
    transaction: jest.fn((callback: (value: unknown) => unknown) => callback(transaction)),
    findActiveClinic: jest.fn(),
    findActiveMedicine: jest.fn(),
    findActiveWarehouse: jest.fn(),
    findInventoryForUpdate: jest.fn(),
    reserveInventory: jest.fn(),
    restoreInventory: jest.fn(),
    create: jest.fn(),
    findActiveByIdForUpdate: jest.fn(),
    updateStatus: jest.fn(),
  };
  const service = new SupplyRequestService(repository as unknown as SupplyRequestRepository);

  beforeEach(() => jest.clearAllMocks());

  test('creates a request and reserves inventory', async () => {
    repository.findActiveClinic.mockResolvedValue({});
    repository.findActiveMedicine.mockResolvedValue({});
    repository.findActiveWarehouse.mockResolvedValue({});
    const inventory = { quantity: 20 } as Inventory;
    repository.findInventoryForUpdate.mockResolvedValue(inventory);
    repository.reserveInventory.mockResolvedValue(inventory);
    repository.create.mockResolvedValue({ id: 1 });

    await expect(
      service.create({
        clinicId: 1,
        medicineId: 1,
        warehouseId: 1,
        quantity: 5,
        requestedBy: 1,
      }),
    ).resolves.toEqual({ id: 1 });

    expect(repository.reserveInventory).toHaveBeenCalledWith(inventory, 5, transaction);
  });

  test('rejects a request with insufficient inventory', async () => {
    repository.findActiveClinic.mockResolvedValue({});
    repository.findActiveMedicine.mockResolvedValue({});
    repository.findActiveWarehouse.mockResolvedValue({});
    repository.findInventoryForUpdate.mockResolvedValue({ quantity: 2 });

    await expect(
      service.create({
        clinicId: 1,
        medicineId: 1,
        warehouseId: 1,
        quantity: 5,
        requestedBy: 1,
      }),
    ).rejects.toMatchObject({ statusCode: 409 });

    expect(repository.reserveInventory).not.toHaveBeenCalled();
  });

  test('changes status following the workflow', async () => {
    const request = { status: 'PENDING' } as SupplyRequest;
    repository.findActiveByIdForUpdate.mockResolvedValue(request);
    repository.updateStatus.mockResolvedValue({ ...request, status: 'APPROVED' });

    await service.changeStatus(1, 'APPROVED');

    expect(repository.updateStatus).toHaveBeenCalledWith(request, 'APPROVED', transaction);
  });
});
