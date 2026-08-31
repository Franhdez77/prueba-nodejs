import type { Request, Response } from 'express';
import { validateUpsertInventory } from '../dtos/inventory/UpsertInventoryDto';
import {
  ResourceValidator,
  validateClinic,
  validateMedicine,
  validateWarehouse,
} from '../dtos/resource/ResourceDto';
import { readPositiveIntegerParam } from '../dtos/validation';
import { Clinic, Medicine, Warehouse } from '../models';
import type { ResourceModel } from '../repositories/ResourceRepository';
import { InventoryService } from '../services/InventoryService';
import { ResourceService } from '../services/ResourceService';

export const resources = {
  clinics: { model: Clinic, validator: validateClinic },
  warehouses: { model: Warehouse, validator: validateWarehouse },
  medicines: { model: Medicine, validator: validateMedicine },
};

/** Adapta las peticiones HTTP a los casos de uso de catálogos. */

export const list = (model: ResourceModel) => {
  const service = new ResourceService(model);
  return async (_req: Request, res: Response): Promise<void> => {
    res.json(await service.list());
  };
};

export const getOne = (model: ResourceModel) => {
  const service = new ResourceService(model);
  return async (req: Request, res: Response): Promise<void> => {
    res.json(await service.getById(readPositiveIntegerParam(req.params.id)));
  };
};

export const create = (model: ResourceModel, validator: ResourceValidator) => {
  const service = new ResourceService(model);
  return async (req: Request, res: Response): Promise<void> => {
    res.status(201).json(await service.create(validator(req.body)));
  };
};

export const update = (model: ResourceModel, validator: ResourceValidator) => {
  const service = new ResourceService(model);
  return async (req: Request, res: Response): Promise<void> => {
    const id = readPositiveIntegerParam(req.params.id);
    res.json(await service.update(id, validator(req.body, true)));
  };
};

export const remove = (model: ResourceModel) => {
  const service = new ResourceService(model);
  return async (req: Request, res: Response): Promise<void> => {
    await service.remove(readPositiveIntegerParam(req.params.id));
    res.status(204).send();
  };
};

const inventoryService = new InventoryService();

export const upsertInventory = async (req: Request, res: Response): Promise<void> => {
  const result = await inventoryService.upsert(validateUpsertInventory(req.body));
  res.status(result.created ? 201 : 200).json(result.item);
};

export const listInventory = async (_req: Request, res: Response): Promise<void> => {
  res.json(await inventoryService.list());
};
