/// <reference types="cypress" />

interface TestUser {
  id: string
  name: string
  email: string
  token?: {
    accessToken: string
    refreshToken: string
  }
}

interface AdminUser {
  id: string
  name: string
  email: string
  token: {
    accessToken: string
    refreshToken: string
  }
}

interface TaskResult {
  success: boolean
  error?: string
}

describe('Admin - User Inactivation', () => {
  let testUser: TestUser | null = null
  let adminUser: AdminUser | null = null

  before(() => {
    // Reset database to ensure clean state
    cy.task<TaskResult>('resetTestDatabase').then((result) => {
      if (result.success) {
        cy.log('✅ Database reset successful before test suite')
      } else {
        cy.log(
          '⚠️ Database reset failed, but continuing with tests:',
          result.error,
        )
      }
    })
    
    // IMPORTANT: Clear all sessions AFTER database reset
    // This forces creation of a fresh admin for this test suite
    Cypress.session.clearAllSavedSessions()
  })

  beforeEach(function () {
    // Use a FIXED session ID for this test suite only
    // Admin is created once per suite run and reused for all tests
    const sessionId = 'admin-inactivation-session'
    
    // Use cy.session to create admin authentication
    cy.session(
      sessionId,
      () => {
        // This runs for each new session
        cy.visit('/')
        cy.setupAuthenticatedAdmin().then((admin) => {
          adminUser = admin as AdminUser
          cy.log('Admin user created and authenticated:', adminUser.email)

          // Store token in localStorage for persistence
          if (adminUser?.token?.accessToken) {
            window.localStorage.setItem(
              'accessToken',
              adminUser.token.accessToken,
            )
            window.localStorage.setItem(
              'refreshToken',
              adminUser.token.refreshToken,
            )
            // Also store the auth-token format used by the app
            window.localStorage.setItem(
              'auth-token',
              JSON.stringify(adminUser.token),
            )
          }
        })
      },
      {
        validate: () => {
          // Validate session is still active by making a test API call
          cy.window().then((win) => {
            const token = win.localStorage.getItem('accessToken')
            expect(token).to.exist
            
            // Validate the token is still valid by testing it
            cy.request({
              method: 'GET',
              url: 'http://localhost:3000/api/test/health',
              headers: {
                Authorization: `Bearer ${token}`
              },
              failOnStatusCode: false
            }).then((response) => {
              // If we get 403, the token is invalid - force recreation
              if (response.status === 403) {
                throw new Error('Token is invalid - recreating session')
              }
            })
          })
        },
      },
    )

    // Restore adminUser from session if needed
    cy.window().then((win) => {
      const accessToken = win.localStorage.getItem('accessToken')
      const refreshToken = win.localStorage.getItem('refreshToken')

      if (accessToken && refreshToken) {
        // Reconstruct adminUser token for intercepts
        if (!adminUser) {
          adminUser = {
            id: '',
            name: '',
            email: '',
            token: { accessToken, refreshToken },
          }
        } else {
          adminUser.token = { accessToken, refreshToken }
        }
        
        // Ensure auth-token is set in the correct format
        win.localStorage.setItem(
          'auth-token',
          JSON.stringify({ accessToken, refreshToken }),
        )
      }
    })

    // Set up intercept AFTER session is restored
    cy.window().then((win) => {
      const accessToken = win.localStorage.getItem('accessToken')

      if (accessToken) {
        cy.intercept('http://localhost:3000/api/**', (req) => {
          req.headers['Authorization'] = `Bearer ${accessToken}`
        }).as('apiRequest')
      }
    })

    // Create a customer user for testing
    cy.createRealUser().then((user) => {
      testUser = user as TestUser
      cy.log('✅ Customer user created for test:', testUser.email)
    })

    // Navigate to admin customers page
    cy.visit('/admin/customers')

    // Wait for page to load completely
    cy.contains('Clientes', { timeout: 10000 }).should('be.visible')
    cy.contains('Gerencie os clientes da sua livraria').should('be.visible')

    // Wait for customer card to appear (ensures data is loaded)
    cy.get('[data-testid="customer-card"]', { timeout: 15000 }).should('exist')
  })

  after(() => {
    // Clean up database after all tests
    cy.task<TaskResult>('resetTestDatabase').then((result) => {
      if (result.success) {
        cy.log('✅ Database cleaned up after test suite')
      } else {
        cy.log('⚠️ Database cleanup failed:', result.error)
      }
    })
  })

  describe('Initial User State', () => {
    it('should display user in active state initially', function () {
      if (!testUser?.id) {
        this.skip()
        return
      }

      // Search for the created user
      cy.get('[data-testid="customer-search-input"]')
        .should('be.visible')
        .clear()
        .type(testUser.email)

      // Wait for search results and verify user appears with Active status
      cy.contains(testUser.name, { timeout: 15000 }).should('be.visible')
      cy.contains(testUser.email).should('be.visible')

      // Check for the status badge
      cy.get('[data-testid="customer-card"]')
        .contains(testUser.name)
        .closest('[data-testid="customer-card"]')
        .within(() => {
          cy.contains('Ativo').should('be.visible')
        })

      cy.log('✅ User is displayed with Active status')
    })

    it('should show inactivate option in actions menu for active users', function () {
      if (!testUser?.id) {
        this.skip()
        return
      }

      // Search for the user
      cy.get('[data-testid="customer-search-input"]')
        .should('be.visible')
        .clear()
        .type(testUser.email)

      // Wait for user to appear
      cy.contains(testUser.name, { timeout: 15000 }).should('be.visible')

      // Find and click the actions button (3 dots)
      cy.get('[data-testid="customer-card"]')
        .contains(testUser.name)
        .closest('[data-testid="customer-card"]')
        .within(() => {
          cy.get('button[variant="ghost"]').last().click()
        })

      // Verify inactivate option appears
      cy.contains('Inativar Cliente', { timeout: 10000 }).should('be.visible')

      cy.log('✅ Inactivate option is available for active user')
    })
  })

  describe('Inactivation Modal and Confirmation', () => {
    it('should show confirmation modal when clicking inactivate', function () {
      if (!testUser?.id) {
        this.skip()
        return
      }

      // Search for the user
      cy.get('[data-testid="customer-search-input"]')
        .should('be.visible')
        .clear()
        .type(testUser.email)

      // Wait for user and click actions button
      cy.contains(testUser.name, { timeout: 15000 }).should('be.visible')

      cy.get('[data-testid="customer-card"]')
        .contains(testUser.name)
        .closest('[data-testid="customer-card"]')
        .within(() => {
          cy.get('button[variant="ghost"]').last().click()
        })

      // Click inactivate option
      cy.contains('Inativar Cliente').click()

      // Verify confirmation modal appears
      cy.contains('Inativar cliente?', { timeout: 10000 }).should('be.visible')
      cy.contains('Cancelar').should('be.visible')
      cy.contains('Confirmar').should('be.visible')

      cy.log('✅ Confirmation modal is displayed correctly')
    })

    it('should cancel inactivation when clicking cancel', function () {
      if (!testUser?.id) {
        this.skip()
        return
      }

      // Search for the user
      cy.get('[data-testid="customer-search-input"]')
        .should('be.visible')
        .clear()
        .type(testUser.email)

      // Open actions menu and click inactivate
      cy.contains(testUser.name, { timeout: 15000 }).should('be.visible')

      cy.get('[data-testid="customer-card"]')
        .contains(testUser.name)
        .closest('[data-testid="customer-card"]')
        .within(() => {
          cy.get('button[variant="ghost"]').last().click()
        })

      cy.contains('Inativar Cliente').click()

      // Find and click the cancel button
      cy.contains('Cancelar').as('cancelButton')
      cy.get('@cancelButton').should('be.visible').click()

      // Verify modal is closed and user is still active
      cy.contains('Inativar cliente?').should('not.exist')

      // Verify user is still displayed as active
      cy.get('[data-testid="customer-card"]')
        .contains(testUser.name)
        .closest('[data-testid="customer-card"]')
        .within(() => {
          cy.contains('Ativo').should('be.visible')
        })

      cy.log('✅ Inactivation cancelled successfully')
    })

    it('should successfully inactivate user when confirming', function () {
      if (!testUser?.id) {
        this.skip()
        return
      }

      // Search for the user
      cy.get('[data-testid="customer-search-input"]')
        .should('be.visible')
        .clear()
        .type(testUser.email)

      // IMPORTANT: Wait for search to filter - should only show 1 card
      cy.get('[data-testid="customer-card"]', { timeout: 15000 })
        .should('have.length', 1)
        .and('contain', testUser.email)  // Verify it's the correct user

      // Open actions menu and click inactivate
      cy.contains(testUser.name, { timeout: 15000 }).should('be.visible')

      cy.get('[data-testid="customer-card"]')
        .contains(testUser.name)
        .closest('[data-testid="customer-card"]')
        .within(() => {
          // Verify email to be absolutely sure we have the right card
          cy.contains(testUser.email).should('be.visible')
          cy.get('button[variant="ghost"]').last().click()
        })

      cy.contains('Inativar Cliente').click()

      // Find and store the confirm button reference before clicking
      cy.contains('Confirmar').as('confirmButton')
      cy.get('@confirmButton').should('be.visible')

      // Click the confirm button using the alias
      cy.get('@confirmButton').click()

      // Wait for the action to complete and verify status change
      cy.get('[data-testid="customer-card"]', { timeout: 20000 })
        .contains(testUser.name)
        .closest('[data-testid="customer-card"]')
        .within(() => {
          cy.contains('Inativo').should('be.visible')
          // Verify the actions button is now disabled
          cy.get('button[variant="ghost"]').last().should('be.disabled')
        })

      cy.log('✅ User successfully inactivated')
    })
  })
})
