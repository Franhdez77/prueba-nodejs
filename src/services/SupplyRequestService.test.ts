jest.mock('../config/database', () => ({
  sequelize: {
    transaction: jest.fn((callback: (transaction: object) => unknown) =>
      callback({ LOCK: { UPDATE: 'UPDATE' } }),
    ),
  },
}));
jest.mock('../models', () => ({
  Clinic: { findOne: jest.fn() },
  Medicine: { findOne: jest.fn() },
  Warehouse: { findOne: jest.fn() },
  Inventory: { findOne: jest.fn() },
  SupplyRequest: { create: jest.fn(), findOne: jest.fn() },
}));
import { Clinic, Inventory, Medicine, SupplyRequest, Warehouse } from '../models';
import { changeRequestStatus, createSupplyRequest } from './SupplyRequestService';
const mock = (fn: unknown) => fn as jest.Mock;
describe('request service', () => {
  beforeEach(() => jest.clearAllMocks());
  test('creates a request and reserves inventory', async () => {
    mock(Clinic.findOne).mockResolvedValue({});
    mock(Medicine.findOne).mockResolvedValue({});
    mock(Warehouse.findOne).mockResolvedValue({});
    const inventory = { quantity: 20, decrement: jest.fn() };
    mock(Inventory.findOne).mockResolvedValue(inventory);
    mock(SupplyRequest.create).mockResolvedValue({ id: 1 });
    await expect(
      createSupplyRequest({
        clinicId: 1,
        medicineId: 1,
        warehouseId: 1,
        quantity: 5,
        requestedBy: 1,
      }),
    ).resolves.toEqual({ id: 1 });
    expect(inventory.decrement).toHaveBeenCalledWith(
      'quantity',
      expect.objectContaining({ by: 5 }),
    );
  });
  test('rejects request with insufficient inventory', async () => {
    mock(Clinic.findOne).mockResolvedValue({});
    mock(Medicine.findOne).mockResolvedValue({});
    mock(Warehouse.findOne).mockResolvedValue({});
    mock(Inventory.findOne).mockResolvedValue({ quantity: 2 });
    await expect(
      createSupplyRequest({
        clinicId: 1,
        medicineId: 1,
        warehouseId: 1,
        quantity: 5,
        requestedBy: 1,
      }),
    ).rejects.toMatchObject({ statusCode: 409 });
  });
  test('changes status following workflow', async () => {
    const item = { status: 'PENDING', update: jest.fn().mockResolvedValue(undefined) };
    mock(SupplyRequest.findOne).mockResolvedValue(item);
    await changeRequestStatus(1, 'APPROVED');
    expect(item.update).toHaveBeenCalledWith({ status: 'APPROVED' }, expect.anything());
  });
});
