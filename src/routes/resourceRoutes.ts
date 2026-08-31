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
 *     summary: List active clinics
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Clinic list }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *   post:
 *     tags: [Clinics]
 *     summary: Create a clinic (ADMIN)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ClinicInput' }
 *     responses:
 *       201: { description: Clinic created }
 *       409: { description: A clinic with the same NIT already exists }
 * /api/clinics/{id}:
 *   get:
 *     tags: [Clinics]
 *     summary: Get a clinic
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: integer } }
 *     responses:
 *       200: { description: Clinic found }
 *       404: { $ref: '#/components/responses/NotFound' }
 *   patch:
 *     tags: [Clinics]
 *     summary: Update a clinic (ADMIN)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: integer } }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ClinicInput' }
 *     responses:
 *       200: { description: Clinic updated }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *   delete:
 *     tags: [Clinics]
 *     summary: Soft-delete a clinic (ADMIN)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: integer } }
 *     responses:
 *       204: { description: Clinic deleted }
 */

/**
 * @swagger
 * /api/warehouses:
 *   get:
 *     tags: [Warehouses]
 *     summary: List active warehouses
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Warehouse list }
 *   post:
 *     tags: [Warehouses]
 *     summary: Create a warehouse (ADMIN)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/WarehouseInput' }
 *     responses:
 *       201: { description: Warehouse created }
 *       403: { $ref: '#/components/responses/Forbidden' }
 * /api/warehouses/{id}:
 *   get:
 *     tags: [Warehouses]
 *     summary: Get a warehouse
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: integer } }
 *     responses:
 *       200: { description: Warehouse found }
 *       404: { $ref: '#/components/responses/NotFound' }
 *   patch:
 *     tags: [Warehouses]
 *     summary: Update a warehouse (ADMIN)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: integer } }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/WarehouseInput' }
 *     responses:
 *       200: { description: Warehouse updated }
 *   delete:
 *     tags: [Warehouses]
 *     summary: Soft-delete a warehouse (ADMIN)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: integer } }
 *     responses:
 *       204: { description: Warehouse deleted }
 */

/**
 * @swagger
 * /api/medicines:
 *   get:
 *     tags: [Medicines]
 *     summary: List active medicines
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Medicine list }
 *   post:
 *     tags: [Medicines]
 *     summary: Create a medicine (ADMIN)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/MedicineInput' }
 *     responses:
 *       201: { description: Medicine created }
 *       403: { $ref: '#/components/responses/Forbidden' }
 * /api/medicines/{id}:
 *   get:
 *     tags: [Medicines]
 *     summary: Get a medicine
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: integer } }
 *     responses:
 *       200: { description: Medicine found }
 *       404: { $ref: '#/components/responses/NotFound' }
 *   patch:
 *     tags: [Medicines]
 *     summary: Update a medicine (ADMIN)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: integer } }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/MedicineInput' }
 *     responses:
 *       200: { description: Medicine updated }
 *   delete:
 *     tags: [Medicines]
 *     summary: Soft-delete a medicine (ADMIN)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: integer } }
 *     responses:
 *       204: { description: Medicine deleted }
 */
for (const [path, config] of Object.entries(controller.resources)) {
  resourceRoutes.get(`/${path}`, asyncHandler(controller.list(config.service)));
  resourceRoutes.get(`/${path}/:id`, asyncHandler(controller.getOne(config.service)));
  resourceRoutes.post(
    `/${path}`,
    authorize('ADMIN'),
    asyncHandler(controller.create(config.service, config.validator)),
  );
  resourceRoutes.patch(
    `/${path}/:id`,
    authorize('ADMIN'),
    asyncHandler(controller.update(config.service, config.validator)),
  );
  resourceRoutes.delete(
    `/${path}/:id`,
    authorize('ADMIN'),
    asyncHandler(controller.remove(config.service)),
  );
}

export default resourceRoutes;
