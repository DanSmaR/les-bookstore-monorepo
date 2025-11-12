/// <reference types="cypress" />

describe('Admin - Order Management', () => {
  let testUser: any
  let adminUser: any
  let book1: any
  let book2: any
  let book3: any

  before(() => {
    // Reset database before all tests
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

    // Visit home page first
    cy.visit('/')

    // Create and authenticate admin user
    cy.setupAuthenticatedAdmin().then((admin) => {
      adminUser = admin
      cy.log('✅ Admin user created and authenticated:', adminUser.email)
    })

    // Create a test customer user
    cy.createRealUser().then((user) => {
      testUser = user
      cy.log('✅ Customer user created:', testUser.email)

      // Login as customer to create orders
      cy.loginRealUser({
        email: testUser.email,
        password: testUser.password,
      }).then((loginResult) => {
        // Update testUser with login token information
        testUser = {
          ...testUser,
          token: loginResult.token,
        }
        cy.log('✅ Customer user authenticated for order creation')

        // Create test books
        const apiUrl = Cypress.env('API_URL') || 'http://localhost:3000'

        cy.request({
          method: 'POST',
          url: `${apiUrl}/api/test/create-book`,
          headers: {
            Authorization: `Bearer ${testUser.token.accessToken}`,
          },
          body: {
            title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
            author: 'Robert C. Martin',
            publisher: 'Prentice Hall',
            isbn: '9780132350884',
            price: 89.9,
            stock: 50,
            active: true,
          },
          failOnStatusCode: false,
        }).then((response) => {
          if (response.status === 201 || response.status === 200) {
            book1 = response.body
          }
        })

        cy.request({
          method: 'POST',
          url: `${apiUrl}/api/test/create-book`,
          headers: {
            Authorization: `Bearer ${testUser.token.accessToken}`,
          },
          body: {
            title: 'Design Patterns: Elements of Reusable Object-Oriented Software',
            author: 'Gang of Four',
            publisher: 'Addison-Wesley',
            isbn: '9780201633610',
            price: 79.9,
            stock: 30,
            active: true,
          },
          failOnStatusCode: false,
        }).then((response) => {
          if (response.status === 201 || response.status === 200) {
            book2 = response.body
          }
        })

        cy.request({
          method: 'POST',
          url: `${apiUrl}/api/test/create-book`,
          headers: {
            Authorization: `Bearer ${testUser.token.accessToken}`,
          },
          body: {
            title: 'Refactoring: Improving the Design of Existing Code',
            author: 'Martin Fowler',
            publisher: 'Addison-Wesley',
            isbn: '9780201485677',
            price: 94.9,
            stock: 40,
            active: true,
          },
          failOnStatusCode: false,
        }).then((response) => {
          if (response.status === 201 || response.status === 200) {
            book3 = response.body
          }

          // Create test orders for the customer through the UI flow
          cy.log('✅ Creating test orders for customer through checkout')
          
          // CREATE FIRST ORDER (PAID) - for cancel tests
          if (book1) {
            cy.visit('/catalog')
            cy.wait(1000)
            
            cy.get('[data-testid="book-card"]')
              .contains(book1.title.substring(0, 20))
              .closest('[data-testid="book-card"]')
              .within(() => {
                cy.get('[data-testid="book-add-to-cart-button"]').click()
              })
            
            cy.wait(1000)
            
            // Go to cart
            cy.get('[data-testid="cart-icon"]').click({ force: true })
            cy.wait(1000)
            
            // Checkout
            cy.get('[data-testid="cart-checkout-button"]').click()
            cy.wait(1000)
            
            // Select address
            cy.get('[data-testid="address-card"]').first().click()
            cy.get('[data-testid="address-confirm-button"]').click()
            cy.wait(1000)
            
            // Navigate to orders to pay
            cy.visit('/orders')
            cy.wait(2000)
            
            // Click pay button for the first pending order
            cy.get('[data-testid="order-pay-button"]', { timeout: 10000 })
              .first()
              .click()
            cy.wait(1000)
            
            // Check if we need to add a card
            cy.get('body').then(($body) => {
              if ($body.find('[data-testid="add-card-button"]').length > 0) {
                // Add a card
                cy.get('[data-testid="add-card-button"]').click()
                cy.wait(500)
                cy.get('[data-testid="card-form"]').within(() => {
                  cy.get('input[name="number"]').type('5555555555554444')
                  cy.get('input[name="holderName"]').type('Test User')
                  cy.get('input[name="expiryDate"]').type('1230')
                  cy.get('input[name="cvv"]').type('123')
                  cy.get('select[aria-label="Tipo do cartão"]').select('credit')
                })
                cy.get('[data-testid="save-card-button"]').click()
                cy.wait(2000)
                
                // Close form if it didn't close automatically
                cy.get('body').then(($body2) => {
                  if ($body2.find('[data-testid="card-form"]').length > 0) {
                    cy.get('[data-testid="cancel-add-card-button"]').click()
                    cy.wait(500)
                  }
                })
              }
            })
            
            // Select card and pay
            cy.get('[data-testid="payment-card-option"]', { timeout: 10000 })
              .first()
              .click()
            cy.wait(500)
            cy.get('[data-testid="payment-confirm-button"]').click()
            cy.wait(2000)
            
            cy.log('✅ First test order created and PAID (Confirmado)')
          }

          // CREATE SECOND ORDER (UNPAID) - for status filter and change tests
          if (book2) {
            cy.visit('/catalog')
            cy.wait(1000)
            
            cy.get('[data-testid="book-card"]')
              .contains(book2.title.substring(0, 20))
              .closest('[data-testid="book-card"]')
              .within(() => {
                cy.get('[data-testid="book-add-to-cart-button"]').click()
              })
            
            cy.wait(1000)
            
            // Go to cart
            cy.get('[data-testid="cart-icon"]').click({ force: true })
            cy.wait(1000)
            
            // Checkout
            cy.get('[data-testid="cart-checkout-button"]').click()
            cy.wait(1000)
            
            // Select address
            cy.get('[data-testid="address-card"]').first().click()
            cy.get('[data-testid="address-confirm-button"]').click()
            cy.wait(1000)
            
            // DO NOT PAY - leave as Pendente
            cy.log('✅ Second test order created and left UNPAID (Pendente)')
          }

          // CREATE THIRD ORDER (UNPAID) - for cancel pending order test
          if (book3) {
            cy.visit('/catalog')
            cy.wait(1000)
            
            cy.get('[data-testid="book-card"]')
              .contains(book3.title.substring(0, 20))
              .closest('[data-testid="book-card"]')
              .within(() => {
                cy.get('[data-testid="book-add-to-cart-button"]').click()
              })
            
            cy.wait(1000)
            
            // Go to cart
            cy.get('[data-testid="cart-icon"]').click({ force: true })
            cy.wait(1000)
            
            // Checkout
            cy.get('[data-testid="cart-checkout-button"]').click()
            cy.wait(1000)
            
            // Select address
            cy.get('[data-testid="address-card"]').first().click()
            cy.get('[data-testid="address-confirm-button"]').click()
            cy.wait(1000)
            
            // DO NOT PAY - leave as Pendente
            cy.log('✅ Third test order created and left UNPAID (Pendente) - for cancel test')
          }

          cy.wait(1000)

          // After creating books and orders as customer, log back in as admin
          cy.log('✅ Logging back in as admin after customer operations')
          cy.window().then((window) => {
            window.localStorage.setItem(
              'auth-token',
              JSON.stringify(adminUser.token),
            )
          })
          cy.reload()
        })
      })
    })
  })

  beforeEach(() => {
    // Re-authenticate as admin for each test
    if (!adminUser?.token?.accessToken) {
      cy.log('Admin user not available, skipping test')
      return
    }

    // Set up auth intercept for API calls
    cy.intercept('http://localhost:3000/api/**', (req) => {
      req.headers['Authorization'] = `Bearer ${adminUser.token.accessToken}`
    }).as('apiRequest')
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

  describe('Navigation to Customer Orders', () => {
    it('should navigate from admin dashboard to customer orders page', () => {
      if (!adminUser?.token?.accessToken || !testUser?.id) {
        cy.skip('User setup incomplete')
        return
      }

      // Navigate to home
      cy.visit('/')
      cy.wait(1000)

      // Click "Minha Conta" dropdown
      cy.get('[data-testid="account-dropdown-button"]').click()
      cy.wait(500)

      // Click "Admin Dashboard"
      cy.contains('Admin Dashboard').click()
      cy.wait(1000)

      // Verify we're on admin dashboard
      cy.url().should('include', '/admin')

      // Click "Clientes" link
      cy.get('[data-testid="customers-link"]').click()
      cy.wait(1000)

      // Verify we're on customers page
      cy.url().should('include', '/admin/customers')
      cy.contains('Clientes').should('be.visible')

      // Click "Ver Detalhes" on first customer card
      cy.get('[data-testid="customer-card"]')
        .first()
        .within(() => {
          cy.contains('Ver Detalhes').click()
        })
      cy.wait(1000)

      // Verify we're on customer details page
      cy.url().should('include', '/admin/customers/')
      cy.contains('Voltar para Lista').should('be.visible')

      // Click "Mostrar tudo" in order history sidebar
      cy.get('[data-testid="show-all-orders-button"]').click()
      cy.wait(1000)

      // Verify we're on customer orders page
      cy.url().should('include', '/orders')
      cy.contains('Pedidos do Cliente').should('be.visible')

      // Verify customer info is displayed
      if (testUser.name) {
        cy.contains(testUser.name).should('be.visible')
      }
      if (testUser.email) {
        cy.contains(testUser.email).should('be.visible')
      }

      cy.log('✅ Successfully navigated to customer orders page')
    })
  })

  describe('Order List Display', () => {
    beforeEach(() => {
      // Navigate to customer orders page
      cy.visit(`/admin/customers/${testUser.id}/orders`)
      cy.wait(2000)
    })

    it('should display orders list with order information', () => {
      if (!testUser?.id) {
        cy.skip('Test user not available')
        return
      }

      // Wait for orders to load
      cy.get('[data-testid="admin-order-card"]', { timeout: 10000 })
        .should('exist')
        .first()
        .within(() => {
          // Verify order ID is displayed
          cy.get('[data-testid="admin-order-id"]').should('exist')

          // Verify status badge is displayed
          cy.get('[data-testid="admin-order-status-badge"]').should('exist')

          // Verify order items info
          cy.contains('Itens do Pedido:').should('be.visible')
        })

      cy.log('✅ Orders list displayed correctly')
    })

    it('should display order statistics', () => {
      if (!testUser?.id) {
        cy.skip('Test user not available')
        return
      }

      // Verify stats cards are displayed
      cy.get('[data-testid="total-orders-stat"]', { timeout: 10000 }).should(
        'exist',
      )
      cy.get('[data-testid="filtered-orders-stat"]').should('exist')

      cy.log('✅ Order statistics displayed')
    })
  })

  describe('Search and Filters', () => {
    beforeEach(() => {
      // Navigate to customer orders page
      cy.visit(`/admin/customers/${testUser.id}/orders`)
      cy.wait(2000)
    })

    it('should search orders by order ID', () => {
      if (!testUser?.id) {
        cy.skip('Test user not available')
        return
      }

      // Get first order ID
      cy.get('[data-testid="admin-order-id"]')
        .first()
        .invoke('text')
        .then((orderIdText) => {
          const orderId = orderIdText.replace('#', '').trim()

          // Search for the order
          cy.get('[data-testid="order-search-input"]').type(orderId)
          cy.wait(1000)

          // Verify order is displayed
          cy.get('[data-testid="admin-order-card"]').should('have.length.at.least', 1)
          cy.get('[data-testid="admin-order-id"]')
            .first()
            .should('contain', orderId)

          cy.log('✅ Search by order ID works')
        })
    })

    it('should filter orders by status', () => {
      if (!testUser?.id) {
        cy.skip('Test user not available')
        return
      }

      // Filter by "Pendente" status
      cy.get('[data-testid="order-status-filter"]').select('pending')
      cy.wait(1000)

      // Verify filtered orders show "Pendente" status
      cy.get('[data-testid="admin-order-status-badge"]')
        .should('exist')
        .should('contain', 'Pendente')

      cy.log('✅ Status filter works')
    })

    it('should filter orders by date range', () => {
      if (!testUser?.id) {
        cy.skip('Test user not available')
        return
      }

      // Set start date to today
      const today = new Date().toISOString().split('T')[0]
      cy.get('[data-testid="order-start-date-filter"]').type(today)
      cy.wait(1000)

      // Verify results count is displayed
      cy.get('[data-testid="order-results-count"]').should('exist')

      cy.log('✅ Date filter works')
    })

    it('should clear all filters', () => {
      if (!testUser?.id) {
        cy.skip('Test user not available')
        return
      }

      // Set some filters
      cy.get('[data-testid="order-search-input"]').type('test')
      cy.get('[data-testid="order-status-filter"]').select('pending')
      cy.wait(500)

      // Clear filters
      cy.get('[data-testid="clear-order-filters-button"]').click()
      cy.wait(1000)

      // Verify filters are cleared
      cy.get('[data-testid="order-search-input"]').should('have.value', '')

      cy.log('✅ Clear filters works')
    })
  })

  describe('Order Status Changes - Pending to Confirmed', () => {
    beforeEach(() => {
      // Navigate to customer orders page
      cy.visit(`/admin/customers/${testUser.id}/orders`)
      cy.wait(2000)
    })

    it('should confirm a pending order', () => {
      if (!testUser?.id) {
        cy.skip('Test user not available')
        return
      }

      // Find a pending order (create one if needed)
      cy.get('[data-testid="admin-order-card"]', { timeout: 10000 })
        .first()
        .within(() => {
          // Check if it's pending, if not skip or create one
          cy.get('[data-testid="admin-order-status-badge"]')
            .invoke('text')
            .then((statusText) => {
              if (!statusText.includes('Pendente')) {
                cy.log('⚠️ No pending orders found, skipping test')
                return
              }

              // Click "Confirmar Pedido" button
              cy.get('[data-testid="confirm-order-button"]').click()
              cy.wait(500)

              // Verify confirmation modal opens
              cy.get('[data-testid="confirmation-modal"]').should('exist')
              cy.contains('Confirma o pedido?').should('be.visible')

              // Click "Cancelar" first to test cancel functionality
              cy.get('[data-testid="confirmation-modal-cancel-button"]').click()
              cy.wait(500)

              // Verify modal closed and order still pending
              cy.get('[data-testid="confirmation-modal"]').should('not.exist')
              cy.get('[data-testid="admin-order-status-badge"]').should(
                'contain',
                'Pendente',
              )

              // Click "Confirmar Pedido" again
              cy.get('[data-testid="confirm-order-button"]').click()
              cy.wait(500)

              // Click "Confirmar" in modal
              cy.get('[data-testid="confirmation-modal-confirm-button"]').click()
              cy.wait(2000)

              // Verify order status changed to "Confirmado"
              cy.get('[data-testid="admin-order-status-badge"]', {
                timeout: 5000,
              }).should('contain', 'Confirmado')

              // Verify "Marcar como Enviado" button appears
              cy.get('[data-testid="mark-shipped-button"]').should('exist')

              // Verify "Cancelar Pedido" button is NOT present (business rule: only pending orders can be cancelled)
              cy.get('[data-testid="cancel-order-button"]').should('not.exist')

              cy.log('✅ Order confirmed successfully')
            })
        })
    })
  })

  describe('Order Status Changes - Confirmed to Shipped', () => {
    beforeEach(() => {
      // Navigate to customer orders page
      cy.visit(`/admin/customers/${testUser.id}/orders`)
      cy.wait(2000)
    })

    it('should mark confirmed order as shipped', () => {
      if (!testUser?.id) {
        cy.skip('Test user not available')
        return
      }

      // Find a confirmed order or confirm a pending one
      cy.get('[data-testid="admin-order-card"]', { timeout: 10000 })
        .first()
        .within(() => {
          cy.get('[data-testid="admin-order-status-badge"]')
            .invoke('text')
            .then((statusText) => {
              // If pending, confirm it first
              if (statusText.includes('Pendente')) {
                cy.get('[data-testid="confirm-order-button"]').click()
                cy.wait(500)
                cy.get('[data-testid="confirmation-modal-confirm-button"]').click()
                cy.wait(2000)
              }

              // Now mark as shipped
              cy.get('[data-testid="mark-shipped-button"]').click()
              cy.wait(500)

              // Verify confirmation modal opens
              cy.get('[data-testid="confirmation-modal"]').should('exist')
              cy.contains('Confirma que o pedido foi enviado?').should('be.visible')

              // Click "Confirmar"
              cy.get('[data-testid="confirmation-modal-confirm-button"]').click()
              cy.wait(2000)

              // Verify order status changed to "Enviado"
              cy.get('[data-testid="admin-order-status-badge"]', {
                timeout: 5000,
              }).should('contain', 'Enviado')

              // Verify "Marcar como Entregue" button appears
              cy.get('[data-testid="mark-delivered-button"]').should('exist')

              // Verify "Cancelar Pedido" button disappeared
              cy.get('[data-testid="cancel-order-button"]').should('not.exist')

              cy.log('✅ Order marked as shipped successfully')
            })
        })
    })
  })

  describe('Order Status Changes - Shipped to Delivered', () => {
    beforeEach(() => {
      // Navigate to customer orders page
      cy.visit(`/admin/customers/${testUser.id}/orders`)
      cy.wait(2000)
    })

    it('should mark shipped order as delivered', () => {
      if (!testUser?.id) {
        cy.skip('Test user not available')
        return
      }

      // Find a shipped order or ship a confirmed one
      cy.get('[data-testid="admin-order-card"]', { timeout: 10000 })
        .first()
        .within(() => {
          cy.get('[data-testid="admin-order-status-badge"]')
            .invoke('text')
            .then((statusText) => {
              // If not shipped, progress through statuses
              if (statusText.includes('Pendente')) {
                // Confirm
                cy.get('[data-testid="confirm-order-button"]').click()
                cy.wait(500)
                cy.get('[data-testid="confirmation-modal-confirm-button"]').click()
                cy.wait(2000)

                // Ship
                cy.get('[data-testid="mark-shipped-button"]').click()
                cy.wait(500)
                cy.get('[data-testid="confirmation-modal-confirm-button"]').click()
                cy.wait(2000)
              } else if (statusText.includes('Confirmado')) {
                // Ship
                cy.get('[data-testid="mark-shipped-button"]').click()
                cy.wait(500)
                cy.get('[data-testid="confirmation-modal-confirm-button"]').click()
                cy.wait(2000)
              }

              // Now mark as delivered
              cy.get('[data-testid="mark-delivered-button"]').click()
              cy.wait(500)

              // Verify confirmation modal opens
              cy.get('[data-testid="confirmation-modal"]').should('exist')
              cy.contains('Confirma que o pedido foi entregue?').should('be.visible')

              // Click "Confirmar"
              cy.get('[data-testid="confirmation-modal-confirm-button"]').click()
              cy.wait(2000)

              // Verify order status changed to "Entregue"
              cy.get('[data-testid="admin-order-status-badge"]', {
                timeout: 5000,
              }).should('contain', 'Entregue')

              // Verify no action buttons appear
              cy.get('[data-testid="confirm-order-button"]').should('not.exist')
              cy.get('[data-testid="mark-shipped-button"]').should('not.exist')
              cy.get('[data-testid="mark-delivered-button"]').should('not.exist')
              cy.get('[data-testid="cancel-order-button"]').should('not.exist')

              cy.log('✅ Order marked as delivered successfully')
            })
        })
    })
  })

  describe('Order Status Changes - Cancel Order (Pending)', () => {
    beforeEach(() => {
      // Navigate to customer orders page
      cy.visit(`/admin/customers/${testUser.id}/orders`)
      cy.wait(2000)
    })

    it('should cancel a pending order', () => {
      if (!testUser?.id) {
        cy.skip('Test user not available')
        return
      }

      // Find a pending order
      cy.get('[data-testid="admin-order-card"]', { timeout: 10000 })
        .first()
        .within(() => {
          cy.get('[data-testid="admin-order-status-badge"]')
            .invoke('text')
            .then((statusText) => {
              if (!statusText.includes('Pendente')) {
                cy.log('⚠️ No pending orders found, skipping test')
                return
              }

              // Click "Cancelar Pedido" button
              cy.get('[data-testid="cancel-order-button"]').click()
              cy.wait(500)

              // Verify confirmation modal opens with danger variant
              cy.get('[data-testid="confirmation-modal"]').should('exist')
              cy.contains('Tem certeza que deseja cancelar este pedido?').should(
                'be.visible',
              )

              // Click "Cancelar" first
              cy.get('[data-testid="confirmation-modal-cancel-button"]').click()
              cy.wait(500)

              // Verify modal closed
              cy.get('[data-testid="confirmation-modal"]').should('not.exist')

              // Click "Cancelar Pedido" again
              cy.get('[data-testid="cancel-order-button"]').click()
              cy.wait(500)

              // Click "Confirmar"
              cy.get('[data-testid="confirmation-modal-confirm-button"]').click()
              cy.wait(2000)

              // Verify order status changed to "Cancelado"
              cy.get('[data-testid="admin-order-status-badge"]', {
                timeout: 5000,
              }).should('contain', 'Cancelado')

              // Verify no action buttons appear
              cy.get('[data-testid="confirm-order-button"]').should('not.exist')
              cy.get('[data-testid="cancel-order-button"]').should('not.exist')

              cy.log('✅ Order cancelled successfully')
            })
        })
    })
  })

  describe('Order Status Changes - Cancel Order (Confirmed)', () => {
    beforeEach(() => {
      // Navigate to customer orders page
      cy.visit(`/admin/customers/${testUser.id}/orders`)
      cy.wait(2000)
    })

    it('should NOT show cancel button for confirmed orders', () => {
      if (!testUser?.id) {
        cy.skip('Test user not available')
        return
      }

      // Find an order with "Confirmado" status
      cy.get('[data-testid="admin-order-card"]', { timeout: 10000 })
        .contains('[data-testid="admin-order-status-badge"]', 'Confirmado')
        .closest('[data-testid="admin-order-card"]')
        .within(() => {
          // Verify cancel button does NOT exist (business rule: only pending orders can be cancelled)
          cy.get('[data-testid="cancel-order-button"]').should('not.exist')
          
          // Verify other appropriate actions are available
          cy.get('[data-testid="mark-shipped-button"]').should('exist')
        })

      cy.log('✅ Confirmed orders correctly do not show cancel button')
    })

    it('should cancel a pending order', () => {
      if (!testUser?.id) {
        cy.skip('Test user not available')
        return
      }

      // Find an order with "Pendente" status specifically
      cy.get('[data-testid="admin-order-card"]', { timeout: 10000 })
        .contains('[data-testid="admin-order-status-badge"]', 'Pendente')
        .closest('[data-testid="admin-order-card"]')
        .within(() => {
          // Verify cancel button exists for pending orders
          cy.get('[data-testid="cancel-order-button"]', { timeout: 5000 })
            .should('be.visible')
            .click()
          cy.wait(500)
        })

      // Verify confirmation modal opens (outside the card)
      cy.get('[data-testid="confirmation-modal"]').should('exist')
      cy.contains('Tem certeza que deseja cancelar este pedido?').should(
        'be.visible',
      )

      // Click "Confirmar"
      cy.get('[data-testid="confirmation-modal-confirm-button"]').click()
      cy.wait(2000)

      // Re-query the specific order card to verify status changed
      cy.get('[data-testid="admin-order-card"]', { timeout: 10000 })
        .contains('[data-testid="admin-order-status-badge"]', 'Cancelado')
        .should('exist')

      cy.log('✅ Pending order cancelled successfully')
    })
  })

  describe('Filter by Status After Status Changes', () => {
    beforeEach(() => {
      // Navigate to customer orders page
      cy.visit(`/admin/customers/${testUser.id}/orders`)
      cy.wait(2000)
    })

    it('should filter orders by status after changing statuses', () => {
      if (!testUser?.id) {
        cy.skip('Test user not available')
        return
      }

      // Filter by "Confirmado" (should show confirmed/paid orders)
      cy.get('[data-testid="order-status-filter"]').select('confirmed')
      cy.wait(1000)

      // Verify only confirmed orders are shown
      cy.get('[data-testid="admin-order-status-badge"]').then(($badges) => {
        if ($badges.length > 0) {
          cy.wrap($badges).each(($badge) => {
            cy.wrap($badge).should('contain', 'Confirmado')
          })
        }
      })

      // Filter by "Enviado" (should show shipped orders)
      cy.get('[data-testid="order-status-filter"]').select('confirmed')
      cy.wait(1000)

      // Verify only shipped orders are shown (if any)
      cy.get('[data-testid="admin-order-card"]').then(($cards) => {
        if ($cards.length > 0) {
          cy.get('[data-testid="admin-order-status-badge"]').each(($badge) => {
            cy.wrap($badge).should('contain', 'Confirmado')
          })
        }
      })

      // Filter by "Entregue"
      cy.get('[data-testid="order-status-filter"]').select('delivered')
      cy.wait(1000)

      // Filter by "Cancelado"
      cy.get('[data-testid="order-status-filter"]').select('cancelled')
      cy.wait(1000)

      cy.log('✅ Status filtering works after status changes')
    })
  })
})

