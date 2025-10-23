/// <reference types="cypress" />

describe('Book Purchase Flow', () => {
  let testUser: any
  let book1: any
  let book2: any

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

    // Visit home page first
    cy.visit('/')

    // Create and authenticate a test user
    cy.setupAuthenticatedUser().then((user) => {
      testUser = user
      cy.log('✅ Test user created and authenticated:', testUser.email)

      // Create test books via API
      cy.request({
        method: 'POST',
        url: `${Cypress.env('API_URL') || 'http://localhost:3000'}/api/test/create-book`,
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
          cy.log('✅ Book 1 created:', book1.title)
        }
      })

      cy.request({
        method: 'POST',
        url: `${Cypress.env('API_URL') || 'http://localhost:3000'}/api/test/create-book`,
        headers: {
          Authorization: `Bearer ${testUser.token.accessToken}`,
        },
        body: {
          title:
            'Design Patterns: Elements of Reusable Object-Oriented Software',
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
          cy.log('✅ Book 2 created:', book2.title)
        }
      })

      // Ensure user has a payment card
      cy.request({
        method: 'POST',
        url: `${Cypress.env('API_URL') || 'http://localhost:3000'}/api/me/cards`,
        headers: {
          Authorization: `Bearer ${testUser.token.accessToken}`,
        },
        body: {
          number: '4111111111111111',
          holderName: testUser.name,
          expirationDate: new Date('2030-12-01').toISOString(),
          cvv: '123',
          type: 'credit',
        },
        failOnStatusCode: false,
      }).then((response) => {
        if (response.status === 201 || response.status === 200) {
          cy.log('✅ Payment card created')
        }
      })
    })
  })

  beforeEach(() => {
    // Ensure authenticated before each test
    if (testUser?.token?.accessToken) {
      cy.window().then((window) => {
        window.localStorage.setItem(
          'auth-token',
          JSON.stringify(testUser.token),
        )
      })
    }
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

  describe('Cart Navigation and Authentication', () => {
    it('should redirect to sign-in when accessing cart without authentication', () => {
      // Clear authentication
      cy.clearAuth()

      // Visit home page
      cy.visit('/')

      // Click on cart icon
      cy.get('[data-testid="cart-icon"]').click()

      // Should redirect to sign-in page
      cy.url().should('include', '/sign-in')
      cy.contains('Entrar').should('be.visible')

      cy.log('✅ Redirected to sign-in page when not authenticated')
    })

    it('should access cart when authenticated with empty cart message', () => {
      cy.visit('/')

      // Click on cart icon
      cy.get('[data-testid="cart-icon"]').click()

      // Should show empty cart message
      cy.url().should('include', '/cart')
      cy.contains('Seu carrinho está vazio').should('be.visible')
      cy.contains(
        'Parece que você ainda não adicionou nenhum livro ao seu carrinho',
      ).should('be.visible')

      cy.log('✅ Empty cart message displayed correctly')
    })
  })

  describe('Cart Management', () => {
    beforeEach(() => {
      // Clear cart before each test
      cy.window().then((window) => {
        window.localStorage.removeItem('cart-storage')
      })
    })

    it('should navigate to catalog from empty cart', () => {
      cy.visit('/cart')

      // Click "Explorar Catálogo" button
      cy.contains('Explorar Catálogo').click()

      // Should navigate to catalog page
      cy.url().should('include', '/catalog')
      cy.contains('Catálogo de Livros').should('be.visible')

      cy.log('✅ Navigated to catalog from empty cart')
    })

    it('should add book to cart from catalog', () => {
      cy.visit('/catalog')

      // Wait for books to load
      cy.get('[data-testid="book-card"]', { timeout: 10000 }).should('exist')

      // Add first book to cart
      cy.get('[data-testid="book-card"]')
        .first()
        .within(() => {
          cy.get('[data-testid="book-add-to-cart-button"]').click()
        })

      // Cart badge should show 1 item
      cy.get('[data-testid="cart-badge"]', { timeout: 5000 }).should(
        'contain',
        '1',
      )

      cy.log('✅ Book added to cart and badge updated')
    })

    it('should add multiple books and update cart badge', () => {
      cy.visit('/catalog')

      // Wait for books to load
      cy.get('[data-testid="book-card"]', { timeout: 10000 }).should('exist')

      // Add first book twice
      cy.get('[data-testid="book-card"]')
        .first()
        .within(() => {
          cy.get('[data-testid="book-add-to-cart-button"]').click()
        })

      cy.wait(500)

      cy.get('[data-testid="book-card"]')
        .first()
        .within(() => {
          cy.get('[data-testid="book-add-to-cart-button"]').click()
        })

      // Cart badge should show 2 items
      cy.get('[data-testid="cart-badge"]', { timeout: 5000 }).should(
        'contain',
        '2',
      )

      cy.log('✅ Multiple items added to cart')
    })

    it('should display cart items with correct information', () => {
      cy.visit('/catalog')

      // Wait for books to load
      cy.get('[data-testid="book-card"]', { timeout: 10000 }).should('exist')

      // Find and click on Clean Code book specifically
      cy.contains('[data-testid="book-card"]', 'Clean Code').within(() => {
        cy.get('[data-testid="book-add-to-cart-button"]').click()
      })

      // Wait for cart badge to appear (confirms item was added)
      cy.get('[data-testid="cart-badge"]', { timeout: 10000 }).should(
        'be.visible',
      )

      // Navigate to cart (force click to bypass toast coverage)
      cy.get('[data-testid="cart-icon"]').click({ force: true })

      // Verify cart item is displayed
      cy.get('[data-testid="cart-item"]').should('exist')
      cy.contains('Clean Code').should('be.visible')
      cy.contains('Robert C. Martin').should('be.visible')

      cy.log('✅ Cart items displayed correctly')
    })

    it('should increase and decrease quantity with buttons', () => {
      cy.visit('/catalog')

      // Wait for books to load and add first available book to cart
      cy.get('[data-testid="book-card"]', { timeout: 10000 })
        .first()
        .within(() => {
          cy.get('[data-testid="book-add-to-cart-button"]').click()
        })

      // Wait for cart badge to appear (confirms item was added)
      cy.get('[data-testid="cart-badge"]', { timeout: 10000 }).should(
        'be.visible',
      )

      // Navigate to cart (force click to bypass toast coverage)
      cy.get('[data-testid="cart-icon"]').click({ force: true })

      // Get quantity input
      cy.get('[data-testid="cart-item-quantity-input"]').should(
        'have.value',
        '1',
      )

      // Increase quantity
      cy.get('[aria-label="Aumentar quantidade"]').click()
      cy.get('[data-testid="cart-item-quantity-input"]').should(
        'have.value',
        '2',
      )

      // Decrease quantity
      cy.get('[aria-label="Diminuir quantidade"]').click()
      cy.get('[data-testid="cart-item-quantity-input"]').should(
        'have.value',
        '1',
      )

      cy.log('✅ Quantity increased and decreased correctly')
    })

    it('should validate minimum quantity constraint', () => {
      cy.visit('/catalog')

      // Add book to cart
      cy.get('[data-testid="book-card"]', { timeout: 10000 })
        .first()
        .within(() => {
          cy.get('[data-testid="book-add-to-cart-button"]').click()
        })

      // Wait for cart badge to appear (confirms item was added)
      cy.get('[data-testid="cart-badge"]', { timeout: 10000 }).should(
        'be.visible',
      )

      // Navigate to cart (force click to bypass toast coverage)
      cy.get('[data-testid="cart-icon"]').click({ force: true })

      // Verify quantity starts at 1
      cy.get('[data-testid="cart-item-quantity-input"]').should(
        'have.value',
        '1',
      )

      // Verify decrease button is disabled at minimum (1)
      cy.get('[aria-label="Diminuir quantidade"]').should('be.disabled')

      // Verify input has min attribute set to 1
      cy.get('[data-testid="cart-item-quantity-input"]').should(
        'have.attr',
        'min',
        '1',
      )

      cy.log('✅ Minimum quantity constraint validated')
    })

    it('should validate maximum quantity constraint based on stock', () => {
      cy.visit('/catalog')

      // Add book to cart
      cy.get('[data-testid="book-card"]', { timeout: 10000 })
        .first()
        .within(() => {
          cy.get('[data-testid="book-add-to-cart-button"]').click()
        })

      // Wait for cart badge to appear (confirms item was added)
      cy.get('[data-testid="cart-badge"]', { timeout: 10000 }).should(
        'be.visible',
      )

      // Navigate to cart (force click to bypass toast coverage)
      cy.get('[data-testid="cart-icon"]').click({ force: true })

      // Get the max stock value from the input attribute
      cy.get('[data-testid="cart-item-quantity-input"]')
        .invoke('attr', 'max')
        .then((maxStock) => {
          const maxValue = parseInt(maxStock as string, 10)

          // Verify max attribute is set correctly (should be 30 for Design Patterns book)
          cy.get('[data-testid="cart-item-quantity-input"]').should(
            'have.attr',
            'max',
            maxValue.toString(),
          )

          // Click increase button multiple times to approach max
          // Click 5 times to get to quantity 6
          for (let i = 0; i < 5; i++) {
            cy.get('[aria-label="Aumentar quantidade"]').click()
            cy.wait(100) // Small wait between clicks
          }

          // Verify quantity increased
          cy.get('[data-testid="cart-item-quantity-input"]').should(
            'have.value',
            '6',
          )

          // Now increase to the maximum (maxValue)
          cy.get('[data-testid="cart-item-quantity-input"]')
            .invoke('attr', 'max')
            .then((max) => {
              const maxVal = parseInt(max as string, 10)

              // Click increase button until we reach max
              for (let i = 6; i < maxVal; i++) {
                cy.get('[aria-label="Aumentar quantidade"]').click()
                cy.wait(50)
              }

              // Verify we're at max
              cy.get('[data-testid="cart-item-quantity-input"]').should(
                'have.value',
                maxVal.toString(),
              )

              // Verify increase button is now disabled
              cy.get('[aria-label="Aumentar quantidade"]').should('be.disabled')
            })
        })

      cy.log('✅ Maximum quantity constraint validated')
    })

    it('should remove item from cart', () => {
      cy.visit('/catalog')

      // Add book to cart
      cy.get('[data-testid="book-card"]', { timeout: 10000 })
        .first()
        .within(() => {
          cy.get('[data-testid="book-add-to-cart-button"]').click()
        })

      // Wait for cart badge to appear (confirms item was added)
      cy.get('[data-testid="cart-badge"]', { timeout: 10000 }).should(
        'be.visible',
      )

      // Navigate to cart (force click to bypass toast coverage)
      cy.get('[data-testid="cart-icon"]').click({ force: true })

      // Remove item
      cy.get('[data-testid="cart-item-remove-button"]').click()

      // Should show empty cart
      cy.contains('Seu carrinho está vazio').should('be.visible')

      // Cart badge should not be visible
      cy.get('[data-testid="cart-badge"]').should('not.exist')

      cy.log('✅ Item removed from cart')
    })

    it('should update cart summary calculations correctly', () => {
      cy.visit('/catalog')

      // Add book to cart
      cy.get('[data-testid="book-card"]', { timeout: 10000 })
        .first()
        .within(() => {
          cy.get('[data-testid="book-add-to-cart-button"]').click()
        })

      // Wait for cart badge to appear (confirms item was added)
      cy.get('[data-testid="cart-badge"]', { timeout: 10000 }).should(
        'be.visible',
      )

      // Navigate to cart (force click to bypass toast coverage)
      cy.get('[data-testid="cart-icon"]').click({ force: true })

      // Wait for cart page to load and toast to disappear
      cy.wait(2000)

      // Scroll cart summary into view to avoid header coverage
      cy.get('[data-testid="cart-total-price"]').scrollIntoView()

      // Verify initial summary
      cy.contains('1 produto').should('exist')
      cy.contains('1 item').should('exist')
      cy.get('[data-testid="cart-total-price"]').should('contain', 'R$')

      // Increase quantity
      cy.get('[aria-label="Aumentar quantidade"]').click()

      // Verify updated summary
      cy.contains('2 items').should('be.visible')
      cy.contains('2 unidades').should('be.visible')

      cy.log('✅ Cart summary calculations updated correctly')
    })

    it('should continue shopping from cart', () => {
      cy.visit('/catalog')

      // Add book to cart
      cy.get('[data-testid="book-card"]', { timeout: 10000 })
        .first()
        .within(() => {
          cy.get('[data-testid="book-add-to-cart-button"]').click()
        })

      // Wait for cart badge to appear (confirms item was added)
      cy.get('[data-testid="cart-badge"]', { timeout: 10000 }).should(
        'be.visible',
      )

      // Navigate to cart (force click to bypass toast coverage)
      cy.get('[data-testid="cart-icon"]').click({ force: true })

      // Click continue shopping
      cy.get('[data-testid="cart-continue-shopping-button"]').click()

      // Should navigate to catalog
      cy.url().should('include', '/catalog')
      cy.contains('Catálogo de Livros').should('be.visible')

      cy.log('✅ Continued shopping from cart')
    })
  })

  describe('Checkout Process', () => {
    beforeEach(() => {
      // Clear cart before each test
      cy.window().then((window) => {
        window.localStorage.removeItem('cart-storage')
      })

      // Add a book to cart for checkout tests
      cy.visit('/catalog')
      cy.get('[data-testid="book-card"]', { timeout: 10000 })
        .first()
        .within(() => {
          cy.get('[data-testid="book-add-to-cart-button"]').click()
        })

      // Wait for cart badge to appear (confirms item was added)
      cy.get('[data-testid="cart-badge"]', { timeout: 10000 }).should(
        'be.visible',
      )

      cy.get('[data-testid="cart-icon"]').click({ force: true })
    })

    it('should open address selection modal on checkout', () => {
      // Click checkout button
      cy.get('[data-testid="cart-checkout-button"]').click()

      // Address selection modal should appear
      cy.contains('Selecionar Endereço de Entrega').should('be.visible')
      cy.contains('Escolha o endereço onde deseja receber seus livros').should(
        'be.visible',
      )

      cy.log('✅ Address selection modal opened')
    })

    it('should cancel address selection and keep cart intact', () => {
      // Click checkout button
      cy.get('[data-testid="cart-checkout-button"]').click()

      cy.contains('Selecionar Endereço de Entrega').should('be.visible')

      // Click cancel button
      cy.get('[data-testid="address-cancel-button"]').click()

      // Modal should close
      cy.contains('Selecionar Endereço de Entrega').should('not.exist')

      // Cart should still have items
      cy.get('[data-testid="cart-item"]').should('exist')

      cy.log('✅ Address selection canceled and cart intact')
    })

    it('should disable confirm button until address is selected', () => {
      // Click checkout button
      cy.get('[data-testid="cart-checkout-button"]').click()

      // Confirm button should be disabled
      cy.get('[data-testid="address-confirm-button"]').should('be.disabled')

      cy.log('✅ Confirm button disabled until address selected')
    })

    it('should complete checkout with address selection', () => {
      // Click checkout button
      cy.get('[data-testid="cart-checkout-button"]').click()

      // Select an address
      cy.get('[data-testid="address-card"]').first().click()

      // Confirm button should be enabled
      cy.get('[data-testid="address-confirm-button"]').should('not.be.disabled')

      // Confirm address
      cy.get('[data-testid="address-confirm-button"]').click()

      // Should redirect to empty cart (order created)
      cy.contains('Seu carrinho está vazio', { timeout: 10000 }).should(
        'be.visible',
      )

      cy.log('✅ Checkout completed successfully')
    })
  })

  describe('Order Management', () => {
    beforeEach(() => {
      // Clear cart
      cy.window().then((window) => {
        window.localStorage.removeItem('cart-storage')
      })
      
      // Create an order by adding book and checking out
      cy.visit('/catalog')
      cy.get('[data-testid="book-card"]', { timeout: 10000 })
        .first()
        .within(() => {
          cy.get('[data-testid="book-add-to-cart-button"]').click()
        })

      // Wait for cart badge to appear (confirms item was added)
      cy.get('[data-testid="cart-badge"]', { timeout: 10000 }).should(
        'be.visible',
      )

      cy.get('[data-testid="cart-icon"]').click({ force: true })

      // Wait for cart page to load
      cy.wait(1000)

      // Scroll checkout button into view and click
      cy.get('[data-testid="cart-checkout-button"]')
        .scrollIntoView()
        .should('be.visible')
        .click()

      // Wait for address selection modal to appear and become interactive
      cy.wait(1000)
      cy.get('[data-testid="address-card"]', { timeout: 10000 })
        .should('be.visible')
        .first()
        .click()

      cy.get('[data-testid="address-confirm-button"]')
        .should('be.visible')
        .click()

      // Wait for order to be created and navigation to complete
      cy.wait(2000)
    })

    it('should navigate to orders page via account menu', () => {
      cy.visit('/')

      // Click account dropdown
      cy.get('[data-testid="account-dropdown-button"]').click()

      // Click orders menu link
      cy.get('[data-testid="orders-menu-link"]').click()

      // Should navigate to orders page
      cy.url().should('include', '/orders')
      cy.contains('Meus Pedidos').should('be.visible')

      cy.log('✅ Navigated to orders page via account menu')
    })

    it('should display order with Pendente status', () => {
      cy.visit('/orders')

      // Order should be displayed
      cy.get('[data-testid="order-card"]', { timeout: 10000 }).should('exist')

      // Order should have Pendente status
      cy.get('[data-testid="order-status-badge"]')
        .first()
        .should('contain', 'Pendente')

      cy.log('✅ Order displayed with Pendente status')
    })

    it('should open cancel confirmation modal', () => {
      cy.visit('/orders')

      // Click cancel order button
      cy.get('[data-testid="order-cancel-button"]', { timeout: 10000 })
        .first()
        .click()

      // Confirmation modal should appear
      cy.contains('Cancelar Pedido').should('be.visible')
      cy.contains('Tem certeza de que deseja cancelar este pedido?').should(
        'be.visible',
      )

      cy.log('✅ Cancel confirmation modal opened')
    })

    it('should keep order when cancellation is declined', () => {
      cy.visit('/orders')

      // Click cancel order button
      cy.get('[data-testid="order-cancel-button"]', { timeout: 10000 })
        .first()
        .click()

      // Click no, keep order
      cy.contains('Não, manter pedido').click()

      // Modal should close
      cy.contains('Sim, cancelar pedido').should('not.exist')

      // Order should still be there with Pendente status
      cy.get('[data-testid="order-status-badge"]')
        .first()
        .should('contain', 'Pendente')

      cy.log('✅ Order kept when cancellation declined')
    })

    it('should cancel order and update status to Cancelado', () => {
      cy.visit('/orders')

      // Click cancel order button on first order
      cy.get('[data-testid="order-cancel-button"]', { timeout: 10000 })
        .first()
        .click()

      // Confirm cancellation
      cy.contains('Sim, cancelar pedido').click()

      // Wait for cancellation to process
      cy.wait(2000)

      // Verify the first order card has Cancelado status and no action buttons
      cy.get('[data-testid="order-card"]')
        .first()
        .within(() => {
          // Order status should be Cancelado
          cy.get('[data-testid="order-status-badge"]').should(
            'contain',
            'Cancelado',
          )

          // Action buttons should be removed from this order
          cy.get('[data-testid="order-pay-button"]').should('not.exist')
          cy.get('[data-testid="order-cancel-button"]').should('not.exist')
        })

      cy.log('✅ Order canceled and status updated to Cancelado')
    })
  })

  describe('Payment Process', () => {
    beforeEach(() => {
      // Clear cart
      cy.window().then((window) => {
        window.localStorage.removeItem('cart-storage')
      })

      // Create a new order
      cy.visit('/catalog')
      cy.get('[data-testid="book-card"]', { timeout: 10000 })
        .first()
        .within(() => {
          cy.get('[data-testid="book-add-to-cart-button"]').click()
        })

      // Wait for cart badge to appear (confirms item was added)
      cy.get('[data-testid="cart-badge"]', { timeout: 10000 }).should(
        'be.visible',
      )

      cy.get('[data-testid="cart-icon"]').click({ force: true })

      // Wait for cart page to load
      cy.wait(1000)

      // Scroll checkout button into view and click
      cy.get('[data-testid="cart-checkout-button"]')
        .scrollIntoView()
        .should('be.visible')
        .click()

      // Wait for address selection modal to appear and become interactive
      cy.wait(1000)
      cy.get('[data-testid="address-card"]', { timeout: 10000 })
        .should('be.visible')
        .first()
        .click()

      cy.get('[data-testid="address-confirm-button"]')
        .should('be.visible')
        .click()

      // Navigate to orders page and wait for order to be created
      cy.visit('/orders')
      cy.wait(2000)
    })

    it('should open payment modal when clicking pay button', () => {
      // Click pay button
      cy.get('[data-testid="order-pay-button"]', { timeout: 10000 })
        .first()
        .click()

      // Payment modal should appear
      cy.contains('Pagamento do Pedido').should('be.visible')
      cy.contains('Selecione o(s) cartão(ões) de pagamento').should(
        'be.visible',
      )

      cy.log('✅ Payment modal opened')
    })

    it('should cancel payment and close modal', () => {
      // Click pay button
      cy.get('[data-testid="order-pay-button"]', { timeout: 10000 })
        .first()
        .click()

      // Click cancel button
      cy.get('[data-testid="payment-cancel-button"]').click()

      // Modal should close
      cy.contains('Pagamento do Pedido').should('not.exist')

      // Order should still have Pendente status
      cy.get('[data-testid="order-status-badge"]')
        .first()
        .should('contain', 'Pendente')

      cy.log('✅ Payment canceled and modal closed')
    })

    it('should disable confirm button until card is selected', () => {
      // Click pay button
      cy.get('[data-testid="order-pay-button"]', { timeout: 10000 })
        .first()
        .click()

      // Confirm button should be disabled
      cy.get('[data-testid="payment-confirm-button"]').should('be.disabled')

      cy.log('✅ Confirm button disabled until card selected')
    })

    it('should select payment card and enable confirm button', () => {
      // Click pay button
      cy.get('[data-testid="order-pay-button"]', { timeout: 10000 })
        .first()
        .click()

      // Select a card
      cy.get('[data-testid="payment-card-option"]', { timeout: 5000 })
        .first()
        .click()

      // Wait for payment amount to be set
      cy.wait(1000)

      // Confirm button should be enabled
      cy.get('[data-testid="payment-confirm-button"]').should('not.be.disabled')

      cy.log('✅ Card selected and confirm button enabled')
    })

    it('should complete payment and update order status to Confirmado', () => {
      // Click pay button on first order
      cy.get('[data-testid="order-pay-button"]', { timeout: 10000 })
        .first()
        .click()

      // Select a card
      cy.get('[data-testid="payment-card-option"]', { timeout: 5000 })
        .first()
        .click()

      // Wait for payment amount to be automatically set
      cy.wait(1000)

      // Confirm payment
      cy.get('[data-testid="payment-confirm-button"]').click()

      // Wait for payment to process
      cy.wait(3000)

      // Reload to see updated status
      cy.reload()

      // Verify the first order card has Confirmado status and no action buttons
      cy.get('[data-testid="order-card"]')
        .first()
        .within(() => {
          // Order status should be Confirmado
          cy.get('[data-testid="order-status-badge"]').should(
            'contain',
            'Confirmado',
          )

          // Action buttons should be removed from this order
          cy.get('[data-testid="order-pay-button"]').should('not.exist')
          cy.get('[data-testid="order-cancel-button"]').should('not.exist')
        })

      cy.log('✅ Payment completed and order status updated to Confirmado')
    })
  })
})
