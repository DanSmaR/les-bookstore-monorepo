# 📚 Bookstore Management System

A full-stack monorepo project for managing an online bookstore, built with modern technologies and following clean architecture principles.

## 🏗️ Project Structure

```
les-bookstore-monorepo/
├── bookstore-backend/     # NestJS Backend API
├── bookstore-frontend/    # React + Vite Frontend
└── README.md             # This file
```

## 🛠️ Tech Stack

### Backend
- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL 15
- **ORM**: TypeORM
- **Authentication**: JWT (Passport)
- **Password Hashing**: bcryptjs
- **AI Integration**: Google Gemini AI
- **Containerization**: Docker & Docker Compose

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite
- **Language**: TypeScript
- **Routing**: React Router v7
- **Styling**: Styled Components
- **Forms**: React Hook Form + Zod
- **HTTP Client**: Axios
- **Charts**: Recharts
- **E2E Testing**: Cypress

## 🚀 Quick Start

### Prerequisites

- Node.js 22+ and Yarn
- Docker and Docker Compose
- Git

### 1. Clone the Repository

```bash
git clone git@github.com:Senseei/les-bookstore-monorepo.git
cd les-bookstore-monorepo
```

### 2. Backend Setup

```bash
cd bookstore-backend

# Install dependencies
yarn install

# Create environment file
cp .env.example .env  # Create and configure your .env file

# Start database and backend with Docker
yarn docker:up

# The backend will be available at http://localhost:3000
```

#### Required Environment Variables

Create a `.env` file in `bookstore-backend/` with:

```env
# Database Configuration
DATABASE_HOST=postgres
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
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRATION=8h
JWT_REFRESH_EXPIRATION=7d

# AI Integration (Optional - for chatbot)
GEMINI_API_KEY=your-gemini-api-key-here
```

### 3. Frontend Setup

```bash
cd bookstore-frontend

# Install dependencies
npm install

# Start development server
npm run dev

# The frontend will be available at http://localhost:5173
```

#### Optional Environment Variables

Create a `.env` file in `bookstore-frontend/` (optional):

```env
API_URL=http://localhost:3000/api
ENABLE_API_DELAY=false
```

## 📖 Documentation

- **Backend**: See [bookstore-backend/README.md](./bookstore-backend/README.md)
- **Frontend**: See [bookstore-frontend/README.md](./bookstore-frontend/README.md)
- **Testing**: See [TEST-SETUP.md](./TEST-SETUP.md)

## 🧪 Running Tests

### E2E Tests with Cypress

**Option 1: Automated (Recommended)**

```bash
cd bookstore-frontend
npm run test:e2e:full
```

This command:
1. ✅ Starts backend + test database in Docker
2. ✅ Runs all Cypress tests
3. ✅ Tears down the environment

**Option 2: Interactive Mode**

```bash
# Terminal 1 - Start test environment
cd bookstore-backend
yarn docker:test:up

# Terminal 2 - Start frontend
cd bookstore-frontend
npm run dev

# Terminal 3 - Run Cypress
cd bookstore-frontend
npm run cy:open  # Interactive UI
# OR
npm run cy:run   # Headless mode
```

**Cleanup:**

```bash
cd bookstore-backend
yarn docker:test:down
```

## 🎯 Features

### For Customers (Site)
- 🔐 User Registration & Authentication
- 📚 Browse and Search Books
- 🛒 Shopping Cart Management
- 🎟️ Coupon/Ticket System (Promotional & Exchange)
- 💳 Multiple Payment Methods
- 📦 Order Tracking
- 🔄 Refund Requests
- 🤖 AI-Powered Chatbot Assistant
- 👤 Profile Management
- 📍 Multiple Delivery Addresses
- 💳 Saved Payment Cards

### For Administrators (Admin Panel)
- 📊 Analytics Dashboard
- 👥 Customer Management
- 📚 Book Inventory Management
- 📦 Order Management
- 🎟️ Ticket/Coupon Management
- 💰 Refund Approval System
- 📈 Sales Reports

## 🐳 Docker Commands

### Development Environment

```bash
# Start all services (backend + database)
yarn docker:up

# View logs
yarn docker:logs

# Stop all services
docker compose down
```

### Test Environment

