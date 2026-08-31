import cors from 'cors';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import { router } from './routes';
import { errorHandler } from './utils/errors';
export const app = express();

app.use(cors());

app.use(express.json({ limit: '1mb' }));

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api', router);

app.use((_req, res) => res.status(404).json({ message: 'Route not found' }));

app.use(errorHandler);