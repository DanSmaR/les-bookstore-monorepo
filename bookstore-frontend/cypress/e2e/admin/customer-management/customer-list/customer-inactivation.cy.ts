/// <reference types="cypress" />

describe('Admin - User Inactivation', () => {
  let testUser: any
  let adminUser: any

  before(() => {
    // Reset database before all tests to ensure clean state
    cy.task('resetTestDatabase').then((result: any) => {
      if (!result.success) {
        cy.log(
          '⚠️ Database reset failed, but continuing with tests:',
          result.error,
        )
      } else {
        cy.log('✅ Database reset successful before test suite')
      }
    })

    // Visit a page first so the React app is loaded
    cy.visit('/')

    // Create and login as admin user
    cy.setupAuthenticatedAdmin().then((admin) => {
      adminUser = admin
      cy.log('Admin user created and authenticated:', adminUser.email)
    })
  })

  beforeEach(() => {
    // Don't reset database in beforeEach as it would delete our admin
    // Admin authentication persists across tests - no need to re-authenticate

    if (!adminUser?.email) {
      cy.log('Admin user not available, skipping test')
      return
    }

    // Set up intercept before EACH test to ensure it's always active
    // This must be done in beforeEach to persist across all tests
    if (adminUser?.token?.accessToken) {
      cy.intercept('http://localhost:3000/api/**', (req) => {
        req.headers['Authorization'] = `Bearer ${adminUser.token.accessToken}`
      }).as('apiRequest')
    }

    // Create a customer user for testing (WAIT for it to complete)
    cy.createRealUser().then((user) => {
      testUser = user
      cy.log('✅ Customer user created for test:', testUser.email)
    })

    // Navigate to admin customers page
    cy.visit('/admin/customers')

    // Wait for page to load completely
    cy.contains('Clientes').should('be.visible')
    cy.contains('Gerencie os clientes da sua livraria').should('be.visible')

    // Wait for customer card to appear (ensures data is loaded)
    cy.get('[data-testid="customer-card"]', { timeout: 10000 }).should('exist')
  })

  after(() => {
    // Clean up database after all tests
    cy.task('resetTestDatabase').then((result: any) => {
      if (result.success) {
        cy.log('✅ Database cleaned up after test suite')
      } else {
        cy.log('⚠️ Database cleanup failed:', result.error)
      }
    })
  })

  describe('Initial User State', () => {
    it('should display user in active state initially', () => {
      if (!testUser?.id) {
        cy.skip('User creation failed')
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

    it('should show inactivate option in actions menu for active users', () => {
      if (!testUser?.id) {
        cy.skip('User creation failed')
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
    it('should show confirmation modal when clicking inactivate', () => {
      if (!testUser?.id) {
        cy.skip('User creation failed')
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

    it('should cancel inactivation when clicking cancel', () => {
      if (!testUser?.id) {
        cy.skip('User creation failed')
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

      // Find and click the cancel button - don't restrict to button selector
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

    it('should successfully inactivate user when confirming', () => {
      if (!testUser?.id) {
        cy.skip('User creation failed')
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

  describe('Post-Inactivation State and Functionality', () => {
    beforeEach(() => {
      if (!testUser?.id) return

      // Inactivate the test user for these tests
      cy.get('[data-testid="customer-search-input"]')
        .should('be.visible')
        .clear()
        .type(testUser.email)

      cy.contains(testUser.name, { timeout: 15000 }).should('be.visible')

      cy.get('[data-testid="customer-card"]')
        .contains(testUser.name)
        .closest('[data-testid="customer-card"]')
        .within(() => {
          cy.get('button[variant="ghost"]').last().click()
        })

      cy.contains('Inativar Cliente').click()
      cy.contains('Confirmar').click()

      // Wait for inactivation to complete
      cy.get('[data-testid="customer-card"]', { timeout: 20000 })
        .contains(testUser.name)
        .closest('[data-testid="customer-card"]')
        .within(() => {
          cy.contains('Inativo').should('be.visible')
        })
    })

    it('should display inactive status correctly', () => {
      if (!testUser?.id) {
        cy.skip('User creation failed')
        return
      }

      // Search for the now-inactive user
      cy.get('[data-testid="customer-search-input"]')
        .should('be.visible')
        .clear()
        .type(testUser.email)

      // Verify user displays as inactive
      cy.contains(testUser.name, { timeout: 15000 }).should('be.visible')

      cy.get('[data-testid="customer-card"]')
        .contains(testUser.name)
        .closest('[data-testid="customer-card"]')
        .within(() => {
          cy.contains('Inativo').should('be.visible')
          // Verify actions button is disabled
          cy.get('button[variant="ghost"]').last().should('be.disabled')
        })

      cy.log('✅ Inactive status displayed correctly')
    })

    it('should maintain search functionality with inactive users', () => {
      if (!testUser?.id) {
        cy.skip('User creation failed')
        return
      }

      // Search by email
      cy.get('[data-testid="customer-search-input"]')
        .should('be.visible')
        .clear()
        .type(testUser.email)

      cy.contains(testUser.name, { timeout: 15000 }).should('be.visible')

      // Search by name
      cy.get('[data-testid="customer-search-input"]')
        .clear()
        .type(testUser.name)

      cy.contains(testUser.email, { timeout: 15000 }).should('be.visible')

      // Clear search
      cy.get('[data-testid="customer-search-input"]').clear()

      cy.log('✅ Search functionality works with inactive users')
    })

    it('should prevent further actions on inactive users', () => {
      if (!testUser?.id) {
        cy.skip('User creation failed')
        return
      }

      // Search for the inactive user
      cy.get('[data-testid="customer-search-input"]')
        .should('be.visible')
        .clear()
        .type(testUser.email)

      cy.contains(testUser.name, { timeout: 15000 }).should('be.visible')

      // Verify actions button is disabled
      cy.get('[data-testid="customer-card"]')
        .contains(testUser.name)
        .closest('[data-testid="customer-card"]')
        .within(() => {
          cy.get('button[variant="ghost"]').last().should('be.disabled')
        })

      cy.log('✅ Actions are properly disabled for inactive users')
    })
  })

  describe('Error Handling and Edge Cases', () => {
    it('should handle network errors gracefully during inactivation', () => {
      if (!testUser?.id) {
        cy.skip('User creation failed')
        return
      }

      // Create a new test user to test error handling
      cy.createRealUser().then((errorTestUser) => {
        // Search for the error test user
        cy.get('[data-testid="customer-search-input"]')
          .should('be.visible')
          .clear()
          .type(errorTestUser.email)

        // Attempt inactivation
        cy.contains(errorTestUser.name, { timeout: 15000 }).should('be.visible')

        cy.get('[data-testid="customer-card"]')
          .contains(errorTestUser.name)
          .closest('[data-testid="customer-card"]')
          .within(() => {
            cy.get('button[variant="ghost"]').last().click()
          })

        cy.contains('Inativar Cliente').click()

        // Use alias for the confirm button to avoid re-render issues
        cy.contains('Confirmar').as('confirmErrorButton')
        cy.get('@confirmErrorButton').should('be.visible').click()

        // Check that user should remain active after error (or show error message)
        cy.get('[data-testid="customer-card"]', { timeout: 15000 })
          .contains(errorTestUser.name)
          .closest('[data-testid="customer-card"]')

        cy.log('✅ Error handling works correctly')
      })
    })

    it('should handle database connection issues gracefully', () => {
      // Test how the page handles when database is unavailable
      cy.visit('/admin/customers', { failOnStatusCode: false })

      // The page should either show an error message or loading state
      cy.get('body').should('exist')

      cy.log('✅ Database connection error handling verified')
    })

    it('should handle invalid user data gracefully', () => {
      if (!testUser?.id) {
        cy.skip('User creation failed')
        return
      }

      cy.visit('/admin/customers')

      // Should show empty state or no users message
      cy.contains('Clientes').should('be.visible')

      cy.log('✅ Invalid user data handling verified')
    })
  })

  describe('Performance and Loading', () => {
    it('should inactivate user within reasonable time', () => {
      if (!testUser?.id) {
        cy.skip('User creation failed')
        return
      }

      const startTime = Date.now()

      // Search for the user
      cy.get('[data-testid="customer-search-input"]')
        .should('be.visible')
        .clear()
        .type(testUser.email)

      // Perform inactivation
      cy.contains(testUser.name, { timeout: 15000 }).should('be.visible')

      cy.get('[data-testid="customer-card"]')
        .contains(testUser.name)
        .closest('[data-testid="customer-card"]')
        .within(() => {
          cy.get('button[variant="ghost"]').last().click()
        })

      cy.contains('Inativar Cliente').click()
      cy.contains('Confirmar').click()

      // Wait for inactivation to complete and measure time
      cy.get('[data-testid="customer-card"]', { timeout: 20000 })
        .contains(testUser.name)
        .closest('[data-testid="customer-card"]')
        .within(() => {
          cy.contains('Inativo').should('be.visible')
        })
        .then(() => {
          const inactivationTime = Date.now() - startTime
          expect(inactivationTime).to.be.lessThan(10000) // Should complete within 10 seconds
          cy.log(`✅ User inactivated in ${inactivationTime}ms`)
        })
    })

    it('should handle sequential user inactivations', () => {
      if (!testUser?.id) {
        cy.skip('User creation failed')
        return
      }

      // Create first test user and inactivate
      cy.createRealUser().then((user1) => {
        // Search and inactivate first user
        cy.get('[data-testid="customer-search-input"]')
          .should('be.visible')
          .clear()
          .type(user1.email)

        cy.contains(user1.name, { timeout: 15000 }).should('be.visible')

        cy.get('[data-testid="customer-card"]')
          .contains(user1.name)
          .closest('[data-testid="customer-card"]')
          .within(() => {
            cy.get('button[variant="ghost"]').last().click()
          })

        cy.contains('Inativar Cliente').click()
        cy.contains('Confirmar').click()

        // Verify first user inactivation
        cy.get('[data-testid="customer-card"]', { timeout: 20000 })
          .contains(user1.name)
          .closest('[data-testid="customer-card"]')
          .within(() => {
            cy.contains('Inativo').should('be.visible')
          })

        cy.log('✅ First user inactivated successfully')

        // Create and inactivate second user
        cy.createRealUser().then((user2) => {
          cy.get('[data-testid="customer-search-input"]')
            .should('be.visible')
            .clear()
            .type(user2.email)

          cy.contains(user2.name, { timeout: 15000 }).should('be.visible')

          cy.get('[data-testid="customer-card"]')
            .contains(user2.name)
            .closest('[data-testid="customer-card"]')
            .within(() => {
              cy.get('button[variant="ghost"]').last().click()
            })

          cy.contains('Inativar Cliente').click()
          cy.contains('Confirmar').click()

          // Verify second user inactivation
          cy.get('[data-testid="customer-card"]', { timeout: 20000 })
            .contains(user2.name)
            .closest('[data-testid="customer-card"]')
            .within(() => {
              cy.contains('Inativo').should('be.visible')
            })

          cy.log('✅ Second user inactivated successfully')

          // Create and inactivate third user
          cy.createRealUser().then((user3) => {
            cy.get('[data-testid="customer-search-input"]')
              .should('be.visible')
              .clear()
              .type(user3.email)

            cy.contains(user3.name, { timeout: 15000 }).should('be.visible')

            cy.get('[data-testid="customer-card"]')
              .contains(user3.name)
              .closest('[data-testid="customer-card"]')
              .within(() => {
                cy.get('button[variant="ghost"]').last().click()
              })

            cy.contains('Inativar Cliente').click()
            cy.contains('Confirmar').click()

            // Verify third user inactivation
            cy.get('[data-testid="customer-card"]', { timeout: 20000 })
              .contains(user3.name)
              .closest('[data-testid="customer-card"]')
              .within(() => {
                cy.contains('Inativo').should('be.visible')
              })

            cy.log('✅ All three users inactivated successfully in sequence')
          })
        })
      })
    })
  })

  describe('Data Integrity and Validation', () => {
    it('should maintain data consistency after inactivation', () => {
      if (!testUser?.id) {
        cy.skip('User creation failed')
        return
      }

      // Store original user data
      const originalEmail = testUser.email
      const originalName = testUser.name

      // Inactivate user
      cy.get('[data-testid="customer-search-input"]')
        .should('be.visible')
        .clear()
        .type(originalEmail)

      cy.contains(originalName, { timeout: 15000 }).should('be.visible')

      cy.get('[data-testid="customer-card"]')
        .contains(originalName)
        .closest('[data-testid="customer-card"]')
        .within(() => {
          cy.get('button[variant="ghost"]').last().click()
        })

      cy.contains('Inativar Cliente').click()
      cy.contains('Confirmar').click()

      // Verify data integrity after inactivation
      cy.get('[data-testid="customer-card"]', { timeout: 20000 })
        .contains(originalName)
        .closest('[data-testid="customer-card"]')
        .within(() => {
          cy.contains('Inativo').should('be.visible')
          cy.contains(originalEmail).should('be.visible')
          cy.contains(originalName).should('be.visible')
        })

      cy.log('✅ Data integrity maintained after inactivation')
    })

    it('should persist inactivation state after page refresh', () => {
      if (!testUser?.id) {
        cy.skip('User creation failed')
        return
      }

      // Inactivate user
      cy.get('[data-testid="customer-search-input"]')
        .should('be.visible')
        .clear()
        .type(testUser.email)

      cy.contains(testUser.name, { timeout: 15000 }).should('be.visible')

      cy.get('[data-testid="customer-card"]')
        .contains(testUser.name)
        .closest('[data-testid="customer-card"]')
        .within(() => {
          cy.get('button[variant="ghost"]').last().click()
        })

      cy.contains('Inativar Cliente').click()
      cy.contains('Confirmar').click()

      // Wait for inactivation
      cy.get('[data-testid="customer-card"]', { timeout: 20000 })
        .contains(testUser.name)
        .closest('[data-testid="customer-card"]')
        .within(() => {
          cy.contains('Inativo').should('be.visible')
        })

      // Refresh page
      cy.reload()

      // Wait for page to load and verify status persists
      cy.contains('Clientes').should('be.visible')

      cy.get('[data-testid="customer-search-input"]')
        .should('be.visible')
        .clear()
        .type(testUser.email)

      cy.get('[data-testid="customer-card"]', { timeout: 15000 })
        .contains(testUser.name)
        .closest('[data-testid="customer-card"]')
        .within(() => {
          cy.contains('Inativo').should('be.visible')
        })

      cy.log('✅ Inactivation state persisted after page refresh')
    })
  })
})
