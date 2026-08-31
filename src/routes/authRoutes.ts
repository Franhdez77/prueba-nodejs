import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { asyncHandler } from '../errors/errorMiddleware';

const authRoutes = Router();
const controller = new AuthController();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Registrar un usuario
 *     description: Ruta pública. Permite elegir el rol ADMIN o MANAGER.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterInput'
 *     responses:
 *       201:
 *         description: Usuario registrado
 *       400:
 *         description: Datos inválidos
 *       409:
 *         description: El correo ya está registrado
 */
authRoutes.post('/register', asyncHandler(controller.register));

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Iniciar sesión
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Autenticación correcta
 *         content:
 *           application/json:
 *             example:
 *               token: eyJhbGciOiJIUzI1NiJ9...
 *               user: { id: 1, name: Administrador Riwi, email: admin@riwi.io, role: ADMIN }
 *       401:
 *         description: Credenciales inválidas
 */
authRoutes.post('/login', asyncHandler(controller.login));

export default authRoutes;
