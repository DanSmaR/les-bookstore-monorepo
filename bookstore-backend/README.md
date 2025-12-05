# 📚 Bookstore Backend API

A robust NestJS backend application for an online bookstore management system, built with Clean Architecture principles and Domain-Driven Design.

## 🛠️ Technology Stack

- **Framework**: [NestJS](https://nestjs.com/) 11
- **Language**: TypeScript 5.7
- **Database**: PostgreSQL 15
- **ORM**: TypeORM 0.3
- **Authentication**: JWT (Passport)
- **Password Hashing**: bcryptjs
- **Validation**: class-validator & class-transformer
- **AI Integration**: Google Gemini AI
- **Testing**: Jest (unit tests)
- **Containerization**: Docker & Docker Compose

## 📁 Project Structure

```
src/
├── domain/                 # Domain Layer - Business Entities
│   ├── user/              # User, CustomerDetails, Address, Card entities
│   ├── book/              # Book entity
│   ├── order/             # Order, OrderItem, Payment, Refund entities
│   ├── ticket/            # Ticket (coupon) entity
│   └── chat/              # Chat conversation entities
│
├── application/            # Application Layer - Use Cases
│   ├── auth/              # Authentication use cases
│   ├── users/             # User management use cases
│   ├── books/             # Book management use cases
│   ├── orders/            # Order processing use cases
│   └── chat/              # AI chatbot use cases
│
├── infrastructure/         # Infrastructure Layer
│   ├── persistence/       # TypeORM repositories
│   ├── auth/              # JWT strategy and guards
│   ├── ai/                # Gemini AI integration
│   ├── payment/           # Payment gateway (mock)
│   └── nestjs/            # NestJS modules configuration
│
└── presentation/          # Presentation Layer - Controllers & DTOs
    ├── auth/              # Authentication endpoints
    ├── site/              # Customer-facing endpoints
    ├── admin/             # Admin-only endpoints
    ├── common/            # Shared endpoints (books, etc.)
    └── test/              # Test utilities endpoints
```

## 🚀 Getting Started

### Prerequisites

- Node.js 22+ and Yarn
- Docker and Docker Compose
- PostgreSQL 15 (if not using Docker)

### Installation

```bash
# Install dependencies
yarn install
```

### Environment Configuration

Create a `.env` file in the project root:

```env
# Database Configuration
DATABASE_HOST=postgres          # Use 'localhost' if not using Docker
DATABASE_PORT=5432
DATABASE_NAME=bookstore_db
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres

# PostgreSQL Configuration (for Docker)
POSTGRES_DB=bookstore_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres

# Application Configuration
NODE_ENV=development
PORT=3000

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-in-production-!!!
JWT_EXPIRATION=8h
JWT_REFRESH_EXPIRATION=7d

# AI Integration (Optional - for chatbot feature)
GEMINI_API_KEY=your-gemini-api-key-here
```

> ⚠️ **Security Note**: Never commit the `.env` file to version control. Change `JWT_SECRET` in production!

### Running the Application

#### Option 1: With Docker (Recommended)

```bash
# Start all services (backend + database)
yarn docker:up

# View logs
yarn docker:logs

# The API will be available at http://localhost:3000
```

#### Option 2: Local Development (without Docker)

```bash
# Ensure PostgreSQL is running locally
# Update DATABASE_HOST=localhost in .env

# Run migrations (if any)
yarn migration:run:local

# Start development server
yarn start:dev

# The API will be available at http://localhost:3000
```

## 📝 Available Scripts

### Development

| Command | Description |
|---------|-------------|
| `yarn start` | Start the application |
| `yarn start:dev` | Start with hot reload (watch mode) |
| `yarn start:debug` | Start with debug mode |
| `yarn start:prod` | Start production build |
| `yarn start:test` | Start with test environment |

### Building

| Command | Description |
|---------|-------------|
| `yarn build` | Build the application for production |

### Docker

| Command | Description |
|---------|-------------|
| `yarn docker:up` | Start Docker environment (backend + database) |
| `yarn docker:logs` | View Docker container logs |
| `yarn docker:up:logs` | Start Docker and follow logs |
| `yarn docker:test-db` | Start only test database container |
| `yarn docker:test:up` | Start test environment containers |
| `yarn docker:test:down` | Stop test environment |
| `yarn docker:test:logs` | View test environment logs |
| `yarn docker:test:restart` | Restart test environment |

### Database Migrations

| Command | Description |
|---------|-------------|
| `yarn migration:run` | Run migrations in Docker |
| `yarn migration:run:local` | Run migrations locally |
| `yarn migration:run:docker` | Run migrations in Docker container |
| `yarn migration:generate` | Generate a new migration |
| `yarn migration:create` | Create an empty migration |
| `yarn migration:revert` | Revert the last migration |
| `yarn migration:show` | Show all migrations |

### Testing

| Command | Description |
|---------|-------------|
| `yarn test` | Run unit tests |
| `yarn test:watch` | Run tests in watch mode |
| `yarn test:cov` | Run tests with coverage |
| `yarn test:debug` | Run tests in debug mode |
| `yarn test:e2e` | Run end-to-end tests |
| `yarn test:db:setup` | Setup test database |
| `yarn test:db:reset` | Reset test database |

### Code Quality

| Command | Description |
|---------|-------------|
| `yarn lint` | Run ESLint and auto-fix issues |
| `yarn format` | Format code with Prettier |
| `yarn format:imports` | Sort and organize imports |

## 🎯 API Endpoints

### Authentication

```
POST   /api/auth/sign-up              Register new user
POST   /api/auth/sign-in              Login
POST   /api/auth/refresh              Refresh access token
POST   /api/auth/sign-out             Logout
```

### User Management (Authenticated)

```
GET    /api/me                        Get current user profile
PATCH  /api/me                        Update profile
POST   /api/me/change-password        Change password
GET    /api/me/addresses              List addresses
POST   /api/me/addresses              Add new address
PATCH  /api/me/addresses/:id          Update address
DELETE /api/me/addresses/:id          Remove address
GET    /api/me/cards                  List payment cards
POST   /api/me/cards                  Add payment card
DELETE /api/me/cards/:id              Remove payment card
```

### Books

```
GET    /api/books                     List all books (paginated)
GET    /api/books/:id                 Get book details
POST   /api/books                     Create book (admin only)
PATCH  /api/books/:id                 Update book (admin only)
DELETE /api/books/:id                 Delete book (admin only)
```

### Orders (Customer)

```
POST   /api/orders                    Create new order
POST   /api/orders/:id/pay            Pay for order
POST   /api/orders/:id/apply-tickets  Apply discount tickets
PATCH  /api/orders/:id                Change order status
POST   /api/orders/:id/refunds        Request refund
PATCH  /api/orders/:id/refunds/:refundId  Update refund status
```

### Tickets (Coupons)

```
GET    /api/tickets/me                Get my available tickets
GET    /api/tickets/:code             Get ticket by code
POST   /api/tickets/promotional       Create promotional ticket (admin)
```

### Admin - User Management

```
GET    /api/users                     List all users (paginated)
GET    /api/users/:id                 Get user details
DELETE /api/users/:id                 Inactivate user
GET    /api/users/:id/orders          Get user's orders
PATCH  /api/users/:id/orders/:orderId Change order status (admin)
```

### Admin - Analytics

```
GET    /api/analytics/dashboard       Get dashboard metrics
GET    /api/analytics/top-books       Get best-selling books
GET    /api/analytics/top-categories  Get top categories
```

### Chatbot

```
POST   /api/chat/send                 Send message to AI assistant
GET    /api/chat/conversations        Get chat history
GET    /api/chat/conversations/:id    Get specific conversation
```

### Test Utilities (Test Environment Only)

```
GET    /api/test/health               Health check
POST   /api/test/reset-database       Reset test database
POST   /api/test/create-admin-user    Create admin user
POST   /api/test/create-book          Create test book
POST   /api/test/create-ticket        Create test ticket
POST   /api/test/create-order         Create test order
```

## 🔒 Authentication & Authorization

The API uses **JWT (JSON Web Tokens)** for authentication:

1. **Sign up** or **Sign in** to receive access and refresh tokens
2. Include the access token in the `Authorization` header:
   ```
   Authorization: Bearer <your-access-token>
   ```
3. When the access token expires, use the refresh token to get a new one

### User Roles

- **USER**: Regular customers - can browse, purchase, manage their account
- **ADMIN**: Administrators - full access to all endpoints and admin panel

### Protected Routes

- Routes under `/api/me/*` require authentication (USER role)
- Routes under `/api/admin/*` and `/api/users/*` require ADMIN role
- Public routes: `/api/auth/*`, `/api/books` (GET)

## 🏗️ Architecture Patterns

### Clean Architecture

The project follows Clean Architecture principles with clear separation of concerns:

- **Domain Layer**: Pure business logic and entities
- **Application Layer**: Use cases and business rules
- **Infrastructure Layer**: External dependencies (database, APIs, etc.)
- **Presentation Layer**: HTTP controllers and data transfer objects

### Domain-Driven Design

- **Entities**: Rich domain models with business logic
- **Value Objects**: Immutable objects representing domain concepts
- **Repositories**: Abstract data persistence
- **Use Cases**: Encapsulate business operations
- **Domain Events**: (Future enhancement)

### Design Patterns Used

- Repository Pattern
- Service Layer Pattern
- Factory Pattern
- Strategy Pattern
- Decorator Pattern (via NestJS)
- Dependency Injection (via NestJS)

## 🗄️ Database Schema

### Main Entities

- **Users**: User accounts and authentication
- **Customer Details**: Extended customer information
- **Addresses**: Delivery addresses
- **Cards**: Saved payment methods
- **Books**: Product catalog
- **Orders**: Purchase orders
- **Order Items**: Items in each order
- **Payments**: Payment transactions
- **Refunds**: Refund requests and items
- **Tickets**: Discount coupons (promotional and exchange)
- **Chat Conversations**: AI chatbot conversations

### Key Relationships

- User 1:1 CustomerDetails
- CustomerDetails 1:N Addresses
- CustomerDetails 1:N Cards
- Order N:M Tickets
- Order 1:N OrderItems
- Order 1:N Payments
- Order 1:N Refunds

## 🤖 AI Integration

The chatbot feature uses **Google Gemini AI** to provide:
- Product recommendations
- Order assistance
- General bookstore inquiries
- Customer support

To enable AI features, set `GEMINI_API_KEY` in your `.env` file.

## 🧪 Testing

### Unit Tests

```bash
# Run all unit tests
yarn test

# Run tests in watch mode
yarn test:watch

# Generate coverage report
yarn test:cov
```

### E2E Tests (with Cypress)

See [TEST-SETUP.md](../TEST-SETUP.md) for comprehensive testing documentation.

```bash
# Start test environment
yarn docker:test:up

# In another terminal, start frontend and run Cypress tests
cd ../bookstore-frontend
npm run cy:open
```

### Test Database Management

```bash
# Setup/reset test database
yarn test:db:setup

# Start only test database
yarn docker:test-db
```

## 🐳 Docker Configuration

### Development Environment (`docker-compose.yml`)

- **app**: NestJS backend with hot reload
- **postgres**: PostgreSQL 15 database with persistent storage

Ports:
- Backend: `3000`
- PostgreSQL: `5432`

### Test Environment (`docker-compose.test.yml`)

- **app-test**: Backend in test mode
- **postgres-test**: PostgreSQL test database with tmpfs storage

Ports:
- Backend: `3000`
- PostgreSQL: `5433` (external), `5432` (internal)

## 📊 Monitoring & Health Checks

### Health Check Endpoint

```bash
curl http://localhost:3000/api/test/health
```

Response:
```json
{
  "status": "ok",
  "environment": "development",
  "timestamp": "2024-12-04T12:00:00.000Z",
  "database": {
    "connected": true,
    "name": "bookstore_db"
  }
}
```

### Docker Container Logs

```bash
# View all logs
yarn docker:logs

# Follow logs in real-time
docker logs -f les_bookstore_backend_container
```

## 🚢 Production Deployment

### Build for Production

```bash
# Build the application
yarn build

# Start production server (requires built files)
yarn start:prod
```

### Docker Production Build

```bash
# Build Docker image
docker build -t bookstore-backend:latest .

# Run container
docker run -d \
  -p 3000:3000 \
  --env-file .env.production \
  --name bookstore-backend \
  bookstore-backend:latest
```

### Environment Variables for Production

Create `.env.production` with:
- Different `DATABASE_HOST`, `DATABASE_NAME`, `DATABASE_USER`, `DATABASE_PASSWORD`
- Strong `JWT_SECRET` (use a cryptographically secure random string)
- Set `NODE_ENV=production`
- Configure `GEMINI_API_KEY` for AI features

## 🐛 Troubleshooting

### Port 3000 Already in Use

```bash
# Find process using port 3000
lsof -ti:3000

# Kill the process
kill -9 $(lsof -ti:3000)
```

### Database Connection Issues

1. Check if PostgreSQL container is running:
```bash
docker ps | grep postgres
```

2. View database logs:
```bash
docker logs les_bookstore_postgres_container
```

3. Test database connection:
```bash
docker exec -it les_bookstore_postgres_container psql -U postgres -d bookstore_db
```

### Migration Issues

```bash
# Show current migration status
yarn migration:show

# Revert last migration if needed
yarn migration:revert

# Run migrations again
yarn migration:run
```

### Docker Issues

```bash
# Remove all containers and volumes
docker compose down -v

# Rebuild from scratch
docker compose up -d --build --force-recreate

# Clear Docker cache
docker system prune -a
```

## 📚 Additional Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [TypeORM Documentation](https://typeorm.io)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

## 🤝 Contributing

1. Follow the existing code structure and patterns
2. Write unit tests for new features
3. Run linter before committing: `yarn lint`
4. Format code: `yarn format`
5. Ensure all tests pass: `yarn test`

## 📄 License

This project is for educational purposes as part of the Software Engineering Laboratory course at FATEC.

---

**Built with ❤️ using NestJS**
