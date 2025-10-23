# Testing Guide

This guide explains how to run E2E tests with Cypress using the Docker-based test environment.

## Architecture

The test environment consists of:
- **postgres-test**: PostgreSQL 15 database running on port 5433 (mapped from internal 5432)
- **app-test**: NestJS backend application running on port 3000 in test mode

Both services run in Docker containers and are orchestrated via `docker-compose.test.yml`.

## Quick Start

### Running E2E Tests

From the **frontend** directory:

```bash
# Option 1: Full automated test run (setup + run + teardown)
yarn test:e2e:full

# Option 2: Manual control
yarn test:e2e:setup    # Start test environment
yarn dev               # Start frontend (in another terminal)
yarn cy:open           # Open Cypress UI
# ... run your tests ...
yarn test:e2e:teardown # Stop test environment
```

### From Backend Directory

```bash
# Start test environment (database + backend)
yarn docker:test:up

# View logs
yarn docker:test:logs

# Stop test environment
yarn docker:test:down

# Restart (useful after code changes that need rebuild)
yarn docker:test:restart
```

## Detailed Workflow

### 1. Start the Test Environment

```bash
cd bookstore-backend
yarn docker:test:up
```

This command:
1. Starts the PostgreSQL test database container
2. Waits for the database to be healthy
3. Builds and starts the backend application container
4. Runs database migrations automatically
5. Waits for the backend to be healthy

**Wait time**: ~10-20 seconds for full startup

### 2. Verify the Environment

Check if services are running:

```bash
# Check containers
docker ps | grep les_bookstore

# Check backend health
curl http://localhost:3000/api/test/health

# Expected response:
# {
#   "status": "ok",
#   "environment": "test",
#   "database": {
#     "connected": true,
#     "name": "bookstore_test_db"
#   }
# }
```

### 3. Run Cypress Tests

From the **frontend** directory:

```bash
# Start the frontend dev server
yarn dev

# In another terminal, run tests
yarn cy:open  # Interactive mode
# or
yarn cy:run   # Headless mode
```

### 4. Clean Up

After testing:

```bash
cd bookstore-backend
yarn docker:test:down
```

This stops and removes all test containers.

## Environment Configuration

The test environment uses settings from `.env.test` with Docker-specific overrides:

### Configuration Source
- **Primary**: `.env.test` file (loaded via `env_file` in docker-compose.test.yml)
- **Overrides**: `DATABASE_HOST` and `DATABASE_PORT` adjusted for Docker networking

### Database Configuration
- **Host**: `postgres-test` (internal Docker network) / `localhost` (from host)
- **Port**: 5433 (external) / 5432 (internal)
- **Database**: `bookstore_test_db`
- **User**: `postgres`
- **Password**: `postgres`

### Backend Configuration
- **Port**: 3000
- **Environment**: test
- **Auto-reload**: Enabled (via volume mount of `src/` directory)
- **Config File**: All settings loaded from `.env.test`

## Database Management

### Reset Database Between Tests

Cypress tests automatically reset the database using the test endpoint:

```typescript
// In your Cypress test
beforeEach(() => {
  cy.task('resetTestDatabase');
});
```

This endpoint (`POST /api/test/reset-database`):
- Truncates all tables
- Resets sequences
- Is only available in test environment

### Manual Database Reset

If needed, you can manually reset the database:

```bash
# From backend directory
yarn test:db:reset

# Or via API
curl -X POST http://localhost:3000/api/test/reset-database
```

## Troubleshooting

### Backend won't start

1. Check if ports are already in use:
```bash
lsof -i :3000
lsof -i :5433
```

2. Check container logs:
```bash
cd bookstore-backend
yarn docker:test:logs
```

3. Restart the environment:
```bash
yarn docker:test:restart
```

### Database connection errors

1. Ensure the database container is running:
```bash
docker ps | grep postgres_test
```

2. Check database health:
```bash
docker exec les_bookstore_postgres_test_container pg_isready -U postgres
```

3. View database logs:
```bash
docker logs les_bookstore_postgres_test_container
```

### Tests are flaky

1. Increase the wait time in `test:e2e:setup` script if containers are slow to start
2. Ensure database is properly reset between tests
3. Check for race conditions in test setup

### Port conflicts

If port 3000 or 5433 are already in use:

1. Stop conflicting services:
```bash
# Stop development environment if running
cd bookstore-backend
docker compose down
```

2. Or modify ports in `docker-compose.test.yml`

## CI/CD Integration

For continuous integration, use:

```bash
# In your CI pipeline
cd bookstore-backend
yarn docker:test:up

cd ../bookstore-frontend
yarn dev &  # Start frontend in background
FRONTEND_PID=$!

# Wait for frontend to be ready
npx wait-on http://localhost:5173

# Run tests
yarn cy:run

# Cleanup
kill $FRONTEND_PID
cd ../bookstore-backend
yarn docker:test:down
```

## Best Practices

1. **Always use the test environment for E2E tests** - Never run tests against development or production databases

2. **Reset database between tests** - Ensures test isolation and reproducibility

3. **Use tmpfs for test database** - The test database uses tmpfs (RAM disk) for better performance

4. **Don't commit test data changes** - Test database is ephemeral and recreated on each run

5. **Monitor resource usage** - Docker containers use system resources; close them when not testing

6. **Keep test data minimal** - Faster tests, easier debugging

## Available Scripts Reference

### Backend Scripts

| Script | Description |
|--------|-------------|
| `yarn docker:test:up` | Start test environment (database + backend) |
| `yarn docker:test:down` | Stop and remove test environment |
| `yarn docker:test:logs` | View logs from test containers |
| `yarn docker:test:restart` | Restart test environment (down + up) |
| `yarn test:e2e:setup` | Alias for `docker:test:up` |
| `yarn test:e2e:teardown` | Alias for `docker:test:down` |
| `yarn test:db:reset` | Reset test database (truncate tables) |

### Frontend Scripts

| Script | Description |
|--------|-------------|
| `yarn test:e2e:setup` | Start backend test environment |
| `yarn test:e2e:teardown` | Stop backend test environment |
| `yarn test:e2e:full` | Complete test cycle (setup + run + teardown) |
| `yarn cy:open` | Open Cypress interactive UI |
| `yarn cy:run` | Run Cypress tests in headless mode |

## File Structure

```
bookstore-backend/
├── docker-compose.yml           # Development environment
├── docker-compose.test.yml      # Test environment (E2E tests)
│                                  # Uses .env.test for configuration
├── Dockerfile                   # Production build
├── Dockerfile.test              # Development/test build
├── .env                         # Development environment variables
├── .env.test                    # Test environment variables
│                                  # Referenced by docker-compose.test.yml
└── scripts/
    └── setup-test-db.ts         # Database setup script
```

### Important Note on Configuration

The `docker-compose.test.yml` loads environment variables from `.env.test` using the `env_file` directive. This ensures:
- ✅ Single source of truth for test configuration
- ✅ Easy to update JWT secrets, timeouts, etc.
- ✅ Consistency between local script runs and Docker runs
- ✅ Only `DATABASE_HOST` and `DATABASE_PORT` are overridden for Docker networking

