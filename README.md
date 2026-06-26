# Store Rating Platform

A full-stack web application for submitting and managing store ratings with role-based access control.

## Tech Stack

- **Backend:** NestJS (Express)
- **Database:** PostgreSQL
- **Frontend:** React (Vite + TypeScript)

## Features

### System Administrator
- Dashboard with total users, stores, and ratings
- Add users (normal, admin, store owner) and stores
- View/filter/sort user and store listings
- View user details including store owner ratings

### Normal User
- Sign up and login
- Browse and search stores
- Submit and modify ratings (1-5)
- Change password

### Store Owner
- View dashboard with average store rating
- See list of users who rated their store
- Change password

## Prerequisites

- Node.js 18+
- Docker (for PostgreSQL) or a local PostgreSQL instance

## Quick Start

### 1. Start PostgreSQL

```bash
docker-compose up -d
```

### 2. Backend Setup

```bash
cd backend
cp .env.example .env   # Edit if needed
npm install
npm run start:dev
```

The API runs at `http://localhost:3000`.

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

## Default Admin Credentials

| Field    | Value                    |
|----------|--------------------------|
| Email    | admin@platform.com       |
| Password | Admin@123                |

> Admin is auto-seeded on first startup.

## Form Validations

| Field    | Rules                                                      |
|----------|------------------------------------------------------------|
| Name     | 20-60 characters                                           |
| Address  | Max 400 characters                                         |
| Password | 8-16 chars, 1 uppercase, 1 special character               |
| Email    | Standard email format                                      |
| Rating   | Integer 1-5                                                |

## API Endpoints

### Auth
- `POST /auth/register` - Normal user signup
- `POST /auth/login` - Login (all roles)
- `POST /auth/change-password` - Update password (authenticated)
- `POST /auth/logout` - Logout

### Admin (requires system_admin role)
- `GET /admin/dashboard`
- `GET /admin/users` - List with filters & sorting
- `GET /admin/users/:id`
- `POST /admin/users`
- `GET /admin/stores` - List with filters & sorting
- `POST /admin/stores`

### Normal User
- `GET /stores` - List stores with search & sorting
- `POST /stores/:id/ratings` - Submit rating
- `PUT /stores/:id/ratings` - Update rating

### Store Owner
- `GET /store-owner/dashboard`

## Project Structure

```
store-rating-platform/
├── backend/          # NestJS API
│   └── src/
│       ├── admin/
│       ├── auth/
│       ├── stores/
│       ├── ratings/
│       ├── users/
│       └── store-owner/
├── frontend/         # React SPA
│   └── src/
│       ├── pages/
│       ├── components/
│       └── context/
└── docker-compose.yml
```

## Environment Variables

See `backend/.env.example` for all backend configuration options.

Frontend API URL can be set via `VITE_API_URL` (defaults to `http://localhost:3000`).
