import bcrypt from 'bcryptjs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { validateSeed, type SeedDto } from '../dtos/seed/SeedDto';
import { AppError } from '../errors/AppError';
import { SeedRepository } from '../repositories/SeedRepository';

export interface SeedCounts {
  users: number;
  clinics: number;
  warehouses: number;
  medicines: number;
  inventories: number;
}

/** Reads, validates, and imports the project's JSON seed file. */
export class SeedService {
  constructor(private readonly repository = new SeedRepository()) {}

  async loadProjectSeed(): Promise<SeedCounts> {
    const data = await this.readProjectSeed();

    await this.repository.transaction(async (transaction) => {
      for (const user of data.users) {
        await this.repository.findOrCreateUser(
          { ...user, password: await bcrypt.hash(user.password, 12) },
          transaction,
        );
      }
      for (const clinic of data.clinics) {
        await this.repository.findOrCreateClinic(clinic, transaction);
      }
      for (const warehouse of data.warehouses) {
        await this.repository.findOrCreateWarehouse(warehouse, transaction);
      }
      for (const medicine of data.medicines) {
        await this.repository.findOrCreateMedicine(medicine, transaction);
      }
      for (const inventory of data.inventories) {
        await this.repository.upsertInventory(inventory, transaction);
      }
    });

    return {
      users: data.users.length,
      clinics: data.clinics.length,
      warehouses: data.warehouses.length,
      medicines: data.medicines.length,
      inventories: data.inventories.length,
    };
  }

  private async readProjectSeed(): Promise<SeedDto> {
    const seedPath = path.resolve(process.cwd(), 'seed.example.json');
    let content: string;
    try {
      content = await readFile(seedPath, 'utf8');
    } catch {
      throw new AppError(500, 'Project seed file could not be read');
    }

    try {
      return validateSeed(JSON.parse(content));
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new AppError(500, 'Project seed file contains invalid JSON');
      }
      throw error;
    }
  }
}
