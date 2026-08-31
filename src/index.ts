import cors from 'cors';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './docs/swagger';
import { router } from './routes';
import { errorHandler } from './errors/errorMiddleware';


export const app = express();

app.use(cors());

app.use(express.json({ limit: '1mb' }));

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/api/docs.json', (_req, res) => res.json(swaggerSpec));

app.use('/api', router);

app.use((_req, res) => res.status(404).json({ message: 'Route not found' }));

app.use(errorHandler);

