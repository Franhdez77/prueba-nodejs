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
 *     summary: List available inventory
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Inventory with associated warehouses and medicines
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *   put:
 *     tags: [Inventory]
 *     summary: Create or update inventory
 *     description: Administrator-only operation.
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
 *         description: Inventory updated
 *       201:
 *         description: Inventory created
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
inventoryRoutes.get('/', asyncHandler(listInventory));

inventoryRoutes.put('/', authorize('ADMIN'), asyncHandler(upsertInventory));
export default inventoryRoutes;
