# E2E Test Setup - Quick Reference

## Overview

This project now uses **Docker Compose** for running E2E tests with Cypress. Both the backend application and test database run in isolated containers.

## 🚀 Quick Start

### Option 1: Automated (Recommended)

From the **frontend** directory:

```bash
yarn test:e2e:full
```

This single command:
1. ✅ Starts backend + database in Docker
2. ✅ Runs all Cypress tests
3. ✅ Tears down the environment

### Option 2: Manual (Interactive)

**Terminal 1 - Backend:**
```bash
cd bookstore-backend
yarn docker:test:up
```

**Terminal 2 - Frontend:**
```bash
cd bookstore-frontend
yarn dev
```

**Terminal 3 - Cypress:**
```bash
cd bookstore-frontend
yarn cy:open  # Interactive UI
# or
yarn cy:run   # Headless
```

**When done:**
```bash
cd bookstore-backend
yarn docker:test:down
```

## 📋 Available Commands

### Backend (bookstore-backend/)

| Command | What it does |
|---------|--------------|
| `yarn docker:test:up` | 🚀 Start test environment |
| `yarn docker:test:down` | 🛑 Stop test environment |
| `yarn docker:test:logs` | 📜 View container logs |
| `yarn docker:test:restart` | 🔄 Restart (rebuild + restart) |

### Frontend (bookstore-frontend/)

| Command | What it does |
|---------|--------------|
| `yarn test:e2e:full` | 🎯 Complete test cycle (setup→test→teardown) |
| `yarn test:e2e:setup` | 🚀 Start backend test environment |
| `yarn test:e2e:teardown` | 🛑 Stop backend test environment |
| `yarn cy:open` | 👁️ Open Cypress UI (interactive) |
| `yarn cy:run` | 🏃 Run tests (headless) |

## 🔍 Verification

Check if the test environment is ready:

```bash
# Check containers are running
docker ps | grep les_bookstore

# Check backend health
curl http://localhost:3000/api/test/health

# Expected response:
{
  "status": "ok",
  "environment": "test",
  "database": {
    "connected": true,
    "name": "bookstore_test_db"
  }
}
```

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│  Host Machine                                       │
│                                                     │
│  ┌──────────────────┐      ┌──────────────────┐   │
│  │  Frontend        │      │  Docker Network   │   │
│  │  (Vite)          │──────┤                   │   │
│  │  localhost:5173  │      │  ┌─────────────┐  │   │
│  └──────────────────┘      │  │ app-test    │  │   │
│                            │  │ port: 3000  │  │   │
│  ┌──────────────────┐      │  │ (Backend)   │  │   │
│  │  Cypress         │──────┤  └──────┬──────┘  │   │
│  │  Tests           │      │         │         │   │
│  └──────────────────┘      │         │         │   │
│                            │  ┌──────▼──────┐  │   │
│                            │  │ postgres-   │  │   │
│                            │  │ test        │  │   │
│                            │  │ port: 5433  │  │   │
│                            │  └─────────────┘  │   │
│                            └──────────────────┘   │
└─────────────────────────────────────────────────────┘
```

## 📝 Test Database Details

- **Container**: `les_bookstore_postgres_test_container`
- **Image**: PostgreSQL 15
- **External Port**: 5433
- **Internal Port**: 5432 (within Docker network)
- **Database**: `bookstore_test_db`
- **User**: `postgres`
- **Password**: `postgres`
- **Storage**: tmpfs (RAM disk) - fast & ephemeral

## 🔧 Backend App Details

- **Container**: `les_bookstore_backend_test_container`
- **Port**: 3000
- **Environment**: test
- **Configuration**: Loaded from `.env.test` file
- **Hot Reload**: ✅ Enabled (src/ directory mounted)
- **Healthcheck**: `/api/test/health`

### Configuration Management

The test environment uses `.env.test` as the single source of truth:
- All environment variables are loaded from `.env.test`
- Only `DATABASE_HOST` and `DATABASE_PORT` are overridden for Docker networking
- To modify test configuration, edit `.env.test` (no need to change docker-compose.test.yml)

## 🐛 Troubleshooting

### Containers won't start

```bash
# Check if ports are in use
lsof -i :3000
lsof -i :5433

# Stop conflicting containers
docker compose down  # Stop dev environment
docker compose -f docker-compose.test.yml down
```

### Backend not responding

```bash
# View logs
cd bookstore-backend
yarn docker:test:logs

# Restart
yarn docker:test:restart
```

### Database connection errors

```bash
# Check database is running
docker exec les_bookstore_postgres_test_container pg_isready -U postgres

# View database logs
docker logs les_bookstore_postgres_test_container
```

### Need to rebuild after changes

```bash
cd bookstore-backend
yarn docker:test:restart
```

## 💡 Tips

1. **Keep test environment separate** - Don't run tests against development database
2. **Use automated script for CI/CD** - `yarn test:e2e:full` in your pipeline
3. **Monitor resources** - Docker uses RAM and CPU; stop when not testing
4. **Check logs on failure** - `yarn docker:test:logs` shows what went wrong
5. **Database resets automatically** - Each Cypress test resets the database via `cy.task('resetTestDatabase')`

## 📚 More Details

See `bookstore-backend/TESTING.md` for comprehensive documentation.

## 🎯 Example Test Workflow

```bash
# 1. Start everything
cd bookstore-backend && yarn docker:test:up

# 2. In another terminal, start frontend
cd bookstore-frontend && yarn dev

# 3. In another terminal, run specific test
cd bookstore-frontend
yarn cy:open
# Select and run your test in Cypress UI

# 4. When done, clean up
cd bookstore-backend && yarn docker:test:down
```

## ✅ Success Indicators

You're ready to test when:

- ✅ `docker ps` shows 2 containers running:
  - `les_bookstore_backend_test_container`
  - `les_bookstore_postgres_test_container`
- ✅ `curl http://localhost:3000/api/test/health` returns status "ok"
- ✅ Frontend is accessible at `http://localhost:5173`

---

**Questions?** Check the full documentation in `bookstore-backend/TESTING.md`

