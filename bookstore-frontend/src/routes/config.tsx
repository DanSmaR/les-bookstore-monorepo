import { ProtectedRoute } from '@/components'
import {
  AdminLayout,
  CustomerDetails,
  CustomersList,
  ErrorPage,
  ProfileEdit,
  SignIn,
  SignUp,
  SiteLayout,
} from '@/pages'
import { BooksListing, NewBook } from '@/pages/admin/book-management'
import { Cart, Catalog } from '@/pages/site/books'
import { Orders } from '@/pages/site/profile/pages/orders'
import { PaymentMethods } from '@/pages/site/profile/pages/payment-methods'

import { PATHS, ROUTES } from './constants'

// Route configuration using reusable path segments
export const adminRoutes = [
  {
    path: PATHS.CUSTOMERS, // 'customers' - reusable segment
    element: <CustomersList />,
  },
  {
    path: `${PATHS.CUSTOMERS}/:id`, // 'customers/:id' - customer details
    element: <CustomerDetails />,
  },
  {
    path: `${PATHS.CUSTOMERS}/${PATHS.NEW}`, // 'customers/new' - composed from segments
    element: <div>New Customer Form</div>,
  },
  {
    path: PATHS.BOOKS, // 'books' - reusable segment
    element: <BooksListing />,
  },
  {
    path: `${PATHS.BOOKS}/${PATHS.NEW}`, // 'books/new' - composed from segments
    element: <NewBook />,
  },
]

// Main route configuration
export const routeConfig = [
  {
    path: ROUTES.ADMIN,
    element: (
      // <ProtectedRoute requiredRoles={['admin']}>
      <AdminLayout />
      // </ProtectedRoute>
    ),
    children: adminRoutes,
  },
  {
    path: ROUTES.HOME,
    element: <SiteLayout />,
    children: [
      {
        path: '',
        element: <div>Home Page</div>,
      },
      {
        path: ROUTES.SIGNIN.slice(1), // Remove leading slash for child route
        element: <SignIn />,
      },
      {
        path: ROUTES.SIGNUP.slice(1), // Remove leading slash for child route
        element: <SignUp />,
      },
      {
        path: ROUTES.MY_PROFILE.slice(1), // Remove leading slash for child route
        element: (
          <ProtectedRoute requiredRoles={['user']}>
            <ProfileEdit />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.PAYMENT_METHODS.slice(1), // Remove leading slash for child route
        element: (
          <ProtectedRoute requiredRoles={['user']}>
            <PaymentMethods />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.ORDERS.slice(1),
        element: (
          <ProtectedRoute requiredRoles={['user']}>
            <Orders />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.CART.slice(1), // Remove leading slash for child route
        element: (
          <ProtectedRoute requiredRoles={['user']}>
            <Cart />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.CATALOG.slice(1), // Remove leading slash for child route
        element: <Catalog />,
      },
    ],
  },
  // Error page route
  {
    path: ROUTES.ERROR,
    element: <ErrorPage />,
  },
  // Catch-all route for 404s
  {
    path: '*',
    element: <ErrorPage />,
  },
]
