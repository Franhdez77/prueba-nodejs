import type { Model } from 'sequelize';
import { AppError } from '../errors/AppError';
import { Clinic, Medicine, Warehouse } from '../models';
import { ResourceModel, ResourceRepository } from '../repositories/ResourceRepository';

/** Contains reusable business rules for soft-deletable catalog resources. */
export class ResourceService {
  private readonly repository: ResourceRepository;

  constructor(model: ResourceModel) {
    this.repository = new ResourceRepository(model);
  }

  /** @returns All active records for the configured catalog model. */
  list(): Promise<Model[]> {
    return this.repository.findAllActive();
  }

  /**
   * Retrieves an active record.
   * @param id Identifier of the requested record.
   * @returns The active catalog record.
   * @throws {AppError} If the record does not exist or is inactive.
   */
  async getById(id: number): Promise<Model> {
    const item = await this.repository.findActiveById(id);
    if (!item) throw new AppError(404, 'Resource not found');
    return item;
  }

  /**
   * Persists a previously validated catalog record.
   * @param data Validated fields for the new record.
   * @returns The created catalog record.
   */
  create(data: Record<string, unknown>): Promise<Model> {
    return this.repository.create(data);
  }

  /**
   * Updates an active record with previously validated fields.
   * @param id Identifier of the record to update.
   * @param data Validated fields to persist.
   * @returns The updated catalog record.
   * @throws {AppError} If the record does not exist or is inactive.
   */
  async update(id: number, data: Record<string, unknown>): Promise<Model> {
    return this.repository.update(await this.getById(id), data);
  }

  /**
   * Soft-deletes an active record.
   * @param id Identifier of the record to deactivate.
   * @returns A promise that resolves after the record is deactivated.
   * @throws {AppError} If the record does not exist or is inactive.
   */
  async remove(id: number): Promise<void> {
    await this.repository.deactivate(await this.getById(id));
  }
}

/** Catalog services exposed to the HTTP layer without exposing Sequelize models. */
export const resourceServices = {
  clinics: new ResourceService(Clinic),
  warehouses: new ResourceService(Warehouse),
  medicines: new ResourceService(Medicine),
};
