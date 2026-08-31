import type { Request, Response } from 'express';
import { SeedService } from '../services/SeedService';

const seedService = new SeedService();

/**
 * Imports validated seed data from the project's JSON file in a single transaction.
 * Existing records identified by their natural unique keys are left unchanged.
 *
 * @param _req Unused HTTP request.
 * @param res HTTP response used to return the processed record counts.
 * @returns A promise that resolves after the import response is sent.
 * @throws {AppError} If the project seed file cannot be read, parsed, or validated.
 */
export const loadSeed = async (_req: Request, res: Response): Promise<void> => {
  const counts = await seedService.loadProjectSeed();
  res.status(201).json({ message: 'Seed imported successfully', processed: counts });
};
