import type { Request, Response } from 'express';
import { validateCreateSupplyRequest } from '../dtos/request/CreateSupplyRequestDto';
import { validateUpdateRequestStatus } from '../dtos/request/UpdateRequestStatusDto';
import { readPositiveIntegerParam } from '../dtos/validation';
import { SupplyRequestService } from '../services/SupplyRequestService';

const supplyRequestService = new SupplyRequestService();

/**
 * Creates a supply request on behalf of the authenticated user.
 * @param req Authenticated request containing supply data.
 * @param res HTTP response used to return the created request.
 * @returns A promise that resolves after the response is sent.
 */
export const create = async (req: Request, res: Response): Promise<void> => {
  const data = validateCreateSupplyRequest(req.body);
  res.status(201).json(await supplyRequestService.create({ ...data, requestedBy: req.user!.id }));
};

/**
 * Lists requests that are still participating in the active workflow.
 * @param _req Unused HTTP request.
 * @param res HTTP response used to return the request list.
 * @returns A promise that resolves after the response is sent.
 */
export const listActive = async (_req: Request, res: Response): Promise<void> => {
  res.json(await supplyRequestService.listActive());
};

/**
 * Lists request history, optionally scoped to the clinic path parameter.
 * @param req Request that may contain a clinic identifier in its path.
 * @param res HTTP response used to return the request history.
 * @returns A promise that resolves after the response is sent.
 * @throws {AppError} If the specified clinic does not exist.
 */
export const history = async (req: Request, res: Response): Promise<void> => {
  const clinicId = req.params.clinicId
    ? readPositiveIntegerParam(req.params.clinicId, 'clinicId')
    : undefined;
  res.json(await supplyRequestService.history(clinicId));
};

/**
 * Retrieves one active request and its associated resources.
 * @param req Request containing the supply request identifier in its path.
 * @param res HTTP response used to return the request.
 * @returns A promise that resolves after the response is sent.
 * @throws {AppError} If the request does not exist.
 */
export const getOne = async (req: Request, res: Response): Promise<void> => {
  res.json(await supplyRequestService.getById(readPositiveIntegerParam(req.params.id)));
};

/**
 * Applies a validated workflow status transition to a request.
 * @param req Request containing the identifier and target status.
 * @param res HTTP response used to return the updated request.
 * @returns A promise that resolves after the response is sent.
 */
export const updateStatus = async (req: Request, res: Response): Promise<void> => {
  const { status } = validateUpdateRequestStatus(req.body);
  res.json(
    await supplyRequestService.changeStatus(readPositiveIntegerParam(req.params.id), status),
  );
};

/**
 * Soft-deletes an active supply request.
 * @param req Request containing the supply request identifier in its path.
 * @param res HTTP response used to send the empty success response.
 * @returns A promise that resolves after the response is sent.
 * @throws {AppError} If the request does not exist.
 */
export const remove = async (req: Request, res: Response): Promise<void> => {
  await supplyRequestService.remove(readPositiveIntegerParam(req.params.id));
  res.status(204).send();
};