```bash
# Start test environment
yarn docker:test:up

# View test logs
yarn docker:test:logs

# Stop test environment
yarn docker:test:down

# Restart test environment
yarn docker:test:restart
```

## 📝 Available Scripts

### Backend (bookstore-backend/)

| Command | Description |
|---------|-------------|
| `yarn start:dev` | Start development server with hot reload |
| `yarn start:prod` | Start production server |
| `yarn build` | Build for production |
| `yarn docker:up` | Start Docker environment |
| `yarn docker:logs` | View Docker logs |
| `yarn test` | Run unit tests |
| `yarn lint` | Run ESLint |
| `yarn format` | Format code with Prettier |
| `yarn migration:run` | Run database migrations |

### Frontend (bookstore-frontend/)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run cy:open` | Open Cypress test UI |
| `npm run cy:run` | Run Cypress tests (headless) |
| `npm run test:e2e:full` | Complete E2E test cycle |

## 🏛️ Architecture

### Backend Architecture

The backend follows **Clean Architecture** and **Domain-Driven Design** principles:

```
src/
├── domain/              # Business entities and domain logic
│   ├── user/
│   ├── book/
│   ├── order/
│   └── ticket/
├── application/         # Use cases and business logic
│   ├── auth/
│   ├── users/
│   ├── books/
│   ├── orders/
│   └── chat/
├── infrastructure/      # External concerns (DB, auth, AI)
│   ├── persistence/
│   ├── auth/
│   ├── ai/
│   └── payment/
└── presentation/        # Controllers and DTOs
    ├── auth/
    ├── site/           # Customer-facing endpoints
    ├── admin/          # Admin-only endpoints
    └── common/         # Shared endpoints
```

### Frontend Architecture

```
src/
├── components/         # Reusable UI components
├── pages/             # Page components
│   ├── site/         # Customer pages
│   └── admin/        # Admin pages
├── hooks/            # Custom React hooks
├── services/         # API service layer
├── providers/        # Context providers (Auth, Cart, Toast)
├── schemas/          # Zod validation schemas
├── routes/           # Route configuration
└── styles/           # Theme and global styles
```

## 🔒 Authentication

The system has two user types:
- **Regular Users (Customers)**: Can browse, purchase, and manage orders
- **Administrators**: Full access to admin panel and management features

Default admin credentials (for development):
```
Email: Create via /api/test/create-admin-user endpoint
Password: As set during creation
```

## 🚢 Deployment

### Backend Deployment

1. Build the Docker image:
```bash
cd bookstore-backend
docker build -t bookstore-backend .
```

2. Run with production environment:
```bash
docker run -p 3000:3000 --env-file .env.production bookstore-backend
```

### Frontend Deployment

1. Build for production:
```bash
cd bookstore-frontend
npm run build
```

2. The `dist/` folder contains the production-ready static files. Deploy to any static hosting service (Vercel, Netlify, etc.)

## 🤝 Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Run tests: `npm run test:e2e`
4. Ensure linting passes: `npm run lint`
5. Submit a pull request

## 📄 License

This project is for educational purposes as part of the Software Engineering Laboratory course at FATEC.

## 👥 Team

Developed by students at FATEC - Faculdade de Tecnologia

## 🐛 Troubleshooting

### Port Already in Use

If ports 3000 or 5173 are in use:

```bash
# Find and kill process on port 3000 (backend)
lsof -ti:3000 | xargs kill -9

# Find and kill process on port 5173 (frontend)
lsof -ti:5173 | xargs kill -9
```

### Docker Issues

```bash
# Remove all containers and volumes
docker compose down -v

# Rebuild from scratch
docker compose up -d --build --force-recreate
```

### Database Connection Errors

1. Ensure PostgreSQL container is running:
```bash
docker ps | grep postgres
```

2. Check container logs:
```bash
docker logs les_bookstore_postgres_container
```

3. Reset database:
```bash
docker compose down -v
docker compose up -d
```

## 📞 Support

For issues and questions:
1. Check the documentation in each module's README
2. Review the [TEST-SETUP.md](./TEST-SETUP.md) for testing issues
3. Check existing issues in the repository
4. Create a new issue with detailed information

---

**Happy Coding! 🚀**

