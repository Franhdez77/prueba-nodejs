import { Router } from 'express';
import * as controller from '../controllers/SupplyRequestController';
import { asyncHandler } from '../errors/errorMiddleware';
import { authorize } from '../middlewares/authMiddleware';

const supplyRequestRoutes = Router();

/**
 * @swagger
 * /api/requests:
 *   post:
 *     tags: [Supply requests]
 *     summary: Create a supply request
 *     description: Reserves inventory in a transaction. Available to ADMIN and MANAGER users.
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/SupplyRequestInput' }
 *     responses:
 *       201: { description: Request created with PENDING status }
 *       400: { description: Invalid input or non-positive quantity }
 *       404: { description: Clinic, medicine, or warehouse not found }
 *       409: { description: Insufficient inventory }
 * /api/requests/active:
 *   get:
 *     tags: [Supply requests]
 *     summary: List active requests
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: PENDING, APPROVED, or DISPATCHED requests }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 * /api/requests/history:
 *   get:
 *     tags: [Supply requests]
 *     summary: List the complete request history
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: History ordered from the most recent request }
 */

/**
 * @swagger
 * /api/requests/{id}:
 *   get:
 *     tags: [Supply requests]
 *     summary: Get a request by ID
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: integer } }
 *     responses:
 *       200: { description: Request with its associated resources }
 *       404: { $ref: '#/components/responses/NotFound' }
 *   delete:
 *     tags: [Supply requests]
 *     summary: Soft-delete a request (ADMIN)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: integer } }
 *     responses:
 *       204: { description: Request deleted }
 *       403: { $ref: '#/components/responses/Forbidden' }
 * /api/requests/{id}/status:
 *   patch:
 *     tags: [Supply requests]
 *     summary: Update a request status
 *     description: Only valid business workflow transitions are allowed.
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: integer } }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/StatusInput' }
 *     responses:
 *       200: { description: Status updated }
 *       400: { description: Invalid status or forbidden transition }
 *       404: { $ref: '#/components/responses/NotFound' }
 */
supplyRequestRoutes.get('/active', asyncHandler(controller.listActive));
supplyRequestRoutes.get('/history', asyncHandler(controller.history));
supplyRequestRoutes.get('/:id', asyncHandler(controller.getOne));
supplyRequestRoutes.post('/', authorize('ADMIN', 'MANAGER'), asyncHandler(controller.create));
supplyRequestRoutes.patch(
  '/:id/status',
  authorize('ADMIN', 'MANAGER'),
  asyncHandler(controller.updateStatus),
);
supplyRequestRoutes.delete('/:id', authorize('ADMIN'), asyncHandler(controller.remove));
export default supplyRequestRoutes;
