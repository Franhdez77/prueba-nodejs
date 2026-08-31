import type { Model, ModelStatic } from 'sequelize';

export type ResourceModel = ModelStatic<Model>;

/** Encapsula el acceso a datos común de los catálogos. */
export class ResourceRepository {
  constructor(private readonly model: ResourceModel) {}

  findAllActive(): Promise<Model[]> {
    return this.model.findAll({ where: { active: true } });
  }

  findActiveById(id: number): Promise<Model | null> {
    return this.model.findOne({ where: { id, active: true } });
  }

  create(data: Record<string, unknown>): Promise<Model> {
    return this.model.create(data as never);
  }

  update(item: Model, data: Record<string, unknown>): Promise<Model> {
    return item.update(data as never);
  }

  async deactivate(item: Model): Promise<void> {
    await item.update({ active: false } as never);
  }
}
