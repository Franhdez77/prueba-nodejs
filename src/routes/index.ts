import { Router } from 'express';
import { history } from '../controllers/SupplyRequestController';
import { asyncHandler } from '../errors/errorMiddleware';
import { authenticate } from '../middlewares/authMiddleware';
import authRoutes from './authRoutes';
import inventoryRoutes from './inventoryRoutes';
import resourceRoutes from './resourceRoutes';
import seedRoutes from './seedRoutes';
import supplyRequestRoutes from './supplyRequestRoutes';

export const router = Router();

router.use('/auth', authRoutes);
router.use(authenticate);
router.use(resourceRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/requests', supplyRequestRoutes);

/**
 * @swagger
 * /api/clinics/{clinicId}/requests:
 *   get:
 *     tags: [Supply requests]
 *     summary: List supply request history for a clinic
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: clinicId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Clinic request history }
 *       404: { description: Clinic not found }
 */
router.get('/clinics/:clinicId/requests', asyncHandler(history));

router.use('/seed', seedRoutes);
