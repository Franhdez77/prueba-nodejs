import { Router } from 'express';
import * as controller from '../controllers/ResourceController';
import { asyncHandler } from '../errors/errorMiddleware';
import { authorize } from '../middlewares/authMiddleware';

const resourceRoutes = Router();

/**
 * @swagger
 * /api/clinics:
 *   get:
 *     tags: [Clinics]
 *     summary: Listar clínicas activas
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Lista de clínicas }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *   post:
 *     tags: [Clinics]
 *     summary: Crear una clínica (ADMIN)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ClinicInput' }
 *     responses:
 *       201: { description: Clínica creada }
 *       409: { description: Ya existe una clínica con el mismo NIT }
 * /api/clinics/{id}:
 *   get:
 *     tags: [Clinics]
 *     summary: Consultar una clínica
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: integer } }
 *     responses:
 *       200: { description: Clínica encontrada }
 *       404: { $ref: '#/components/responses/NotFound' }
 *   patch:
 *     tags: [Clinics]
 *     summary: Actualizar una clínica (ADMIN)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: integer } }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ClinicInput' }
 *     responses:
 *       200: { description: Clínica actualizada }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *   delete:
 *     tags: [Clinics]
 *     summary: Eliminar lógicamente una clínica (ADMIN)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: integer } }
 *     responses:
 *       204: { description: Clínica eliminada }
 */

/**
 * @swagger
 * /api/warehouses:
 *   get:
 *     tags: [Warehouses]
 *     summary: Listar almacenes activos
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Lista de almacenes }
 *   post:
 *     tags: [Warehouses]
 *     summary: Crear un almacén (ADMIN)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/WarehouseInput' }
 *     responses:
 *       201: { description: Almacén creado }
 *       403: { $ref: '#/components/responses/Forbidden' }
 * /api/warehouses/{id}:
 *   get:
 *     tags: [Warehouses]
 *     summary: Consultar un almacén
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: integer } }
 *     responses:
 *       200: { description: Almacén encontrado }
 *       404: { $ref: '#/components/responses/NotFound' }
 *   patch:
 *     tags: [Warehouses]
 *     summary: Actualizar un almacén (ADMIN)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: integer } }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/WarehouseInput' }
 *     responses:
 *       200: { description: Almacén actualizado }
 *   delete:
 *     tags: [Warehouses]
 *     summary: Eliminar lógicamente un almacén (ADMIN)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: integer } }
 *     responses:
 *       204: { description: Almacén eliminado }
 */

/**
 * @swagger
 * /api/medicines:
 *   get:
 *     tags: [Medicines]
 *     summary: Listar medicamentos activos
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Lista de medicamentos }
 *   post:
 *     tags: [Medicines]
 *     summary: Crear un medicamento (ADMIN)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/MedicineInput' }
 *     responses:
 *       201: { description: Medicamento creado }
 *       403: { $ref: '#/components/responses/Forbidden' }
 * /api/medicines/{id}:
 *   get:
 *     tags: [Medicines]
 *     summary: Consultar un medicamento
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: integer } }
 *     responses:
 *       200: { description: Medicamento encontrado }
 *       404: { $ref: '#/components/responses/NotFound' }
 *   patch:
 *     tags: [Medicines]
 *     summary: Actualizar un medicamento (ADMIN)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: integer } }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/MedicineInput' }
 *     responses:
 *       200: { description: Medicamento actualizado }
 *   delete:
 *     tags: [Medicines]
 *     summary: Eliminar lógicamente un medicamento (ADMIN)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: integer } }
 *     responses:
 *       204: { description: Medicamento eliminado }
 */
for (const [path, config] of Object.entries(controller.resources)) {
  resourceRoutes.get(`/${path}`, asyncHandler(controller.list(config.model)));
  resourceRoutes.get(`/${path}/:id`, asyncHandler(controller.getOne(config.model)));
  resourceRoutes.post(
    `/${path}`,
    authorize('ADMIN'),
    asyncHandler(controller.create(config.model, config.validator)),
  );
  resourceRoutes.patch(
    `/${path}/:id`,
    authorize('ADMIN'),
    asyncHandler(controller.update(config.model, config.validator)),
  );
  resourceRoutes.delete(
    `/${path}/:id`,
    authorize('ADMIN'),
    asyncHandler(controller.remove(config.model)),
  );
}

export default resourceRoutes;
