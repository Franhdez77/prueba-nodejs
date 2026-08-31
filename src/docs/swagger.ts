import swaggerJsdoc from 'swagger-jsdoc';

/** Especificación OpenAPI generada desde los bloques JSDoc ubicados junto a las rutas. */
export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'RiwiMediCare Plus API',
      version: '1.0.0',
      description: 'API REST para gestionar clínicas, inventario y solicitudes de abastecimiento.',
    },
    servers: [{ url: 'http://localhost:3000', description: 'Servidor local' }],
    tags: [
      { name: 'Auth', description: 'Registro e inicio de sesión' },
      { name: 'Clinics', description: 'Administración de clínicas' },
      { name: 'Warehouses', description: 'Administración de almacenes' },
      { name: 'Medicines', description: 'Administración de medicamentos' },
      { name: 'Inventory', description: 'Existencias por almacén y medicamento' },
      { name: 'Supply requests', description: 'Solicitudes de abastecimiento' },
      { name: 'Seed', description: 'Carga inicial de datos JSON' },
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
          description: 'Token ausente, inválido o vencido',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
        },
        Forbidden: {
          description: 'El rol no tiene permisos para realizar la operación',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
        },
        NotFound: {
          description: 'Recurso no encontrado',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
});
