import { Router } from 'express';
import multer from 'multer';
import { uploadSeed } from '../controllers/SeedController';
import { asyncHandler } from '../errors/errorMiddleware';
import { authorize } from '../middlewares/authMiddleware';

const seedRoutes = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (_req, file, callback) =>
    callback(null, file.mimetype === 'application/json' || file.originalname.endsWith('.json')),
});

/**
 * @swagger
 * /api/seed/upload:
 *   post:
 *     tags: [Seed]
 *     summary: Cargar datos iniciales desde un archivo JSON
 *     description: Importación transaccional exclusiva para ADMIN. Evita duplicados por claves únicas.
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [file]
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Archivo JSON de máximo 2 MB
 *     responses:
 *       201: { description: Datos importados correctamente }
 *       400: { description: Archivo ausente, inválido o con estructura incorrecta }
 *       403: { $ref: '#/components/responses/Forbidden' }
 */
seedRoutes.post('/upload', authorize('ADMIN'), upload.single('file'), asyncHandler(uploadSeed));
export default seedRoutes;
