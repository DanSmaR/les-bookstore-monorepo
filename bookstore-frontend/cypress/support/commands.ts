/// <reference types="cypress" />

import { generateValidCPFNumbers } from './cpf-utils'

declare global {
  namespace Cypress {
    interface Chainable {
      createRealUser(userData?: any): Chainable<any>
      createAdminUser(userData?: any): Chainable<any>
      createCustomerWithOrders(): Chainable<any>
      loginRealUser(credentials: {
        email: string
        password: string
      }): Chainable<any>
      setupAuthenticatedUser(userData?: any): Chainable<any>
      setupAuthenticatedAdmin(userData?: any): Chainable<any>
      seedTicketsForUser(userId: string, token: string): Chainable<any>
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

          // Decode JWT token to extract user information
          // The userId is in the 'sub' claim of the JWT payload
          const decodeJwtPayload = (token: string) => {
            try {
              const parts = token.split('.')
              if (parts.length !== 3) {
                return null
              }
              const payload = parts[1]
              const decodedPayload = window.atob(
                payload.replace(/-/g, '+').replace(/_/g, '/'),
              )
              return JSON.parse(decodedPayload)
            } catch {
              return null
            }
          }

          const payload = decodeJwtPayload(tokenData.accessToken)
          const userId = payload?.sub || null

          cy.log(
            `[loginRealUser] Decoded JWT payload - sub (userId): ${userId}, email: ${payload?.email}`,
          )

          // Set authentication in localStorage using the correct key
          // Chain the return to ensure localStorage is set before continuing
          return cy.window().then((window) => {
            window.localStorage.setItem('auth-token', JSON.stringify(tokenData))
            
            return {
              token: tokenData,
              user: {
                id: userId,
                email: credentials.email,
              },
            }
          })
        } else {
          cy.log('Login failed:', response.body)

          // Return mock for testing
          const mockToken = {
            accessToken: 'mock-access-token',
            refreshToken: 'mock-refresh-token',
          }

          return cy.window().then((window) => {
            window.localStorage.setItem('auth-token', JSON.stringify(mockToken))
            
            return {
              token: mockToken,
              user: {
                id: 'mock-user-id',
                email: credentials.email,
              },
            }
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
 * Seeds tickets for a test user (public promotional and user-specific tickets)
 */
Cypress.Commands.add('seedTicketsForUser', (userId: string, token: string) => {
  const apiUrl = Cypress.env('API_URL') || 'http://localhost:3000'
  const validUntil = new Date()
  validUntil.setDate(validUntil.getDate() + 180) // 180 days from now

  // Debug: Log the userId being used
  cy.log(`[seedTicketsForUser] Starting with userId: ${userId}`)

  // Public promotional tickets (no ownerId)
  const publicTickets = [
    {
      code: 'PROMO10',
      value: 10,
      type: 'percentage' as const,
      nature: 'promotional' as const,
      description: 'Desconto de 10% em toda loja',
      validUntil: validUntil.toISOString(),
      status: 'active' as const,
    },
    {
      code: 'BLACKFRIDAY',
      value: 25,
      type: 'percentage' as const,
      nature: 'promotional' as const,
      description: 'Black Friday - 25% OFF',
      validUntil: validUntil.toISOString(),
      status: 'active' as const,
    },
    {
      code: 'FRETE50',
      value: 50.0,
      type: 'raw' as const,
      nature: 'promotional' as const,
      description: 'R$ 50 de desconto',
      validUntil: validUntil.toISOString(),
      status: 'active' as const,
    },
  ]

  // User-specific promotional ticket
  const userPromotionalTicket = {
    code: 'WELCOME15',
    value: 15,
    type: 'percentage' as const,
    nature: 'promotional' as const,
    ownerId: userId, // This should be the userId passed to the function
    description: 'Cupom de boas-vindas - 15% OFF',
    validUntil: validUntil.toISOString(),
    status: 'active' as const,
  }

  // Debug: Log the ownerId in userPromotionalTicket
  cy.log(
    `[seedTicketsForUser] userPromotionalTicket.ownerId: ${userPromotionalTicket.ownerId}`,
  )

  // Exchange tickets (user-specific)
  const exchangeTickets = [
    {
      code: 'TROCA100',
      value: 100.0,
      type: 'raw' as const,
      nature: 'exchange' as const,
      ownerId: userId, // This should be the userId passed to the function
      description: 'Crédito de troca - R$ 100',
      validUntil: validUntil.toISOString(),
      status: 'active' as const,
    },
    {
      code: 'TROCA50',
      value: 50.0,
      type: 'raw' as const,
      nature: 'exchange' as const,
      ownerId: userId, // This should be the userId passed to the function
      description: 'Crédito de troca - R$ 50',
      validUntil: validUntil.toISOString(),
      status: 'active' as const,
    },
  ]

  // Debug: Log the ownerId in exchangeTickets
  cy.log(
    `[seedTicketsForUser] exchangeTickets[0].ownerId: ${exchangeTickets[0].ownerId}`,
  )
  cy.log(
    `[seedTicketsForUser] exchangeTickets[1].ownerId: ${exchangeTickets[1].ownerId}`,
  )

  // Helper function to create a single ticket
  const createTicket = (ticketData: any) => {
    // Build body explicitly, ensuring ownerId is included if present
    const body: any = {
      code: ticketData.code,
      value: ticketData.value,
      type: ticketData.type,
      nature: ticketData.nature,
      description: ticketData.description,
      validUntil: ticketData.validUntil,
      status: ticketData.status,
    }

    // Always include ownerId if the property exists in ticketData
    // Use Object.prototype.hasOwnProperty to check if property exists
    // Note: We don't check if it's truthy, just if the property exists
    if (Object.prototype.hasOwnProperty.call(ticketData, 'ownerId')) {
      body.ownerId = ticketData.ownerId
      cy.log(
        `[Cypress] Including ownerId in body: ${ticketData.ownerId} (type: ${typeof ticketData.ownerId})`,
      )
    } else {
      cy.log(`[Cypress] ownerId property not found in ticketData`)
    }

    // Debug log before request
    cy.log(
      `[Cypress] Creating ticket: ${ticketData.code}, ownerId from data: ${ticketData.ownerId}, ownerId in body: ${body.ownerId || 'not set'}, body keys: ${Object.keys(body).join(', ')}`,
    )

    return cy
      .request({
        method: 'POST',
        url: `${apiUrl}/api/test/create-ticket`,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body,
        failOnStatusCode: false,
      })
      .then((response) => {
        if (response.status === 201 || response.status === 200) {
          cy.log(`✅ Successfully created ticket: ${ticketData.code}`)
          if (response.body?.ticket) {
            cy.log(
              `   Saved with ownerId: ${response.body.ticket.ownerId || 'null'}`,
            )
          }
        } else {
          cy.log(
            `❌ Failed to create ticket: ${ticketData.code}`,
            response.body,
          )
        }
        return cy.wrap(response)
      })
  }

  // Create all tickets sequentially (chain them)
  return createTicket(publicTickets[0])
    .then((response) => {
      if (response.status === 201 || response.status === 200) {
        cy.log(`✅ Created public ticket: ${publicTickets[0].code}`)
      }
      return createTicket(publicTickets[1])
    })
    .then((response) => {
      if (response.status === 201 || response.status === 200) {
        cy.log(`✅ Created public ticket: ${publicTickets[1].code}`)
      }
      return createTicket(publicTickets[2])
    })
    .then((response) => {
      if (response.status === 201 || response.status === 200) {
        cy.log(`✅ Created public ticket: ${publicTickets[2].code}`)
      }
      return createTicket(userPromotionalTicket)
    })
    .then((response) => {
      if (response.status === 201 || response.status === 200) {
        cy.log(
          `✅ Created user promotional ticket: ${userPromotionalTicket.code}`,
        )
      }
      return createTicket(exchangeTickets[0])
    })
    .then((response) => {
      if (response.status === 201 || response.status === 200) {
        cy.log(`✅ Created exchange ticket: ${exchangeTickets[0].code}`)
      }
      return createTicket(exchangeTickets[1])
    })
    .then((response) => {
      if (response.status === 201 || response.status === 200) {
        cy.log(`✅ Created exchange ticket: ${exchangeTickets[1].code}`)
      }
      cy.log('✅ Ticket seeding completed')
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

/**
 * Creates a customer user with at least one order for testing
 */
Cypress.Commands.add('createCustomerWithOrders', () => {
  const apiUrl = Cypress.env('API_URL') || 'http://localhost:3000'

  return cy.createRealUser().then((user) => {
    const typedUser = user as {
      id: string
      email: string
      name: string
      token?: { accessToken: string; refreshToken: string }
    }

    // Create a test book
    return cy
      .request({
        method: 'POST',
        url: `${apiUrl}/api/test/create-book`,
        body: {
          title: `Test Book ${Date.now()}`,
          author: 'Test Author',
          publisher: 'Test Publisher',
          isbn: `978${Date.now().toString().slice(-10)}`,
          price: 50.0,
          stock: 100,
          active: true,
        },
        failOnStatusCode: false,
      })
      .then((bookResponse) => {
        if (bookResponse.status !== 201 && bookResponse.status !== 200) {
          cy.log('⚠️ Book creation failed:', bookResponse.status)
          return cy.wrap(typedUser)
        }

        const book = bookResponse.body
        cy.log('✅ Book created:', book.id)

        // Create an order for this user
        return cy
          .request({
            method: 'POST',
            url: `${apiUrl}/api/test/create-order`,
            body: {
              userId: typedUser.id,
              bookId: book.id,
              quantity: 1,
            },
            failOnStatusCode: false,
          })
          .then((orderResponse) => {
            if (orderResponse.status === 201 || orderResponse.status === 200) {
              cy.log('✅ Order created for user:', typedUser.email)
            } else {
              cy.log('⚠️ Order creation failed:', orderResponse.status)
              cy.log('Response:', JSON.stringify(orderResponse.body))
            }
            return cy.wrap(typedUser)
          })
      })
  })
})

export {}
