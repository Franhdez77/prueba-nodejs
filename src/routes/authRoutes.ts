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
 *     summary: Register a user
 *     description: Public route that accepts either the ADMIN or MANAGER role.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterInput'
 *     responses:
 *       201:
 *         description: User registered
 *       400:
 *         description: Invalid input
 *       409:
 *         description: Email is already registered
 */
authRoutes.post('/register', asyncHandler(controller.register));

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Log in
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Authentication succeeded
 *         content:
 *           application/json:
 *             example:
 *               token: eyJhbGciOiJIUzI1NiJ9...
 *               user: { id: 1, name: Administrador Riwi, email: admin@riwi.io, role: ADMIN }
 *       401:
 *         description: Invalid credentials
 */
authRoutes.post('/login', asyncHandler(controller.login));

export default authRoutes;
