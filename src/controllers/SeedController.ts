import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { sequelize } from '../config/database';
import { validateSeed } from '../dtos/seed/SeedDto';
import { Clinic, Inventory, Medicine, User, Warehouse } from '../models';
import { AppError } from '../errors/AppError';
export const uploadSeed = async (req: Request, res: Response): Promise<void> => {
  if (!req.file) throw new AppError(400, 'A JSON file is required');
  let raw: unknown;
  try {
    raw = JSON.parse(req.file.buffer.toString('utf8'));
  } catch {
    throw new AppError(400, 'Invalid JSON file');
  }
  const data = validateSeed(raw);
  const counts = await sequelize.transaction(async (transaction) => {
    for (const u of data.users)
      await User.findOrCreate({
        where: { email: u.email.toLowerCase() },
        defaults: {
          ...u,
          email: u.email.toLowerCase(),
          password: await bcrypt.hash(u.password, 12),
        },
        transaction,
      });
    for (const c of data.clinics)
      await Clinic.findOrCreate({ where: { nit: c.nit }, defaults: c, transaction });
    for (const w of data.warehouses)
      await Warehouse.findOrCreate({ where: { name: w.name }, defaults: w, transaction });
    for (const m of data.medicines)
      await Medicine.findOrCreate({ where: { sku: m.sku }, defaults: m, transaction });
    for (const i of data.inventories) await Inventory.upsert(i, { transaction });
    return {
      users: data.users.length,
      clinics: data.clinics.length,
      warehouses: data.warehouses.length,
      medicines: data.medicines.length,
      inventories: data.inventories.length,
    };
  });
  res.status(201).json({ message: 'Seed imported successfully', processed: counts });
};
