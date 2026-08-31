import type { Model } from 'sequelize';
import { AppError } from '../errors/AppError';
import { ResourceModel, ResourceRepository } from '../repositories/ResourceRepository';

/** Contiene las reglas de negocio comunes de los catálogos. */
export class ResourceService {
  private readonly repository: ResourceRepository;

  constructor(model: ResourceModel) {
    this.repository = new ResourceRepository(model);
  }

  list(): Promise<Model[]> {
    return this.repository.findAllActive();
  }

  async getById(id: number): Promise<Model> {
    const item = await this.repository.findActiveById(id);
    if (!item) throw new AppError(404, 'Resource not found');
    return item;
  }

  create(data: Record<string, unknown>): Promise<Model> {
    return this.repository.create(data);
  }

  async update(id: number, data: Record<string, unknown>): Promise<Model> {
    return this.repository.update(await this.getById(id), data);
  }

  async remove(id: number): Promise<void> {
    await this.repository.deactivate(await this.getById(id));
  }
}
