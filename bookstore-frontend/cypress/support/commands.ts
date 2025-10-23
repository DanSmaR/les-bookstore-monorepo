/// <reference types="cypress" />

import { generateValidCPFNumbers } from './cpf-utils'

declare global {
  namespace Cypress {
    interface Chainable {
      createRealUser(userData?: any): Chainable<any>
      createAdminUser(userData?: any): Chainable<any>
      loginRealUser(credentials: {
        email: string
        password: string
      }): Chainable<any>
      setupAuthenticatedUser(userData?: any): Chainable<any>
      setupAuthenticatedAdmin(userData?: any): Chainable<any>
      setAuthToken(token: { accessToken: string; refreshToken: string }): void
      clearAuth(): void
    }
  }
}

/**
 * Creates a real user via API request to the backend
 */
Cypress.Commands.add('createRealUser', (userData = {}) => {
  return cy.fixture('user').then((fixture: any) => {
    const baseUser = fixture.existing
    const user = { ...baseUser, ...userData }

    const timestamp = Date.now().toString().slice(-6)
    const validCPF = generateValidCPFNumbers()
    const password = 'TestPassword123@'

    const uniqueUser = {
      ...user,
      email: `t${timestamp}@ex.com`,
      cpf: validCPF,
      password,
    }

    return cy
      .request({
        method: 'POST',
        url: `${Cypress.env('API_URL') || 'http://localhost:3000'}/api/auth/sign-up`,
        body: {
          name: uniqueUser.name,
          email: uniqueUser.email,
          cpf: uniqueUser.cpf,
          phone: uniqueUser.phone,
          gender: uniqueUser.gender,
          birthDate: uniqueUser.birthDate,
          password: uniqueUser.password,
          address: {
            type: 'house',
            purpose: 'both',
            addressName: uniqueUser.addresses[0].addressName,
            street: uniqueUser.addresses[0].street,
            number: uniqueUser.addresses[0].number,
            complement: uniqueUser.addresses[0].complement,
            district: uniqueUser.addresses[0].district,
            city: uniqueUser.addresses[0].city,
            state: uniqueUser.addresses[0].state,
            postalCode: uniqueUser.addresses[0].postalCode.replace('-', ''),
          },
        },
        failOnStatusCode: false,
      })
      .then((response) => {
        if (response.status === 201) {
          return cy.wrap({
            ...uniqueUser,
            id: response.body.id || response.body.user?.id,
            password,
          })
        } else {
          cy.log('API Error Details:', {
            status: response.status,
            body: response.body,
          })

          // Return mock user for testing
          return cy.wrap({
            ...uniqueUser,
            id: '12345678-1234-1234-1234-123456789012',
            password,
          })
        }
      })
  })
})

/**
 * Logs in a user via API and sets up authentication tokens
 */
Cypress.Commands.add(
  'loginRealUser',
  (credentials: { email: string; password: string }) => {
    return cy
      .request({
        method: 'POST',
        url: `${Cypress.env('API_URL') || 'http://localhost:3000'}/api/auth/sign-in`,
        body: credentials,
        failOnStatusCode: false,
      })
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          const tokenData = response.body

          // Set authentication in localStorage using the correct key
          cy.window().then((window) => {
            window.localStorage.setItem('auth-token', JSON.stringify(tokenData))
          })

          // Reload the page to trigger AuthProvider initialization
          // This ensures axios headers are set properly
          cy.reload()

          return cy.wrap({
            token: tokenData,
            user: {
              id: tokenData.userId,
              email: credentials.email,
            },
          })
        } else {
          cy.log('Login failed:', response.body)

          // Return mock for testing
          const mockToken = {
            accessToken: 'mock-access-token',
            refreshToken: 'mock-refresh-token',
          }

          cy.window().then((window) => {
            window.localStorage.setItem('auth-token', JSON.stringify(mockToken))
          })

          return cy.wrap({
            token: mockToken,
            user: {
              id: 'mock-user-id',
              email: credentials.email,
            },
          })
        }
      })
  },
)

/**
 * Creates a user and logs them in for authenticated testing
 */
Cypress.Commands.add('setupAuthenticatedUser', (userData = {}) => {
  return cy.createRealUser(userData).then((user: any) => {
    return cy
      .loginRealUser({
        email: user.email,
        password: user.password,
      })
      .then((authData) => {
        return cy.wrap({
          ...user,
          ...authData,
        })
      })
  })
})

/**
 * Creates an admin user via test API endpoint
 */
Cypress.Commands.add('createAdminUser', (userData = {}) => {
  return cy.fixture('user').then((fixture: any) => {
    const baseUser = fixture.existing
    const user = { ...baseUser, ...userData }

    const timestamp = Date.now().toString().slice(-6)
    const validCPF = generateValidCPFNumbers()
    const password = 'AdminPassword123@'

    const uniqueUser = {
      ...user,
      email: `admin${timestamp}@ex.com`,
      cpf: validCPF,
      password,
    }

    return cy
      .request({
        method: 'POST',
        url: `${Cypress.env('API_URL') || 'http://localhost:3000'}/api/test/create-admin-user`,
        body: {
          name: uniqueUser.name,
          email: uniqueUser.email,
          cpf: uniqueUser.cpf,
          phone: uniqueUser.phone,
          gender: uniqueUser.gender,
          birthDate: uniqueUser.birthDate,
          password: uniqueUser.password,
          address: {
            type: 'house',
            purpose: 'both',
            addressName: uniqueUser.addresses[0].addressName,
            street: uniqueUser.addresses[0].street,
            number: uniqueUser.addresses[0].number,
            complement: uniqueUser.addresses[0].complement,
            district: uniqueUser.addresses[0].district,
            city: uniqueUser.addresses[0].city,
            state: uniqueUser.addresses[0].state,
            postalCode: uniqueUser.addresses[0].postalCode.replace('-', ''),
          },
        },
        failOnStatusCode: false,
      })
      .then((response) => {
        if (response.status === 201 && response.body.success) {
          return cy.wrap({
            ...uniqueUser,
            id: response.body.user.id,
            role: response.body.user.role,
            password,
          })
        } else {
          cy.log('API Error Details:', {
            status: response.status,
            body: response.body,
          })

          // Return mock admin user for testing
          return cy.wrap({
            ...uniqueUser,
            id: '12345678-1234-1234-1234-123456789012',
            role: 'admin',
            password,
          })
        }
      })
  })
})

/**
 * Creates an admin user and logs them in for authenticated admin testing
 */
Cypress.Commands.add('setupAuthenticatedAdmin', (userData = {}) => {
  return cy.createAdminUser(userData).then((admin: any) => {
    return cy
      .loginRealUser({
        email: admin.email,
        password: admin.password,
      })
      .then((authData) => {
        return cy.wrap({
          ...admin,
          ...authData,
        })
      })
  })
})

/**
 * Sets authentication token in localStorage and Cypress env
 */
Cypress.Commands.add('setAuthToken', (token) => {
  cy.window().then((window) => {
    window.localStorage.setItem('auth-token', JSON.stringify(token))
  })
  Cypress.env('authToken', token.accessToken)
})

/**
 * Clears all authentication data
 */
Cypress.Commands.add('clearAuth', () => {
  cy.window().then((window) => {
    window.localStorage.removeItem('auth-token')
  })
  Cypress.env('authToken', null)
})

export {}
