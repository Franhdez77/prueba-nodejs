import type { Request, Response } from 'express';
import { validateUpsertInventory } from '../dtos/inventory/UpsertInventoryDto';
import {
  ResourceValidator,
  validateClinic,
  validateMedicine,
  validateWarehouse,
} from '../dtos/resource/ResourceDto';
import { readPositiveIntegerParam } from '../dtos/validation';
import { InventoryService } from '../services/InventoryService';
import { resourceServices, type ResourceService } from '../services/ResourceService';

export const resources = {
  clinics: { service: resourceServices.clinics, validator: validateClinic },
  warehouses: { service: resourceServices.warehouses, validator: validateWarehouse },
  medicines: { service: resourceServices.medicines, validator: validateMedicine },
};

/**
 * Creates a request handler that lists active records for a catalog model.
 * @param service Catalog service handled by the generated controller.
 * @returns An Express handler that returns all active records.
 */
export const list = (service: ResourceService) => {
  return async (_req: Request, res: Response): Promise<void> => {
    res.json(await service.list());
  };
};

/**
 * Creates a request handler that retrieves one active catalog record by ID.
 * @param service Catalog service handled by the generated controller.
 * @returns An Express handler that returns the requested record.
 */
export const getOne = (service: ResourceService) => {
  return async (req: Request, res: Response): Promise<void> => {
    res.json(await service.getById(readPositiveIntegerParam(req.params.id)));
  };
};

/**
 * Creates a request handler that validates and persists a catalog record.
 * @param service Catalog service handled by the generated controller.
 * @param validator Validator for the selected catalog payload.
 * @returns An Express handler that returns the created record.
 */
export const create = (service: ResourceService, validator: ResourceValidator) => {
  return async (req: Request, res: Response): Promise<void> => {
    res.status(201).json(await service.create(validator(req.body)));
  };
};

/**
 * Creates a request handler that validates a partial catalog update.
 * @param service Catalog service handled by the generated controller.
 * @param validator Validator for the selected catalog payload.
 * @returns An Express handler that returns the updated record.
 */
export const update = (service: ResourceService, validator: ResourceValidator) => {
  return async (req: Request, res: Response): Promise<void> => {
    const id = readPositiveIntegerParam(req.params.id);
    res.json(await service.update(id, validator(req.body, true)));
  };
};

/**
 * Creates a request handler that soft-deletes a catalog record.
 * @param service Catalog service handled by the generated controller.
 * @returns An Express handler that sends a 204 response.
 */
export const remove = (service: ResourceService) => {
  return async (req: Request, res: Response): Promise<void> => {
    await service.remove(readPositiveIntegerParam(req.params.id));
    res.status(204).send();
  };
};

const inventoryService = new InventoryService();

/**
 * Creates or replaces the quantity for a warehouse and medicine pair.
 * @param req Request containing the inventory payload.
 * @param res HTTP response used to return the inventory entry.
 * @returns A promise that resolves after the response is sent.
 */
export const upsertInventory = async (req: Request, res: Response): Promise<void> => {
  const result = await inventoryService.upsert(validateUpsertInventory(req.body));
  res.status(result.created ? 201 : 200).json(result.item);
};

/**
 * Lists inventory whose warehouse and medicine are both active.
 * @param _req Unused HTTP request.
 * @param res HTTP response used to return inventory entries.
 * @returns A promise that resolves after the response is sent.
 */
export const listInventory = async (_req: Request, res: Response): Promise<void> => {
  res.json(await inventoryService.list());
};
