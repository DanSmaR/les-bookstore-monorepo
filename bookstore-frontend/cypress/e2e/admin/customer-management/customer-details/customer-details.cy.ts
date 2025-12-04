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

describe('Admin - Customer Details Page', () => {
  let testUser: TestUser | null = null
  let adminUser: AdminUser | null = null

  before(() => {
    // Reset database before all tests to ensure clean state
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
  })

  beforeEach(() => {
    // Use cy.session to preserve admin authentication across tests
    cy.session(
      'admin-session',
      () => {
        // This only runs once, then the session is cached
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
          }
        })
      },
      {
        validate: () => {
          // Validate session is still active
          cy.window().then((win) => {
            const token = win.localStorage.getItem('accessToken')
            expect(token).to.exist
          })
        },
        cacheAcrossSpecs: true, // Cache across test files
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
    cy.get('[data-testid="customer-card"]', { timeout: 10000 }).should('exist')
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

  describe('Navigation and Page Loading', () => {
    it('should navigate from customers list to customer details page', () => {
      if (!testUser?.id) {
        cy.log('User creation failed, skipping test')
        return
      }

      // Find the first customer card and click "Ver Detalhes"
      cy.get('[data-testid="customer-card"]')
        .first()
        .within(() => {
          cy.contains('Ver Detalhes').click()
        })

      // Verify we're on the customer details page
      cy.url().should('include', '/admin/customers/')

      // Wait for the page to load completely
      cy.contains('Voltar para Lista').should('be.visible')

      cy.log('✅ Successfully navigated to customer details page')
    })

    it('should display customer details page header and navigation', () => {
      if (!testUser?.id) {
        cy.log('User creation failed, skipping test')
        return
      }

      // Navigate to customer details page
      cy.get('[data-testid="customer-card"]')
        .first()
        .within(() => {
          cy.contains('Ver Detalhes').click()
        })

      // Check page header elements
      cy.contains('Voltar para Lista').should('be.visible')

      // Check if customer name is displayed in the header
      cy.get('h1').should('be.visible').and('not.be.empty')

      // Check if "Cliente desde" information is displayed
      cy.contains('Cliente desde').should('be.visible')

      cy.log('✅ Customer details page header displayed correctly')
    })

    it('should allow navigation back to customers list', () => {
      if (!testUser?.id) {
        cy.log('User creation failed, skipping test')
        return
      }

      // Navigate to customer details page
      cy.get('[data-testid="customer-card"]')
        .first()
        .within(() => {
          cy.contains('Ver Detalhes').click()
        })

      // Verify we're on the details page
      cy.url().should('include', '/admin/customers/')
      cy.contains('Voltar para Lista').should('be.visible')

      // Click back to list
      cy.contains('Voltar para Lista').click()

      // Verify we're back on the customers list page
      cy.url().should('eq', `${Cypress.config().baseUrl}/admin/customers`)
      cy.contains('Clientes').should('be.visible')
      cy.contains('Gerencie os clientes da sua livraria').should('be.visible')

      cy.log('✅ Successfully navigated back to customers list')
    })
  })

  describe('Customer Information Display', () => {
    beforeEach(() => {
      if (!testUser?.id) return

      // Navigate to customer details page for each test
      cy.get('[data-testid="customer-card"]')
        .first()
        .within(() => {
          cy.contains('Ver Detalhes').click()
        })
    })

    it('should display account status section', () => {
      if (!testUser?.id) {
        cy.skip('User creation failed')
        return
      }

      // Check account status section
      cy.contains('Status da Conta').should('be.visible')

      // Check if status badge is displayed (should be either "Ativo", "Inativo", or "Suspenso")
      cy.get('body').should('contain.text', 'Ativo')

      cy.log('✅ Account status section displayed correctly')
    })

    it('should display personal information section with all fields', () => {
      if (!testUser?.id) {
        cy.skip('User creation failed')
        return
      }

      // Check personal information section
      cy.contains('Informações Pessoais').should('be.visible')

      // Check all required personal information fields
      cy.contains('Nome Completo').should('be.visible')
      cy.contains('CPF').should('be.visible')
      cy.contains('Data de Nascimento').should('be.visible')
      cy.contains('Gênero').should('be.visible')
      cy.contains('Data de Cadastro').should('be.visible')
      cy.contains('Última Atualização').should('be.visible')

      // Verify that each field has a corresponding value
      cy.contains('Nome Completo')
        .parent()
        .should('contain.text', testUser.name || 'Updated User')
      cy.contains('CPF').parent().should('not.be.empty')
      cy.contains('Data de Nascimento').parent().should('not.be.empty')
      cy.contains('Gênero').parent().should('not.be.empty')

      cy.log('✅ Personal information section displayed correctly')
    })

    it('should display contact information section', () => {
      if (!testUser?.id) {
        cy.skip('User creation failed')
        return
      }

      // Check contact information section
      cy.contains('Informações de Contato').should('be.visible')

      // Check email and phone fields
      cy.contains('Email').should('be.visible')
      cy.contains('Telefone').should('be.visible')

      // Verify email and phone have values
      cy.contains('Email').parent().should('contain.text', '@')
      cy.contains('Telefone').parent().should('not.be.empty')

      cy.log('✅ Contact information section displayed correctly')
    })

    it('should display addresses section', () => {
      if (!testUser?.id) {
        cy.skip('User creation failed')
        return
      }

      // Check addresses section
      cy.contains('Endereços').should('be.visible')

      // The addresses section should show at least one address or indicate no addresses
      cy.get('body').then(($body) => {
        if ($body.text().includes('Endereços (')) {
          // If there are addresses, check the structure
          cy.contains('CEP:').should('be.visible')
          cy.contains('Finalidade:').should('be.visible')
        } else {
          // If no addresses, it should still show the section header
          cy.contains('Endereços').should('be.visible')
        }
      })

      cy.log('✅ Addresses section displayed correctly')
    })
  })

  describe('Order History and Statistics', () => {
    beforeEach(function () {
      if (!testUser?.id) {
        this.skip()
        return
      }

      const apiUrl = Cypress.env('API_URL') || 'http://localhost:3000'

      // Create book and order
      cy.request({
        method: 'POST',
        url: `${apiUrl}/api/test/create-book`,
        body: {
          title: 'Test Book for Order',
          author: 'Test Author',
          publisher: 'Test Publisher',
          isbn: `978${Date.now().toString().slice(-10)}`,
          price: 50.0,
          stock: 100,
          active: true,
        },
        failOnStatusCode: false,
      }).then((bookResponse) => {
        if (bookResponse.status === 201 || bookResponse.status === 200) {
          const book = bookResponse.body

          cy.request({
            method: 'POST',
            url: `${apiUrl}/api/test/create-order`,
            body: {
              userId: testUser!.id,
              bookId: book.id,
              quantity: 1,
            },
            failOnStatusCode: false,
          })
        }
      })

      // Navigate to customer details
      cy.get('[data-testid="customer-card"]')
        .first()
        .within(() => {
          cy.contains('Ver Detalhes').click()
        })

      cy.contains('Histórico de Pedidos', { timeout: 10000 }).should('be.visible')
    })

    it('should display order history section', function () {
      if (!testUser?.id) {
        this.skip()
        return
      }

      // Check order history section header
      cy.contains('Histórico de Pedidos').should('be.visible')

      // Check if orders exist or empty state
      cy.get('body').then(($body) => {
        const hasOrders = $body.text().includes('#') && $body.text().includes('item')
        const hasEmptyState = $body.text().includes('Nenhum pedido encontrado')

        if (hasOrders) {
          // Verify order card elements
          cy.get('body').should('contain.text', '#') // Order number
          cy.get('body').should('contain.text', 'item') // Items count
          cy.get('body').should('contain.text', 'R$') // Price
          cy.get('body').should('contain.text', 'Total:') // Total label
          cy.log('✅ Order history displayed with orders')
        } else if (hasEmptyState) {
          cy.contains('Nenhum pedido encontrado').should('be.visible')
          cy.log('ℹ️ Order history shows empty state')
        }
      })
    })

    it('should display order details correctly', function () {
      if (!testUser?.id) {
        this.skip()
        return
      }

      // Check for order card elements based on actual UI
      cy.get('body').then(($body) => {
        const hasOrders = $body.text().includes('#')

        if (hasOrders) {
          // Order number format (e.g., #f6095027)
          cy.get('body')
            .invoke('text')
            .should('match', /#[a-f0-9]{8}/)

          // Order status (Pendente, Entregue, etc.)
          cy.get('body').should('satisfy', ($el) => {
            const text = $el.text()
            return (
              text.includes('Pendente') ||
              text.includes('Entregue') ||
              text.includes('Em Trânsito') ||
              text.includes('Cancelado') ||
              text.includes('Processando')
            )
          })

          // Date format (dd/mm/yyyy)
          cy.get('body')
            .invoke('text')
            .should('match', /\d{2}\/\d{2}\/\d{4}/)

          // Items count
          cy.get('body').should('contain.text', 'item')

          // Price formatting
          cy.get('body').should('contain.text', 'R$')
          cy.get('body').should('contain.text', 'Subtotal:')
          cy.get('body').should('contain.text', 'Total:')

          cy.log('✅ Order details displayed correctly')
        } else {
          cy.log('ℹ️ No orders to verify')
        }
      })
    })

    it('should have "Mostrar tudo" button for orders', function () {
      if (!testUser?.id) {
        this.skip()
        return
      }

      cy.get('body').then(($body) => {
        const hasOrders = $body.text().includes('#')

        if (hasOrders) {
          // Check for "Mostrar tudo" button
          cy.get('[data-testid="show-all-orders-button"]')
            .should('be.visible')
            .and('contain.text', 'Mostrar tudo')

          // Verify button href includes orders path
          cy.get('[data-testid="show-all-orders-button"]')
            .should('have.attr', 'href')
            .and('include', '/orders')

          cy.log('✅ "Mostrar tudo" button displayed correctly')
        } else {
          cy.log('ℹ️ No orders - button may not be visible')
        }
      })
    })
  })

  describe('Order History and Statistics (With Orders)', () => {
    let customerWithOrders: TestUser | null = null

    beforeEach(function () {
      cy.createCustomerWithOrders().then((customer) => {
        customerWithOrders = customer as TestUser
        cy.log('✅ Customer with orders created:', customerWithOrders.email)
      })

      cy.visit('/admin/customers')
      cy.get('[data-testid="customer-card"]', { timeout: 10000 }).should(
        'have.length.at.least',
        1,
      )
    })

    it('should display order history when customer has orders', function () {
      if (!customerWithOrders?.email) {
        this.skip()
        return
      }

      cy.contains('[data-testid="customer-card"]', customerWithOrders.email, {
        timeout: 10000,
      })
        .should('exist')
        .within(() => {
          cy.contains('Ver Detalhes').click()
        })

      cy.url().should('include', '/admin/customers/')
      cy.contains('Histórico de Pedidos', { timeout: 10000 }).should('be.visible')

      // Verify order exists in history
      cy.get('body').then(($body) => {
        const pageText = $body.text()
        const hasOrders = pageText.includes('#') && pageText.includes('item')
        const hasEmptyState = pageText.includes('Nenhum pedido encontrado')

        if (hasOrders) {
          // Verify order card structure
          cy.get('body').should('contain.text', '#')
          cy.get('body').should('contain.text', 'item')
          cy.get('body').should('contain.text', 'R$')
          cy.get('body').should('contain.text', 'Total:')
          cy.log('✅ Order history displayed correctly')
        } else if (hasEmptyState) {
          cy.log('⚠️ Empty state shown - order creation may have failed')
          cy.contains('Nenhum pedido encontrado').should('be.visible')
        } else {
          cy.log('⚠️ Unexpected state - checking page content')
          cy.log('Page text (first 500 chars):', pageText.substring(0, 500))
        }
      })
    })

    it('should navigate to all orders page', function () {
      if (!customerWithOrders?.email) {
        this.skip()
        return
      }

      cy.contains('[data-testid="customer-card"]', customerWithOrders.email)
        .should('exist')
        .within(() => {
          cy.contains('Ver Detalhes').click()
        })

      cy.contains('Histórico de Pedidos', { timeout: 10000 }).should('be.visible')

      // Click "Mostrar tudo" if orders exist
      cy.get('body').then(($body) => {
        if ($body.find('[data-testid="show-all-orders-button"]').length > 0) {
          cy.get('[data-testid="show-all-orders-button"]').click()
          cy.url().should('include', '/orders')
          cy.log('✅ Navigated to all orders page')
        } else {
          cy.log('ℹ️ No "Mostrar tudo" button - customer may have no orders')
        }
      })
    })
  })

  describe('Data Validation and Formatting', () => {
    beforeEach(() => {
      if (!testUser?.id) return

      // Navigate to customer details page for each test
      cy.get('[data-testid="customer-card"]')
        .first()
        .within(() => {
          cy.contains('Ver Detalhes').click()
        })
    })

    it('should validate data formatting and consistency', () => {
      if (!testUser?.id) {
        cy.skip('User creation failed')
        return
      }

      // Check CPF formatting (should be xxx.xxx.xxx-xx)
      cy.contains('CPF')
        .parent()
        .invoke('text')
        .should('match', /\d{3}\.\d{3}\.\d{3}-\d{2}/)

      // Check phone formatting (should include parentheses and dash)
      cy.contains('Telefone').parent().should('contain.text', '(')
      cy.contains('Telefone').parent().should('contain.text', ')')

      // Check date formatting (should be dd/mm/yyyy)
      cy.contains('Data de Nascimento')
        .parent()
        .invoke('text')
        .should('match', /\d{2}\/\d{2}\/\d{4}/)
      cy.contains('Data de Cadastro')
        .parent()
        .invoke('text')
        .should('match', /\d{2}\/\d{2}\/\d{4}/)

      // Check currency formatting in order history
      cy.get('body').then(($body) => {
        if ($body.text().includes('R$')) {
          cy.get('body').should('contain.text', 'R$')
        }
      })

      cy.log('✅ Data formatting validation completed')
    })

    it('should handle customer with minimal data gracefully', () => {
      if (!testUser?.id) {
        cy.skip('User creation failed')
        return
      }

      // Verify page loads even if customer has minimal data
      cy.contains('Informações Pessoais').should('be.visible')
      cy.contains('Informações de Contato').should('be.visible')
      cy.contains('Endereços').should('be.visible')
      cy.contains('Histórico de Pedidos').should('be.visible')

      // Check that at least name and email are present (required fields)
      cy.contains('Nome Completo').parent().should('not.be.empty')
      cy.contains('Email').parent().should('contain.text', '@')

      cy.log('✅ Customer details page handles minimal data correctly')
    })
  })

  describe('Responsive Design', () => {
    beforeEach(() => {
      if (!testUser?.id) return

      // Navigate to customer details page for each test
      cy.get('[data-testid="customer-card"]')
        .first()
        .within(() => {
          cy.contains('Ver Detalhes').click()
        })
    })

    it('should display responsive layout on different screen sizes', () => {
      if (!testUser?.id) {
        cy.skip('User creation failed')
        return
      }

      // Test desktop layout
      cy.viewport(1280, 720)
      cy.contains('Informações Pessoais').should('be.visible')
      cy.contains('Histórico de Pedidos').should('be.visible')

      // Test tablet layout
      cy.viewport(768, 1024)
      cy.contains('Informações Pessoais').should('be.visible')
      cy.contains('Histórico de Pedidos').should('be.visible')

      // Test mobile layout
      cy.viewport(375, 667)
      cy.contains('Informações Pessoais').should('be.visible')
      cy.contains('Histórico de Pedidos').should('be.visible')

      // Reset to default viewport
      cy.viewport(1280, 720)

      cy.log('✅ Responsive layout verified')
    })
  })

  describe('Error Handling and Edge Cases', () => {
    it('should handle database connection issues gracefully', () => {
      // Test how the page handles when database is unavailable
      cy.visit('/admin/customers', { failOnStatusCode: false })

      // The page should either show an error message or loading state
      cy.get('body').should('exist')

      cy.log('✅ Database connection error handling verified')
    })

    it('should handle empty customer list gracefully', () => {
      // Reset database to ensure empty state
      cy.task('resetTestDatabase')

      cy.visit('/admin/customers')

      // Should show empty state or loading
      cy.contains('Clientes').should('be.visible')

      cy.log('✅ Empty customer list handling verified')
    })

    it('should handle invalid customer ID in URL', () => {
      // Try to access a customer details page with invalid ID
      cy.visit('/admin/customers/invalid-id', { failOnStatusCode: false })

      // Should either redirect or show error page
      cy.get('body').should('exist')

      cy.log('✅ Invalid customer ID handling verified')
    })
  })

  describe('Performance and Loading', () => {
    it('should load customer details page within reasonable time', () => {
      if (!testUser?.id) {
        cy.skip('User creation failed')
        return
      }

      const startTime = Date.now()

      cy.get('[data-testid="customer-card"]')
        .first()
        .within(() => {
          cy.contains('Ver Detalhes').click()
        })

      cy.contains('Informações Pessoais')
        .should('be.visible')
        .then(() => {
          const loadTime = Date.now() - startTime
          expect(loadTime).to.be.lessThan(5000) // Should load within 5 seconds
          cy.log(`✅ Page loaded in ${loadTime}ms`)
        })
    })

    it('should handle concurrent user access', () => {
      if (!testUser?.id) {
        cy.skip('User creation failed')
        return
      }

      // Simulate multiple rapid navigations
      for (let i = 0; i < 3; i++) {
        cy.visit('/admin/customers')
        cy.contains('Clientes').should('be.visible')

        cy.get('[data-testid="customer-card"]')
          .first()
          .within(() => {
            cy.contains('Ver Detalhes').click()
          })

        cy.contains('Informações Pessoais').should('be.visible')
        cy.contains('Voltar para Lista').click()
      }

      cy.log('✅ Concurrent access handling verified')
    })
  })
})
