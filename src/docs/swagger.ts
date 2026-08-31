import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';
import { env } from '../config/env';

/** OpenAPI specification generated from the JSDoc blocks located beside the routes. */
export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'RiwiMediCare Plus API',
      version: '1.0.0',
      description: 'REST API for managing clinics, inventory, and supply requests.',
    },
    servers: [{ url: `http://localhost:${env.port}`, description: 'Local server' }],
    tags: [
      { name: 'Auth', description: 'Registration and login' },
      { name: 'Clinics', description: 'Clinic management' },
      { name: 'Warehouses', description: 'Warehouse management' },
      { name: 'Medicines', description: 'Medicine management' },
      { name: 'Inventory', description: 'Stock by warehouse and medicine' },
      { name: 'Supply requests', description: 'Medicine supply requests' },
      { name: 'Seed', description: 'Initial JSON data import' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
      schemas: {
        RegisterInput: {
          type: 'object',
          required: ['name', 'email', 'password', 'role'],
          properties: {
            name: { type: 'string', example: 'Administrador Riwi' },
            email: { type: 'string', format: 'email', example: 'admin@riwi.io' },
            password: { type: 'string', minLength: 6, example: 'Admin123!' },
            role: { type: 'string', enum: ['ADMIN', 'MANAGER'], example: 'ADMIN' },
          },
        },
        LoginInput: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'admin@riwi.io' },
            password: { type: 'string', example: 'Admin123!' },
          },
        },
        ClinicInput: {
          type: 'object',
          required: ['name', 'nit', 'address', 'responsibleName', 'responsiblePhone'],
          properties: {
            name: { type: 'string', example: 'Clínica Central' },
            nit: { type: 'string', example: '900123456-1' },
            address: { type: 'string', example: 'Calle 10 #20-30' },
            responsibleName: { type: 'string', example: 'Ana Pérez' },
            responsiblePhone: { type: 'string', example: '3001234567' },
          },
        },
        WarehouseInput: {
          type: 'object',
          required: ['name', 'location'],
          properties: {
            name: { type: 'string', example: 'Almacén Norte' },
            location: { type: 'string', example: 'Medellín' },
          },
        },
        MedicineInput: {
          type: 'object',
          required: ['name', 'sku'],
          properties: {
            name: { type: 'string', example: 'Acetaminofén 500 mg' },
            sku: { type: 'string', example: 'MED-001' },
            description: { type: 'string', example: 'Caja de tabletas' },
          },
        },
        InventoryInput: {
          type: 'object',
          required: ['warehouseId', 'medicineId', 'quantity'],
          properties: {
            warehouseId: { type: 'integer', minimum: 1, example: 1 },
            medicineId: { type: 'integer', minimum: 1, example: 1 },
            quantity: { type: 'integer', minimum: 0, example: 500 },
          },
        },
        SupplyRequestInput: {
          type: 'object',
          required: ['clinicId', 'medicineId', 'warehouseId', 'quantity'],
          properties: {
            clinicId: { type: 'integer', minimum: 1, example: 1 },
            medicineId: { type: 'integer', minimum: 1, example: 1 },
            warehouseId: { type: 'integer', minimum: 1, example: 1 },
            quantity: { type: 'integer', minimum: 1, example: 10 },
          },
        },
        StatusInput: {
          type: 'object',
          required: ['status'],
          properties: {
            status: {
              type: 'string',
              enum: ['APPROVED', 'DISPATCHED', 'DELIVERED', 'REJECTED', 'CANCELLED'],
              example: 'APPROVED',
            },
          },
        },
        Error: {
          type: 'object',
          properties: { message: { type: 'string', example: 'Resource not found' } },
        },
      },
      responses: {
        Unauthorized: {
          description: 'Missing, invalid, or expired token',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
        },
        Forbidden: {
          description: 'The role is not allowed to perform this operation',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
        },
        NotFound: {
          description: 'Resource not found',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
        },
      },
    },
  },
  apis: [path.join(__dirname, '../routes/*.{ts,js}')],
});
