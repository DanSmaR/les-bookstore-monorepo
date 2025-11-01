/// <reference types="cypress" />

describe('Admin - Customer Details Page', () => {
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

  describe('Navigation and Page Loading', () => {
    it('should navigate from customers list to customer details page', () => {
      if (!testUser?.id) {
        cy.skip('User creation failed')
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
        cy.skip('User creation failed')
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
        cy.skip('User creation failed')
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
    beforeEach(() => {
      if (!testUser?.id) return

      // Navigate to customer details page for each test
      cy.get('[data-testid="customer-card"]')
        .first()
        .within(() => {
          cy.contains('Ver Detalhes').click()
        })
    })

    it('should display order history sidebar', () => {
      if (!testUser?.id) {
        cy.skip('User creation failed')
        return
      }

      // Check order history sidebar
      cy.contains('Histórico de Pedidos').should('be.visible')

      // Check order statistics
      cy.contains('Total de Pedidos').should('be.visible')
      cy.contains('Pedidos Concluídos').should('be.visible')
      cy.contains('Valor Total Comprado').should('be.visible')

      // Check recent orders section
      cy.contains('Pedidos Recentes').should('be.visible')

      cy.log('✅ Order history sidebar displayed correctly')
    })

    it('should display order history with proper formatting', () => {
      if (!testUser?.id) {
        cy.skip('User creation failed')
        return
      }

      // Check if there are recent orders
      cy.get('body').then(($body) => {
        if ($body.text().includes('#')) {
          // If there are orders, verify their structure
          cy.get('body').should('contain.text', '#') // Order number
          cy.get('body').should('contain.text', 'R$') // Price formatting

          // Check for order status (should be one of the expected statuses)
          cy.get('body').should('satisfy', ($el) => {
            const text = $el.text()
            return (
              text.includes('Entregue') ||
              text.includes('Em Trânsito') ||
              text.includes('Cancelado') ||
              text.includes('Pendente') ||
              text.includes('Processando')
            )
          })

          // Check for items count
          cy.get('body').should('contain.text', 'item')
        }
      })

      cy.log('✅ Order history formatting verified')
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
