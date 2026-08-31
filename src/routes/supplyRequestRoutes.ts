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
 *     summary: Crear una solicitud de abastecimiento
 *     description: Reserva el inventario dentro de una transacción. Disponible para ADMIN y MANAGER.
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/SupplyRequestInput' }
 *     responses:
 *       201: { description: Solicitud creada con estado PENDING }
 *       400: { description: Datos inválidos o cantidad no positiva }
 *       404: { description: Clínica, medicamento o almacén inexistente }
 *       409: { description: Inventario insuficiente }
 * /api/requests/active:
 *   get:
 *     tags: [Supply requests]
 *     summary: Consultar solicitudes activas
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Solicitudes PENDING, APPROVED o DISPATCHED }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 * /api/requests/history:
 *   get:
 *     tags: [Supply requests]
 *     summary: Consultar el historial completo
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Historial ordenado desde la solicitud más reciente }
 */

/**
 * @swagger
 * /api/requests/{id}:
 *   get:
 *     tags: [Supply requests]
 *     summary: Consultar una solicitud por id
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: integer } }
 *     responses:
 *       200: { description: Solicitud con sus asociaciones }
 *       404: { $ref: '#/components/responses/NotFound' }
 *   delete:
 *     tags: [Supply requests]
 *     summary: Eliminar lógicamente una solicitud (ADMIN)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: integer } }
 *     responses:
 *       204: { description: Solicitud eliminada }
 *       403: { $ref: '#/components/responses/Forbidden' }
 * /api/requests/{id}/status:
 *   patch:
 *     tags: [Supply requests]
 *     summary: Actualizar el estado de una solicitud
 *     description: Solo permite transiciones válidas del flujo de negocio.
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: integer } }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/StatusInput' }
 *     responses:
 *       200: { description: Estado actualizado }
 *       400: { description: Estado o transición no permitida }
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
