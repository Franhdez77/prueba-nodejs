import type { Request, Response } from 'express';
import { Clinic, Medicine, SupplyRequest, User, Warehouse } from '../models';
import { validateCreateSupplyRequest } from '../dtos/request/CreateSupplyRequestDto';
import { validateUpdateRequestStatus } from '../dtos/request/UpdateRequestStatusDto';
import { AppError } from '../errors/AppError';
import { changeRequestStatus, createSupplyRequest } from '../services/SupplyRequestService';
const include = [
  Clinic,
  Medicine,
  Warehouse,
  { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
];
export const create = async (req: Request, res: Response): Promise<void> => {
  const data = validateCreateSupplyRequest(req.body);
  res.status(201).json(await createSupplyRequest({ ...data, requestedBy: req.user!.id }));
};
export const listActive = async (_req: Request, res: Response): Promise<void> => {
  res.json(
    await SupplyRequest.findAll({
      where: { active: true, status: ['PENDING', 'APPROVED', 'DISPATCHED'] },
      include,
      order: [['createdAt', 'DESC']],
    }),
  );
};
export const history = async (req: Request, res: Response): Promise<void> => {
  const clinicId = req.params.clinicId ? Number(req.params.clinicId) : undefined;
  if (clinicId && !(await Clinic.findOne({ where: { id: clinicId, active: true } })))
    throw new AppError(404, 'Clinic not found');
  res.json(
    await SupplyRequest.findAll({
      where: { active: true, ...(clinicId ? { clinicId } : {}) },
      include,
      order: [['createdAt', 'DESC']],
    }),
  );
};
export const getOne = async (req: Request, res: Response): Promise<void> => {
  const item = await SupplyRequest.findOne({
    where: { id: Number(req.params.id), active: true },
    include,
  });
  if (!item) throw new AppError(404, 'Request not found');
  res.json(item);
};
export const updateStatus = async (req: Request, res: Response): Promise<void> => {
  const { status } = validateUpdateRequestStatus(req.body);
  res.json(await changeRequestStatus(Number(req.params.id), status));
};
export const remove = async (req: Request, res: Response): Promise<void> => {
  const item = await SupplyRequest.findOne({ where: { id: Number(req.params.id), active: true } });
  if (!item) throw new AppError(404, 'Request not found');
  await item.update({ active: false });
  res.status(204).send();
};
