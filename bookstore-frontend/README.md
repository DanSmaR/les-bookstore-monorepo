# 📚 Bookstore Frontend

A modern, responsive React application for an online bookstore, featuring both customer-facing pages and an administrative panel.

## 🛠️ Technology Stack

- **Framework**: [React](https://react.dev/) 19
- **Build Tool**: [Vite](https://vite.dev/) 7
- **Language**: TypeScript 5.8
- **Routing**: React Router v7
- **Styling**: Styled Components 6
- **Forms**: React Hook Form + Zod validation
- **HTTP Client**: Axios
- **Charts**: Recharts
- **Icons**: Phosphor React
- **E2E Testing**: Cypress 15

## 📁 Project Structure

```
src/
├── components/            # Reusable UI Components
│   ├── Button/
│   ├── Input/
│   ├── Card/
│   ├── Modal/
│   ├── Form/
│   ├── Chatbot/
│   └── ...
│
├── pages/                # Page Components
│   ├── site/            # Customer-Facing Pages
│   │   ├── Home/
│   │   ├── Catalog/
│   │   ├── Cart/
│   │   ├── Orders/
│   │   └── Profile/
│   └── admin/           # Admin Panel Pages
│       ├── Dashboard/
│       ├── Customers/
│       ├── Books/
│       ├── Orders/
│       └── Analytics/
│
├── hooks/               # Custom React Hooks
│   ├── use-auth/
│   ├── use-cart/
│   ├── use-book/
│   ├── use-order/
│   └── ...
│
├── providers/           # Context Providers
│   ├── auth/           # Authentication context
│   ├── cart/           # Shopping cart context
│   └── toast/          # Toast notifications
│
├── services/           # API Service Layer
│   ├── auth.service.ts
│   ├── book.service.ts
│   ├── order.service.ts
│   ├── user.service.ts
│   └── axios-app.ts    # Axios configuration
│
├── schemas/            # Zod Validation Schemas
│   ├── auth-schemas.ts
│   ├── book-schemas.ts
│   ├── profile-schemas.ts
│   └── ...
│
├── routes/             # Route Configuration
│   ├── routes.tsx      # Route definitions
│   └── config.tsx      # Route builder
│
├── styles/             # Global Styles & Theme
│   ├── global.ts
│   └── default-theme.ts
│
├── storage/            # Local Storage Management
│   ├── auth.storage.ts
│   └── cart.storage.ts
│
└── utils/             # Utility Functions
    ├── formatters.ts
    ├── input-masks.ts
    └── constants.ts
```

## 🚀 Getting Started

### Prerequisites

- Node.js 22+
- npm or yarn
- Backend API running (see [bookstore-backend](../bookstore-backend/README.md))

### Installation

```bash
# Install dependencies
npm install
```

### Environment Configuration

Create a `.env` file in the project root (optional):

```env
# API Configuration
API_URL=http://localhost:3000/api

# Development Settings
ENABLE_API_DELAY=false
```

> **Note**: If not specified, the app defaults to `http://localhost:3000/api`

### Running the Application

```bash
# Start development server
npm run dev

# The application will be available at http://localhost:5173
```

### Building for Production

```bash
# Build the application
npm run build

# Preview production build
npm run preview
```

## 📝 Available Scripts

### Development

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint and show issues |

### Testing

| Command | Description |
|---------|-------------|
| `npm run cy:open` | Open Cypress Test UI (interactive) |
| `npm run cy:run` | Run Cypress tests (headless) |
| `npm run test:e2e` | Run all E2E tests |
| `npm run test:e2e:open` | Open Cypress UI |
| `npm run test:e2e:setup` | Start backend test environment |
| `npm run test:e2e:teardown` | Stop backend test environment |
| `npm run test:e2e:full` | Complete test cycle (setup → test → teardown) |

## 🎨 Features

### For Customers

#### 🏠 Home & Catalog
- Browse books with pagination
- Search and filter books
- View detailed book information
- Add books to cart

#### 🛒 Shopping Cart
- Add/remove items
- Adjust quantities
- Apply discount coupons (promotional & exchange)
- Real-time price calculation
- Automatic coupon optimization

#### 🎟️ Coupon System
- View available coupons
- Select and apply coupons
- Support for:
  - **Promotional Coupons**: Percentage or fixed discount
  - **Exchange Coupons**: Credit from refunds

#### 📦 Order Management
- Place orders with multiple items
- Multiple payment methods:
  - Credit Card
  - Multiple cards per order
  - Exchange coupons
- Track order status
- View order history
- Request refunds

#### 💳 Payment
- Save multiple payment cards
- Secure card management
- Split payments across cards
- Pay with exchange coupons

#### 👤 Profile Management
- Update personal information
- Manage delivery addresses
- Manage payment cards
- Change password
- View purchase history

#### 🤖 AI Chatbot
- AI-powered product recommendations
- Order assistance
- General inquiries
- Context-aware responses

### For Administrators

#### 📊 Analytics Dashboard
- Total revenue
- Total orders
- Active customers
- Available books
- Top-selling books
- Sales trends
- Category performance

#### 👥 Customer Management
- View all customers
- Search and filter
- View customer details
- View customer orders
- Inactivate accounts
- Manage customer data

#### 📚 Book Management
- Add new books
- Edit book information
- Manage inventory
- Set pricing
- Activate/deactivate books
- Upload book covers

#### 📦 Order Management
- View all orders
- Filter by status
- Update order status
- Process refunds
- View order details
- Track payments

#### 🎟️ Coupon Management
- Create promotional coupons
- Set expiration dates
- Define discount rules
- Track usage
- Manage exchange coupons

#### 💰 Refund Management
- Review refund requests
- Approve/reject refunds
- Generate exchange coupons
- Track refund history

## 🎯 User Interface

### Design System

The application uses a cohesive design system with:

- **Color Palette**: Primary, secondary, and semantic colors
- **Typography**: Consistent font sizes and weights
- **Spacing**: 8px base unit system
- **Components**: Reusable, accessible components
- **Responsive**: Mobile-first design

### Theme

Colors are defined in `src/styles/default-theme.ts`:

```typescript
{
  primary: '#00875F',     // Main brand color
  secondary: '#8D8D99',   // Secondary actions
  success: '#00875F',     // Success states
  warning: '#FBA94C',     // Warning states
  danger: '#F75A68',      // Error states
  info: '#81D8F7',        // Information
  ...
}
```

## 🔐 Authentication

### User Authentication

The app supports two user types:

1. **Regular Users (Customers)**
   - Register via sign-up form
   - Access: Home, Catalog, Cart, Orders, Profile
   
2. **Administrators**
   - Created via backend API
   - Access: Admin panel + all customer features

### Protected Routes

- **Public Routes**: Home, Catalog, Sign In, Sign Up
- **Authenticated Routes**: Cart, Orders, Profile, Chatbot
- **Admin Routes**: All routes under `/admin/*`

### Authentication Flow

```
1. User signs up or logs in
2. Receives JWT access token and refresh token
3. Tokens stored in localStorage
4. Axios automatically includes token in requests
5. Token refreshed automatically when expired
6. User logged out if refresh fails
```

## 🛠️ State Management

### Context Providers

#### AuthProvider
- Manages user authentication state
- Handles sign in/sign up/sign out
- Automatic token refresh
- User profile information

#### CartProvider
- Shopping cart state
- Add/remove items
- Update quantities
- Persist cart in localStorage
- Calculate totals

#### ToastProvider
- Global notification system
- Success/error/info messages
- Auto-dismiss
- Queue management

## 📡 API Integration

### Axios Configuration

The app uses a custom Axios instance with:

- **Base URL**: Configured from environment
- **Interceptors**: 
  - Request: Adds authentication token
  - Response: Handles errors and token refresh
- **Error Handling**: Centralized error processing
- **Type Safety**: Full TypeScript support

### API Services

Each feature has a dedicated service:

- `AuthService`: Authentication operations
- `BookService`: Book catalog operations
- `OrderService`: Order management
- `UserService`: User profile operations
- `TicketService`: Coupon operations
- `CardService`: Payment card management
- `ChatService`: AI chatbot integration

## 🧪 Testing

### E2E Testing with Cypress

The project includes comprehensive end-to-end tests covering:

- Authentication flows
- Product browsing and search
- Shopping cart functionality
- Order placement
- Payment processing
- Coupon application
- Refund requests
- Admin panel operations

### Running Tests

```bash
# Start backend test environment
cd ../bookstore-backend
yarn docker:test:up

# In another terminal, start frontend
npm run dev

# In another terminal, run Cypress
npm run cy:open  # Interactive mode
# OR
npm run cy:run   # Headless mode
```

### Writing Tests

Tests are located in `cypress/e2e/` and organized by feature:

```
cypress/
├── e2e/
│   ├── auth/                 # Authentication tests
│   ├── site/
│   │   └── purchasing/       # Customer flow tests
│   └── admin/
│       └── customer-management/  # Admin tests
├── support/
│   ├── commands.ts          # Custom Cypress commands
│   └── e2e.ts               # Test configuration
└── fixtures/
    └── user.json            # Test data
```

See [TEST-SETUP.md](../TEST-SETUP.md) for detailed testing documentation.

## 🎨 Styling

### Styled Components

The app uses `styled-components` for:

- Component-scoped styles
- Theme integration
- Dynamic styling
- CSS-in-JS benefits

Example:

```typescript
import styled from 'styled-components'

export const Button = styled.button`
  background: ${props => props.theme.primary};
  color: white;
  padding: ${props => props.theme.spacing.md};
  border-radius: 8px;
  
  &:hover {
    background: ${props => props.theme.primaryDark};
  }
`
```

### Responsive Design

Breakpoints:

```typescript
{
  mobile: '480px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1280px'
}
```

## 🚀 Performance Optimization

- **Code Splitting**: Route-based lazy loading
- **Tree Shaking**: Vite automatically removes unused code
- **Asset Optimization**: Images and fonts optimized
- **Caching**: API responses cached with Axios
- **Memoization**: React hooks for expensive computations

## 🐛 Debugging

### Development Tools

- React DevTools
- Redux DevTools (if applicable)
- Vite HMR (Hot Module Replacement)
- Browser DevTools

### Common Issues

#### Port 5173 Already in Use

```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9

# Or change port in vite.config.ts
```

#### API Connection Issues

1. Ensure backend is running on `http://localhost:3000`
2. Check `API_URL` in `.env`
3. Verify CORS is enabled on backend

#### Build Errors

```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

## 📦 Deployment

### Production Build

```bash
# Build for production
npm run build

# The dist/ folder contains production-ready files
```

### Deployment Platforms

The static build can be deployed to:

- **Vercel**: `vercel deploy`
- **Netlify**: `netlify deploy`
- **GitHub Pages**: Configure in repository settings
- **AWS S3 + CloudFront**: Upload `dist/` folder
- **Nginx/Apache**: Serve `dist/` folder

### Environment Variables for Production

Set these in your deployment platform:

```env
API_URL=https://your-production-api.com/api
ENABLE_API_DELAY=false
```

### Nginx Configuration Example

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/bookstore-frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend:3000/api;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 🤝 Contributing

1. Follow the existing code structure
2. Use TypeScript strictly
3. Follow the component pattern
4. Write tests for new features
5. Run linter before committing: `npm run lint`
6. Use conventional commit messages

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vite.dev)
- [React Router Documentation](https://reactrouter.com)
- [Styled Components Documentation](https://styled-components.com)
- [Cypress Documentation](https://docs.cypress.io)

## 📄 License

This project is for educational purposes as part of the Software Engineering Laboratory course at FATEC.

---

**Built with ⚛️ React + ⚡ Vite**
