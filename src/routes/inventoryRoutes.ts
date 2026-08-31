import { Router } from 'express';
import { listInventory, upsertInventory } from '../controllers/ResourceController';
import { asyncHandler } from '../errors/errorMiddleware';
import { authorize } from '../middlewares/authMiddleware';

const inventoryRoutes = Router();

/**
 * @swagger
 * /api/inventory:
 *   get:
 *     tags: [Inventory]
 *     summary: Consultar el inventario disponible
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Inventario con almacenes y medicamentos asociados
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *   put:
 *     tags: [Inventory]
 *     summary: Crear o actualizar existencias
 *     description: Operación exclusiva del administrador.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InventoryInput'
 *     responses:
 *       200:
 *         description: Inventario actualizado
 *       201:
 *         description: Inventario creado
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
inventoryRoutes.get('/', asyncHandler(listInventory));

inventoryRoutes.put('/', authorize('ADMIN'), asyncHandler(upsertInventory));
export default inventoryRoutes;
