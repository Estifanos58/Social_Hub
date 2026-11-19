# Social_Hub Monorepo

A modern, scalable social networking platform built with **NestJS**, **GraphQL**, **Prisma**, **PostgreSQL**, **Redis**, **Next.js 15**, **Apollo Client**, and **Zustand**.

---

## 🏛 Architecture Overview

```
                      ┌────────────────────────────────┐
                      │    Next.js 15 Client (App)     │
                      │  (Apollo Client, Zustand Store)│
                      └───────────────┬────────────────┘
                                      │ HTTP / GraphQL & WSS
                                      ▼
                      ┌────────────────────────────────┐
                      │       NestJS Backend API       │
                      │  (GraphQL, CQRS, Guards, Auth) │
                      └───────┬────────────────┬───────┘
                              │                │
            Prisma ORM (Pool) │                │ Redis Pub/Sub (ioredis)
                              ▼                ▼
                      ┌───────────────┐┌───────────────┐
                      │  PostgreSQL   ││     Redis     │
                      └───────────────┘└───────────────┘
```

- **Frontend:** Next.js 15 with Turbopack, React 19, Tailwind CSS 4, Apollo Client 4, Zustand 5, Lucide icons, Sonner notifications.
- **Backend:** NestJS 11, Apollo GraphQL with code-first schema, CQRS pattern, Prisma ORM 6, ioredis with dynamic TLS, EventEmitter2.
- **Database & Storage:** PostgreSQL 16 (with transaction isolation and advisory locks) & Redis 7 (Pub/Sub for realtime messaging and presence).

---

## 🚀 Getting Started

### Prerequisites
- Node.js 22+ (tested with Node.js 24)
- Docker & Docker Compose
- npm 10+

---

## 🐳 Docker Environments

### 1. Development Mode (Local Docker Database & Redis)

In development mode, database and Redis services run in local Docker containers.

#### Option A: Run Only Database & Redis in Docker (Recommended for Local Dev)
Run local database and Redis containers in the background, and execute backend and frontend locally:
```bash
# Start local PostgreSQL and Redis containers with persistent volumes
docker compose -f docker-compose.dev.yml up -d postgres redis

# In a terminal, run backend:
cd backend
cp .env.example .env
npm install
npx prisma db push
npm run start:dev

# In another terminal, run frontend:
cd frontend
cp .env.example .env.local
npm install --legacy-peer-deps
npm run dev
```

#### Option B: Run Full Development Stack in Docker (Hot Reload)
```bash
# Spins up PostgreSQL, Redis, Backend (with live reload), and Frontend (with live reload)
docker compose -f docker-compose.dev.yml up
```

---

### 2. Production Mode (External Managed Resources)

In production, **no local database or Redis containers are run**. The application connects securely to external managed cloud infrastructure (e.g. AWS RDS / Supabase PostgreSQL, and AWS ElastiCache / Upstash Redis with TLS).

```bash
# 1. Create and populate your production environment file
cp .env.production.example .env.production

# 2. Build and launch production containers with resource limits and health checks
docker compose -f docker-compose.prod.yml --env-file .env.production up -d --build

# Check health and logs
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs -f
```

---

## 🔒 Security Hardening

- **HttpOnly Cookie Authentication:** Access and refresh tokens are stored in `httpOnly`, `secure`, `SameSite` cookies with root path scoping. Token leakage in URL parameters and browser `localStorage` has been eliminated.
- **Refresh Token Rotation & Revocation:** Refresh tokens are hashed using SHA-256 before database storage. Token reuse triggers immediate session invalidation and cookie revocation.
- **Advisory Locks for Direct Conversations:** Database transactions utilize PostgreSQL advisory locks (`pg_advisory_xact_lock`) on sorted user pairs to prevent race conditions and duplicate direct chatrooms.
- **Private Account & Soft Delete Authorization:** Privacy filters ensure private posts and profiles are strictly visible only to approved followers and owners. Soft-deleted content (`deletedAt: null`) is automatically excluded.
- **Realtime Subscription Authorization:** GraphQL WebSocket subscriptions (`graphql-ws`) authenticate clients on connection upgrade and resolver filter predicates ensure messages and typing indicators are dispatched only to active chatroom members.
- **Container Hardening:** Docker production containers run under unprivileged system users (`node` / `nextjs`), utilize `dumb-init` for PID 1 signal forwarding, include automated health checks, and exclude dev tooling via multi-stage builds.

---

## 🧪 Testing

### Backend Unit & Regression Tests
```bash
cd backend
npm test
```
*Includes tests for `GraphQLAuthGuard` token rotation, `ResetPasswordHandler`, `GetPostsHandler` privacy filters, `CreateChatroomHandler` duplicate prevention, and `NotificationService`.*

### Frontend Unit Tests
```bash
cd frontend
npm test
```
*Includes tests for `uploadImageToCloudinary` file validation and `useUserStore` authentication state management.*

---

## 📋 Status & Roadmap

- **Two-Factor Authentication (2FA):** Currently badged as "Coming Soon" in settings. Enabling 2FA is rejected with an explicit validation error until full TOTP implementation with authenticator QR codes and recovery keys is delivered in a future release.
