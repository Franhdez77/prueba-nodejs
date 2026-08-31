import type { Model, ModelStatic } from 'sequelize';

export type ResourceModel = ModelStatic<Model>;

/** Encapsulates common persistence operations for catalog models. */
export class ResourceRepository {
  constructor(private readonly model: ResourceModel) {}

  /** @returns All active records from the configured model. */
  findAllActive(): Promise<Model[]> {
    return this.model.findAll({ where: { active: true } });
  }

  /**
   * @param id Record identifier.
   * @returns The active record or `null`.
   */
  findActiveById(id: number): Promise<Model | null> {
    return this.model.findOne({ where: { id, active: true } });
  }

  /**
   * @param data Validated fields to persist.
   * @returns The created record.
   */
  create(data: Record<string, unknown>): Promise<Model> {
    return this.model.create(data as never);
  }

  /**
   * @param item Record to update.
   * @param data Validated fields to persist.
   * @returns The updated record.
   */
  update(item: Model, data: Record<string, unknown>): Promise<Model> {
    return item.update(data as never);
  }

  /**
   * @param item Record to deactivate.
   * @returns A promise resolved after persistence.
   */
  async deactivate(item: Model): Promise<void> {
    await item.update({ active: false } as never);
  }
}
