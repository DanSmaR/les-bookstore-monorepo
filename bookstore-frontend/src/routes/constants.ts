// Base path segments - single source of truth
const PATHS = {
  ADMIN: 'admin',
  CUSTOMERS: 'customers',
  BOOKS: 'books',
  NEW: 'new',
  EDIT: 'edit',
} as const

// Base routes - build from path segments
const BASE_ROUTES = {
  ROOT: '/',
  ADMIN: `/${PATHS.ADMIN}`,
} as const

// Admin section routes - composed from base routes
const ADMIN_ROUTES = {
  BASE: BASE_ROUTES.ADMIN,
  CUSTOMERS: `${BASE_ROUTES.ADMIN}/${PATHS.CUSTOMERS}`,
  BOOKS: `${BASE_ROUTES.ADMIN}/${PATHS.BOOKS}`,
} as const

// Complete route structure - no duplication
export const ROUTES = {
  // Public routes
  HOME: BASE_ROUTES.ROOT,
  SIGNIN: '/sign-in',
  SIGNUP: '/sign-up',
  MY_PROFILE: '/my-profile',
  CATALOG: '/catalog',
  ERROR: '/error',
  CART: '/cart',
  ORDERS: '/orders',
  ADDRESSES: '/addresses',
  PAYMENT_METHODS: '/payment-methods',
  PROFILE_EDIT_USER: '/profile/edit/:id', // Para admin editar qualquer usuário

  // Admin routes
  ADMIN: ADMIN_ROUTES.BASE,
  ADMIN_CUSTOMERS: ADMIN_ROUTES.CUSTOMERS,
  ADMIN_CUSTOMERS_NEW: `${ADMIN_ROUTES.CUSTOMERS}/${PATHS.NEW}`,
  ADMIN_BOOKS: ADMIN_ROUTES.BOOKS,
  ADMIN_BOOKS_NEW: `${ADMIN_ROUTES.BOOKS}/${PATHS.NEW}`,
} as const

// Route patterns for React Router (with parameters) - reuse base routes
export const ROUTE_PATTERNS = {
  ADMIN_CUSTOMER_VIEW: `${ADMIN_ROUTES.CUSTOMERS}/:id`,
  ADMIN_CUSTOMER_ORDERS: `${ADMIN_ROUTES.CUSTOMERS}/:id/orders`,
  ADMIN_BOOK_EDIT: `${ADMIN_ROUTES.BOOKS}/:id/${PATHS.EDIT}`,
  ADMIN_BOOK_VIEW: `${ADMIN_ROUTES.BOOKS}/:id`,
  PROFILE_EDIT_USER: '/profile/edit/:id', // Para editar usuário específico
} as const

// Helper functions for dynamic routes - use route patterns as base
export const createRoute = {
  adminCustomerView: (id: string) =>
    ROUTE_PATTERNS.ADMIN_CUSTOMER_VIEW.replace(':id', id),
  adminCustomerOrders: (id: string) =>
    ROUTE_PATTERNS.ADMIN_CUSTOMER_ORDERS.replace(':id', id),
  adminBookEdit: (id: string) =>
    ROUTE_PATTERNS.ADMIN_BOOK_EDIT.replace(':id', id),
  adminBookView: (id: string) =>
    ROUTE_PATTERNS.ADMIN_BOOK_VIEW.replace(':id', id),
  profileEditUser: (id: string) =>
    ROUTE_PATTERNS.PROFILE_EDIT_USER.replace(':id', id),
} as const

// Export path segments for use in route configuration
export { PATHS }
