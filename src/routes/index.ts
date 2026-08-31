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
 *     summary: Consultar el historial de solicitudes de una clínica
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: clinicId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Historial de la clínica }
 *       404: { description: Clínica no encontrada }
 */
router.get('/clinics/:clinicId/requests', asyncHandler(history));

router.use('/seed', seedRoutes);
