# RiwiMediCare Plus API

RiwiMediCare Plus is a REST API for managing clinics, medicine warehouses, inventory, and supply requests. It provides JWT authentication, role-based authorization, transactional inventory operations, JSON seed imports, and interactive OpenAPI documentation.

## Project Information

- **Coder:** Francisco Hernandez Lopez
- **Clan:** Node.js AM
- **Public repository:** [Franhdez77/prueba-nodejs](https://github.com/Franhdez77/prueba-nodejs)

## Technologies

- Node.js 22
- TypeScript
- Express 5
- PostgreSQL 16
- Sequelize ORM
- JSON Web Tokens (JWT)
- bcryptjs
- Multer
- Swagger / OpenAPI
- Jest and ts-jest
- Docker and Docker Compose

## Requirements

For a local installation:

- Node.js 22 or later
- npm
- PostgreSQL 16 or later

Alternatively, Docker and Docker Compose can run the complete application stack.

## Installation

Clone the public repository and enter the project directory:

```bash
git clone https://github.com/Franhdez77/prueba-nodejs.git
cd prueba-nodejs
```

Install the dependencies:

```bash
npm install
```

Create the local environment file from the provided example:

```bash
cp .env.example .env
```

When running without Docker, make sure PostgreSQL is running and that the database configured in `DATABASE_URL` exists:

```sql
CREATE DATABASE riwimedicare;
```

## Environment Variables

Example `.env` file:

```env
PORT=3000
DATABASE_URL=postgres://postgres:postgres@localhost:5432/riwimedicare
DOCKER_DATABASE_URL=postgres://postgres:postgres@db:5432/riwimedicare
POSTGRES_DB=riwimedicare
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
JWT_SECRET=replace-with-a-secure-random-secret
JWT_EXPIRES_IN=8h
DB_SYNC=true
```

| Variable | Description |
| --- | --- |
| `PORT` | Port exposed by the HTTP server. |
| `DATABASE_URL` | PostgreSQL connection URL used when running locally. |
| `DOCKER_DATABASE_URL` | PostgreSQL connection URL used by the API container. Its host must be `db`. |
| `POSTGRES_DB` | Database created by the PostgreSQL container. |
| `POSTGRES_USER` | PostgreSQL username used by Docker Compose. |
| `POSTGRES_PASSWORD` | PostgreSQL password used by Docker Compose. |
| `JWT_SECRET` | Secret used to sign and verify authentication tokens. Use a strong production value. |
| `JWT_EXPIRES_IN` | JWT lifetime, for example `8h`. |
| `DB_SYNC` | Runs Sequelize synchronization at startup unless set to `false`. |

Do not commit the real `.env` file or production credentials.

## Running the Project Locally

Start the development server with file watching:

```bash
npm run dev
```

The application will expose:

- Health check: <http://localhost:3000/health>
- Swagger UI: <http://localhost:3000/docs>
- OpenAPI JSON: <http://localhost:3000/api/docs.json>

Build and run the production output:

```bash
npm run build
npm start
```

## Running with Docker

Build and start the API and PostgreSQL containers:

```bash
docker compose up --build -d
```

Check their status and inspect the API logs:

```bash
docker compose ps
docker compose logs -f api
```

Stop the containers without deleting the database volume:

```bash
docker compose down
```

## Database Backup

The repository includes a PostgreSQL backup at [`database/riwimedicare_backup.sql`](./database/riwimedicare_backup.sql). It contains the database schema and the data available when the backup was generated.

The backup uses plain SQL and excludes environment-specific ownership and privilege commands, making it suitable for another PostgreSQL installation.

### Restore with Docker Compose

Start PostgreSQL, stop the API to prevent writes during restoration, and execute the SQL file:

```bash
docker compose up -d db
docker compose stop api
docker compose exec -T db psql \
  -v ON_ERROR_STOP=1 \
  -U postgres \
  -d riwimedicare < database/riwimedicare_backup.sql
docker compose start api
```

The backup contains `DROP` and `CREATE` statements. Restoring it replaces existing project tables and their data.

### Restore to a Local PostgreSQL Installation

```bash
psql \
  -v ON_ERROR_STOP=1 \
  -U postgres \
  -d riwimedicare \
  -f database/riwimedicare_backup.sql
```

### Generate a New Backup

With the Docker database running:

```bash
docker compose exec -T db pg_dump \
  --clean \
  --if-exists \
  --no-owner \
  --no-privileges \
  -U postgres \
  riwimedicare > database/riwimedicare_backup.sql
```

## Loading Test Data from JSON

The repository includes [`seed.example.json`](./seed.example.json). The ADMIN-only endpoint reads this file directly from the project and processes its contents in a database transaction. No file upload is required.

The JSON document supports the `users`, `clinics`, `warehouses`, `medicines`, and `inventories` collections.

### 1. Start the application

Use either the local or Docker command described above.

### 2. Register an administrator

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Seed Administrator",
    "email": "seed.admin@example.com",
    "password": "Admin123!",
    "role": "ADMIN"
  }'
```

### 3. Log in and obtain a JWT

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "seed.admin@example.com",
    "password": "Admin123!"
  }'
```

Copy the returned `token` and assign it to a shell variable:

```bash
SEED_TOKEN='paste-the-returned-token-here'
```

### 4. Load the project seed file

```bash
curl -X POST http://localhost:3000/api/seed/load \
  -H "Authorization: Bearer ${SEED_TOKEN}"
```

A successful import returns HTTP `201` with the number of processed records. Existing resources are identified by their unique fields to avoid duplicates.

The same operation is available in Swagger UI at <http://localhost:3000/docs>. Authorize with the ADMIN token and execute `POST /api/seed/load`.

## Running Tests

Run all Jest suites:

```bash
npm test
```

Run only the authentication service tests:

```bash
npx jest src/services/AuthService.test.ts --runInBand
```

## Main API Areas

- `/api/auth` — registration and login
- `/api/clinics` — clinic management
- `/api/warehouses` — warehouse management
- `/api/medicines` — medicine management
- `/api/inventory` — inventory management
- `/api/requests` — supply request workflow
- `/api/seed/load` — transactional import from the project JSON seed file

Protected endpoints require an `Authorization: Bearer <token>` header. Administrative operations additionally require the `ADMIN` role.
