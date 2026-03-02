# Medical Services Booking Platform — Backend

## Stack
- **Runtime:** Node.js 18+
- **Framework:** Express.js 5
- **Language:** TypeScript
- **ORM:** Prisma 5
- **Database:** PostgreSQL 15+
- **Auth:** JWT (jsonwebtoken + bcrypt)
- **Validation:** Zod v4
- **File Upload:** Multer + Cloudinary
- **Search:** PostgreSQL pg_trgm (fuzzy matching)

## Setup

### 1. Install dependencies
```bash
cd backend
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env with your database URL, JWT secret, Cloudinary keys, etc.
```

### 3. Set up PostgreSQL
Make sure PostgreSQL is running and create the database:
```sql
CREATE DATABASE banisa_db;
```

Enable pg_trgm extension (for fuzzy search):
```sql
\c banisa_db
CREATE EXTENSION IF NOT EXISTS pg_trgm;
SET pg_trgm.similarity_threshold = 0.3;
```

### 4. Run migrations
```bash
npx prisma migrate dev --name init
```

### 5. Seed database
```bash
npm run seed
```

### 6. Start development server
```bash
npm run dev
```

Server will start on `http://localhost:5000`.

## API Endpoints

### Authentication
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login | No |
| POST | `/api/auth/logout` | Logout | No |
| GET | `/api/auth/me` | Get current user | Yes |

### Categories
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/categories` | List all (tree) | No |
| GET | `/api/categories/:id` | Get single category | No |

### Diagnostics
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/diagnostics` | List with pagination, search | No |
| GET | `/api/diagnostics/:id` | Get single service | No |
| POST | `/api/diagnostics` | Create service | SUPER_ADMIN |
| PUT | `/api/diagnostics/:id` | Update service | SUPER_ADMIN |
| DELETE | `/api/diagnostics/:id` | Soft delete (deactivate) | SUPER_ADMIN |

### Query Parameters for GET /api/diagnostics
| Param | Type | Description |
|-------|------|-------------|
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 10) |
| `search` | string | Fuzzy search (min 2 chars) |
| `categoryId` | string | Filter by category |
| `minPrice` | number | Minimum price filter |
| `maxPrice` | number | Maximum price filter |

## Project Structure
```
backend/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Seed data (47 services)
├── src/
│   ├── config/
│   │   ├── database.ts    # Prisma client
│   │   ├── cloudinary.ts  # Cloudinary config
│   │   └── env.ts         # Environment variables
│   ├── middleware/
│   │   ├── auth.middleware.ts    # JWT auth + RBAC
│   │   ├── error.middleware.ts   # Error handler
│   │   └── validate.middleware.ts # Zod validation
│   ├── modules/
│   │   ├── auth/          # Authentication module
│   │   ├── categories/    # Service categories module
│   │   └── diagnostics/   # Diagnostic services module
│   ├── utils/
│   │   ├── errors.ts      # Custom error classes
│   │   ├── response.ts    # Unified response format
│   │   └── logger.ts      # Logger utility
│   ├── types/
│   │   └── index.ts       # Shared types
│   ├── app.ts             # Express app setup
│   └── server.ts          # Server entry point
├── .env
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

## Default Admin Credentials
After seeding:
- **Email:** admin@medicare.uz
- **Password:** admin123
- **Role:** SUPER_ADMIN

## Scripts
| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Compile TypeScript |
| `npm run seed` | Seed database |
