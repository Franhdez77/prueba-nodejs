import { Router } from 'express';
import { loadSeed } from '../controllers/SeedController';
import { asyncHandler } from '../errors/errorMiddleware';
import { authorize } from '../middlewares/authMiddleware';

const seedRoutes = Router();

/**
 * @swagger
 * /api/seed/load:
 *   post:
 *     tags: [Seed]
 *     summary: Load the project's seed data
 *     description: ADMIN-only transactional import from seed.example.json. No file upload is required.
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: Data imported successfully }
 *       400: { description: The project seed data has an invalid structure }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       500: { description: The project seed file could not be read or parsed }
 */
seedRoutes.post('/load', authorize('ADMIN'), asyncHandler(loadSeed));
export default seedRoutes;
