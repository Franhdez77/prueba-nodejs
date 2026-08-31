-- RiwiMediCare Plus database backup

BEGIN;

-- Remove the old structure in dependency order.
DROP TABLE IF EXISTS supply_requests CASCADE;
DROP TABLE IF EXISTS inventories CASCADE;
DROP TABLE IF EXISTS clinics CASCADE;
DROP TABLE IF EXISTS medicines CASCADE;
DROP TABLE IF EXISTS warehouses CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TYPE IF EXISTS enum_supply_requests_status;
DROP TYPE IF EXISTS enum_users_role;

-- Values accepted by the User and SupplyRequest models.
CREATE TYPE enum_users_role AS ENUM ('ADMIN', 'MANAGER');
CREATE TYPE enum_supply_requests_status AS ENUM (
  'PENDING',
  'APPROVED',
  'DISPATCHED',
  'DELIVERED',
  'REJECTED',
  'CANCELLED'
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role enum_users_role NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE clinics (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  nit VARCHAR(255) NOT NULL UNIQUE,
  address VARCHAR(255) NOT NULL,
  "responsibleName" VARCHAR(255) NOT NULL,
  "responsiblePhone" VARCHAR(255) NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE warehouses (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  location VARCHAR(255) NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE medicines (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  sku VARCHAR(255) NOT NULL UNIQUE,
  description TEXT NOT NULL DEFAULT '',
  active BOOLEAN NOT NULL DEFAULT TRUE,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE inventories (
  id SERIAL PRIMARY KEY,
  "warehouseId" INTEGER NOT NULL REFERENCES warehouses(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  "medicineId" INTEGER NOT NULL REFERENCES medicines(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity >= 0),
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE ("warehouseId", "medicineId")
);

CREATE TABLE supply_requests (
  id SERIAL PRIMARY KEY,
  "clinicId" INTEGER NOT NULL REFERENCES clinics(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  "medicineId" INTEGER NOT NULL REFERENCES medicines(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  "warehouseId" INTEGER NOT NULL REFERENCES warehouses(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  "requestedBy" INTEGER NOT NULL REFERENCES users(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  status enum_supply_requests_status NOT NULL DEFAULT 'PENDING',
  active BOOLEAN NOT NULL DEFAULT TRUE,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Data available when this backup was generated.
INSERT INTO users (id, name, email, password, role, active, "createdAt", "updatedAt")
VALUES (
  1,
  'Administrador Riwi',
  'admin@riwi.io',
  '$2b$12$jFypWlGg2Hypn1emwk2s4edtucJAEZDhjJykJsRAeF8Z3LOrTncPe',
  'ADMIN',
  TRUE,
  '2026-08-31 15:44:12.12+00',
  '2026-08-31 15:44:12.12+00'
);

-- Continue auto-generated IDs after the restored records.
SELECT setval('users_id_seq', COALESCE((SELECT MAX(id) FROM users), 1), TRUE);

COMMIT;
