# 🏦 Club Finance Backend

A backend API for managing club finances with role-based access control, financial records, dashboard analytics, and audit trails.

## Tech Stack
- **Node.js + Express.js** — REST API
- **PostgreSQL** — Database
- **JWT** — Authentication
- **bcryptjs** — Password hashing

## Features
- ✅ JWT Authentication
- ✅ Role Based Access Control (Viewer, Analyst, Admin)
- ✅ Financial Records CRUD with soft delete
- ✅ Record filtering by type, category, date
- ✅ Pagination
- ✅ Dashboard analytics APIs
- ✅ Audit trail on every write operation
- ✅ Input validation and error handling

## Roles
| Role | Can Do |
|---|---|
| Viewer | View records only |
| Analyst | View records + dashboard analytics |
| Admin | Full access — manage records and users |

## Quick Start
```bash
git clone https://github.com/YOUR_USERNAME/club-finance-backend.git
cd club-finance-backend
npm install
```

Create `.env` file:
```env
PORT=5000
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/club_finance
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
```

Setup database:
```bash
psql -U postgres -c "CREATE DATABASE club_finance;"
psql -U postgres -d club_finance -f src/db/schema.sql
npm run dev
```

## API Routes

| Method | Endpoint | Access |
|---|---|---|
| POST | /api/auth/register | Public |
| POST | /api/auth/login | Public |
| GET | /api/records | Viewer+ |
| POST | /api/records | Admin |
| PUT | /api/records/:id | Admin |
| DELETE | /api/records/:id | Admin |
| GET | /api/dashboard/summary | Analyst+ |
| GET | /api/dashboard/categories | Analyst+ |
| GET | /api/dashboard/trends/monthly | Analyst+ |
| GET | /api/dashboard/recent | Analyst+ |

## Test Credentials
| Role | Email | Password |
|---|---|---|
| Admin | admin@club.com | admin123 |
| Viewer | viewer@club.com | viewer123 |