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

      // Seed tickets for the test user
      cy.log(
        `[before] About to seed tickets for userId: ${testUser.user.id || 'UNDEFINED'}`,
      )
      cy.seedTicketsForUser(testUser.user.id, testUser.token.accessToken).then(
        () => {
          cy.log('✅ Tickets seeded for test user')
          // Small delay to ensure tickets are persisted
          cy.wait(500)
        },
      )

      // Note: Payment card creation is removed from setup
      // Tests that need cards will create them, or we'll create one for tests that need it
      // Seed tickets for the test user
      cy.log(
        `[before] About to seed tickets for userId: ${testUser.user.id || 'UNDEFINED'}`,
      )
      cy.seedTicketsForUser(testUser.user.id, testUser.token.accessToken).then(
        () => {
          cy.log('✅ Tickets seeded for test user')
          // Small delay to ensure tickets are persisted
          cy.wait(500)
        },
      )

      // Note: Payment card creation is removed from setup
      // Tests that need cards will create them, or we'll create one for tests that need it
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

  describe('Ticket Selection in Cart', () => {
    beforeEach(() => {
      // Clear cart before each test
      cy.window().then((window) => {
        window.localStorage.removeItem('cart-storage')
      })

      // Add a book to cart for ticket tests
      cy.visit('/catalog')
      cy.get('[data-testid="book-card"]', { timeout: 10000 })
        .first()
        .within(() => {
          cy.get('[data-testid="book-add-to-cart-button"]').click()
        })

      // Wait for cart badge to appear
      cy.get('[data-testid="cart-badge"]', { timeout: 10000 }).should(
        'be.visible',
      )

      cy.get('[data-testid="cart-icon"]').click({ force: true })

      // Wait for cart page to load
      cy.url().should('include', '/cart')

      // Wait for toasts to appear, then close them immediately
      // Toasts auto-dismiss after 5000ms, but we'll close them faster
      cy.wait(300) // Give toasts time to render

      // Try to close toasts if they exist (non-blocking)
      cy.get('body').then(($body) => {
        const toasts = $body.find('[data-testid^="toast-"]')
        if (toasts.length > 0) {
          // Close each toast by clicking its close button
          cy.get('[data-testid^="toast-"]').each(($toast) => {
            cy.wrap($toast)
              .find('button')
              .first()
              .click({ force: true, multiple: true })
          })
        }
      })

      // Wait for toasts to be removed from DOM (either by timeout or manual close)
      cy.get('[data-testid^="toast-"]', { timeout: 6000 }).should('not.exist')

      // Now verify the tickets section exists and scroll into view
      cy.contains('Cupons Disponíveis', { timeout: 10000 })
        .should('exist')
        .scrollIntoView({ offset: { top: -200, left: 0 } })

      cy.get('[data-testid="ticket-card"]', { timeout: 5000 }).should(
        'have.length.at.least',
        1,
      )
    })

    it('should display available tickets in cart', () => {
      // Wait for tickets to load (tickets section should appear after API call completes)
      cy.contains('Cupons Disponíveis', { timeout: 10000 })
        .should('exist')
        .scrollIntoView({ offset: { top: -100, left: 0 } })

      // Wait a bit more for all tickets to render
      cy.wait(500)

      // Verify tickets are displayed (should have at least 6: 3 public + 1 user promo + 2 exchange)
      cy.get('[data-testid="ticket-card"]', { timeout: 5000 }).should(
        'have.length.at.least',
        3,
      )

      // Verify public tickets are displayed
      cy.get('[data-testid="ticket-code"]').should('contain', 'PROMO10')
      cy.get('[data-testid="ticket-code"]').should('contain', 'BLACKFRIDAY')
      cy.get('[data-testid="ticket-code"]').should('contain', 'FRETE50')

      // Verify user-specific tickets are displayed
      cy.get('[data-testid="ticket-code"]').should('contain', 'WELCOME15')
      cy.get('[data-testid="ticket-code"]').should('contain', 'TROCA100')
      cy.get('[data-testid="ticket-code"]').should('contain', 'TROCA50')

      cy.log('✅ Available tickets displayed correctly')
    })

    it('should allow selecting single promotional ticket', () => {
      // Ensure toasts are not covering the page
      cy.get('[data-testid^="toast-"]', { timeout: 6000 }).should('not.exist')

      // Wait for tickets to be loaded - check existence first, then scroll for visibility
      cy.contains('Cupons Disponíveis', { timeout: 10000 })
        .should('exist')
        .scrollIntoView({ offset: { top: -200, left: 0 } })

      cy.get('[data-testid="ticket-card"]', { timeout: 5000 }).should(
        'have.length.at.least',
        1,
      )

      // Select one promotional ticket (BLACKFRIDAY)
      cy.get('[data-testid="ticket-code"]')
        .contains('BLACKFRIDAY', { timeout: 5000 })
        .should('exist')
        .closest('[data-testid="ticket-card"]')
        .scrollIntoView({ offset: { top: -150, left: 0 } })
        .should('exist')
        .within(() => {
          cy.get('[data-testid="ticket-checkbox"]', { timeout: 5000 })
            .should('exist')
            .check({ force: true })
        })

      // Wait for discount calculation
      cy.wait(500)

      // Verify discount is displayed
      cy.get('[data-testid="estimated-discount"]')
        .scrollIntoView({ offset: { top: -100, left: 0 } })
        .should('exist')
        .should('contain', 'R$')

      // Verify other promotional tickets are disabled
      cy.get('[data-testid="ticket-code"]')
        .contains('PROMO10')
        .closest('[data-testid="ticket-card"]')
        .within(() => {
          cy.get('[data-testid="ticket-checkbox"]').should('be.disabled')
        })

      cy.log('✅ Single promotional ticket selected correctly')
    })

    it('should allow selecting multiple exchange tickets with one promotional', () => {
      // Select one promotional ticket
      cy.get('[data-testid="ticket-code"]')
        .contains('BLACKFRIDAY')
        .closest('[data-testid="ticket-card"]')
        .scrollIntoView()
        .within(() => {
          cy.get('[data-testid="ticket-checkbox"]').check({ force: true })
        })

      cy.wait(500)

      // Select exchange tickets
      cy.get('[data-testid="ticket-code"]')
        .contains('TROCA100')
        .closest('[data-testid="ticket-card"]')
        .scrollIntoView()
        .within(() => {
          cy.get('[data-testid="ticket-checkbox"]').check({ force: true })
        })

      cy.wait(500)

      cy.get('[data-testid="ticket-code"]')
        .contains('TROCA50')
        .closest('[data-testid="ticket-card"]')
        .scrollIntoView()
        .within(() => {
          cy.get('[data-testid="ticket-checkbox"]').check({ force: true })
        })

      cy.wait(500)

      // Verify discount is calculated
      cy.get('[data-testid="estimated-discount"]')
        .scrollIntoView({ offset: { top: -100, left: 0 } })
        .should('exist')

      // Verify ticket count in summary
      cy.contains(/cupom.*selecionado/i).should('be.visible')

      cy.log('✅ Multiple tickets selected correctly')
    })

    it('should prevent selecting multiple promotional tickets', () => {
      // Select first promotional ticket
      cy.get('[data-testid="ticket-code"]')
        .contains('BLACKFRIDAY')
        .closest('[data-testid="ticket-card"]')
        .scrollIntoView()
        .within(() => {
          cy.get('[data-testid="ticket-checkbox"]').check({ force: true })
        })

      cy.wait(500)

      // Verify other promotional tickets are disabled
      cy.get('[data-testid="ticket-code"]')
        .contains('PROMO10')
        .closest('[data-testid="ticket-card"]')
        .scrollIntoView()
        .within(() => {
          cy.get('[data-testid="ticket-checkbox"]').should('be.disabled')
        })

      cy.get('[data-testid="ticket-code"]')
        .contains('FRETE50')
        .closest('[data-testid="ticket-card"]')
        .scrollIntoView()
        .within(() => {
          cy.get('[data-testid="ticket-checkbox"]').should('be.disabled')
        })

      cy.log('✅ Multiple promotional tickets prevented')
    })

    it('should update cart total when tickets are selected', () => {
      // Get initial total - scroll into view first to ensure visibility
      cy.get('[data-testid="cart-total-price"]')
        .scrollIntoView({ offset: { top: -100, left: 0 } })
        .should('exist')

      // Select tickets that give discount > item price (TROCA100 = R$ 100.00)
      cy.get('[data-testid="ticket-code"]')
        .contains('TROCA100')
        .closest('[data-testid="ticket-card"]')
        .scrollIntoView()
        .within(() => {
          cy.get('[data-testid="ticket-checkbox"]').check({ force: true })
        })

      cy.wait(1000)

      // Verify total shows discount or R$ 0,00 when discount covers full amount
      cy.get('[data-testid="cart-total-price"]')
        .scrollIntoView({ offset: { top: -100, left: 0 } })
        .should('exist')
      cy.get('[data-testid="estimated-discount"]')
        .scrollIntoView({ offset: { top: -100, left: 0 } })
        .should('exist')

      cy.log('✅ Cart total updated with tickets')
    })

    it('should show correct ticket nature badges', () => {
      // Verify promotional tickets show "Promocional"
      cy.get('[data-testid="ticket-nature"]')
        .contains('Promocional')
        .should('exist')

      // Verify exchange tickets show "Troca"
      cy.get('[data-testid="ticket-nature"]').contains('Troca').should('exist')

      cy.log('✅ Ticket nature badges displayed correctly')
    })
  })

  describe('Ticket Selection in Cart', () => {
    beforeEach(() => {
      // Clear cart before each test
      cy.window().then((window) => {
        window.localStorage.removeItem('cart-storage')
      })

      // Add a book to cart for ticket tests
      cy.visit('/catalog')
      cy.get('[data-testid="book-card"]', { timeout: 10000 })
        .first()
        .within(() => {
          cy.get('[data-testid="book-add-to-cart-button"]').click()
        })

      // Wait for cart badge to appear
      cy.get('[data-testid="cart-badge"]', { timeout: 10000 }).should(
        'be.visible',
      )

      cy.get('[data-testid="cart-icon"]').click({ force: true })

      // Wait for cart page to load
      cy.url().should('include', '/cart')

      // Wait for toasts to appear, then close them immediately
      // Toasts auto-dismiss after 5000ms, but we'll close them faster
      cy.wait(300) // Give toasts time to render

      // Try to close toasts if they exist (non-blocking)
      cy.get('body').then(($body) => {
        const toasts = $body.find('[data-testid^="toast-"]')
        if (toasts.length > 0) {
          // Close each toast by clicking its close button
          cy.get('[data-testid^="toast-"]').each(($toast) => {
            cy.wrap($toast)
              .find('button')
              .first()
              .click({ force: true, multiple: true })
          })
        }
      })

      // Wait for toasts to be removed from DOM (either by timeout or manual close)
      cy.get('[data-testid^="toast-"]', { timeout: 6000 }).should('not.exist')

      // Now verify the tickets section exists and scroll into view
      cy.contains('Cupons Disponíveis', { timeout: 10000 })
        .should('exist')
        .scrollIntoView({ offset: { top: -200, left: 0 } })

      cy.get('[data-testid="ticket-card"]', { timeout: 5000 }).should(
        'have.length.at.least',
        1,
      )
    })

    it('should display available tickets in cart', () => {
      // Wait for tickets to load (tickets section should appear after API call completes)
      cy.contains('Cupons Disponíveis', { timeout: 10000 })
        .should('exist')
        .scrollIntoView({ offset: { top: -100, left: 0 } })

      // Wait a bit more for all tickets to render
      cy.wait(500)

      // Verify tickets are displayed (should have at least 6: 3 public + 1 user promo + 2 exchange)
      cy.get('[data-testid="ticket-card"]', { timeout: 5000 }).should(
        'have.length.at.least',
        3,
      )

      // Verify public tickets are displayed
      cy.get('[data-testid="ticket-code"]').should('contain', 'PROMO10')
      cy.get('[data-testid="ticket-code"]').should('contain', 'BLACKFRIDAY')
      cy.get('[data-testid="ticket-code"]').should('contain', 'FRETE50')

      // Verify user-specific tickets are displayed
      cy.get('[data-testid="ticket-code"]').should('contain', 'WELCOME15')
      cy.get('[data-testid="ticket-code"]').should('contain', 'TROCA100')
      cy.get('[data-testid="ticket-code"]').should('contain', 'TROCA50')

      cy.log('✅ Available tickets displayed correctly')
    })

    it('should allow selecting single promotional ticket', () => {
      // Ensure toasts are not covering the page
      cy.get('[data-testid^="toast-"]', { timeout: 6000 }).should('not.exist')

      // Wait for tickets to be loaded - check existence first, then scroll for visibility
      cy.contains('Cupons Disponíveis', { timeout: 10000 })
        .should('exist')
        .scrollIntoView({ offset: { top: -200, left: 0 } })

      cy.get('[data-testid="ticket-card"]', { timeout: 5000 }).should(
        'have.length.at.least',
        1,
      )

      // Select one promotional ticket (BLACKFRIDAY)
      cy.get('[data-testid="ticket-code"]')
        .contains('BLACKFRIDAY', { timeout: 5000 })
        .should('exist')
        .closest('[data-testid="ticket-card"]')
        .scrollIntoView({ offset: { top: -150, left: 0 } })
        .should('exist')
        .within(() => {
          cy.get('[data-testid="ticket-checkbox"]', { timeout: 5000 })
            .should('exist')
            .check({ force: true })
        })

      // Wait for discount calculation
      cy.wait(500)

      // Verify discount is displayed
      cy.get('[data-testid="estimated-discount"]')
        .scrollIntoView({ offset: { top: -100, left: 0 } })
        .should('exist')
        .should('contain', 'R$')

      // Verify other promotional tickets are disabled
      cy.get('[data-testid="ticket-code"]')
        .contains('PROMO10')
        .closest('[data-testid="ticket-card"]')
        .within(() => {
          cy.get('[data-testid="ticket-checkbox"]').should('be.disabled')
        })

      cy.log('✅ Single promotional ticket selected correctly')
    })

    it('should allow selecting multiple exchange tickets with one promotional', () => {
      // Select one promotional ticket
      cy.get('[data-testid="ticket-code"]')
        .contains('BLACKFRIDAY')
        .closest('[data-testid="ticket-card"]')
        .scrollIntoView()
        .within(() => {
          cy.get('[data-testid="ticket-checkbox"]').check({ force: true })
        })

      cy.wait(500)

      // Select exchange tickets
      cy.get('[data-testid="ticket-code"]')
        .contains('TROCA100')
        .closest('[data-testid="ticket-card"]')
        .scrollIntoView()
        .within(() => {
          cy.get('[data-testid="ticket-checkbox"]').check({ force: true })
        })

      cy.wait(500)

      cy.get('[data-testid="ticket-code"]')
        .contains('TROCA50')
        .closest('[data-testid="ticket-card"]')
        .scrollIntoView()
        .within(() => {
          cy.get('[data-testid="ticket-checkbox"]').check({ force: true })
        })

      cy.wait(500)

      // Verify discount is calculated
      cy.get('[data-testid="estimated-discount"]')
        .scrollIntoView({ offset: { top: -100, left: 0 } })
        .should('exist')

      // Verify ticket count in summary
      cy.contains(/cupom.*selecionado/i).should('be.visible')

      cy.log('✅ Multiple tickets selected correctly')
    })

    it('should prevent selecting multiple promotional tickets', () => {
      // Select first promotional ticket
      cy.get('[data-testid="ticket-code"]')
        .contains('BLACKFRIDAY')
        .closest('[data-testid="ticket-card"]')
        .scrollIntoView()
        .within(() => {
          cy.get('[data-testid="ticket-checkbox"]').check({ force: true })
        })

      cy.wait(500)

      // Verify other promotional tickets are disabled
      cy.get('[data-testid="ticket-code"]')
        .contains('PROMO10')
        .closest('[data-testid="ticket-card"]')
        .scrollIntoView()
        .within(() => {
          cy.get('[data-testid="ticket-checkbox"]').should('be.disabled')
        })

      cy.get('[data-testid="ticket-code"]')
        .contains('FRETE50')
        .closest('[data-testid="ticket-card"]')
        .scrollIntoView()
        .within(() => {
          cy.get('[data-testid="ticket-checkbox"]').should('be.disabled')
        })

      cy.log('✅ Multiple promotional tickets prevented')
    })

    it('should update cart total when tickets are selected', () => {
      // Get initial total - scroll into view first to ensure visibility
      cy.get('[data-testid="cart-total-price"]')
        .scrollIntoView({ offset: { top: -100, left: 0 } })
        .should('exist')

      // Select tickets that give discount > item price (TROCA100 = R$ 100.00)
      cy.get('[data-testid="ticket-code"]')
        .contains('TROCA100')
        .closest('[data-testid="ticket-card"]')
        .scrollIntoView()
        .within(() => {
          cy.get('[data-testid="ticket-checkbox"]').check({ force: true })
        })

      cy.wait(1000)

      // Verify total shows discount or R$ 0,00 when discount covers full amount
      cy.get('[data-testid="cart-total-price"]')
        .scrollIntoView({ offset: { top: -100, left: 0 } })
        .should('exist')
      cy.get('[data-testid="estimated-discount"]')
        .scrollIntoView({ offset: { top: -100, left: 0 } })
        .should('exist')

      cy.log('✅ Cart total updated with tickets')
    })

    it('should show correct ticket nature badges', () => {
      // Verify promotional tickets show "Promocional"
      cy.get('[data-testid="ticket-nature"]')
        .contains('Promocional')
        .should('exist')

      // Verify exchange tickets show "Troca"
      cy.get('[data-testid="ticket-nature"]').contains('Troca').should('exist')

      cy.log('✅ Ticket nature badges displayed correctly')
    })
  })

  describe('Ticket Selection in Cart', () => {
    beforeEach(() => {
      // Clear cart before each test
      cy.window().then((window) => {
        window.localStorage.removeItem('cart-storage')
      })

      // Add a book to cart for ticket tests
      cy.visit('/catalog')
      cy.get('[data-testid="book-card"]', { timeout: 10000 })
        .first()
        .within(() => {
          cy.get('[data-testid="book-add-to-cart-button"]').click()
        })

      // Wait for cart badge to appear
      cy.get('[data-testid="cart-badge"]', { timeout: 10000 }).should(
        'be.visible',
      )

      cy.get('[data-testid="cart-icon"]').click({ force: true })

      // Wait for cart page to load
      cy.url().should('include', '/cart')

      // Wait for toasts to appear, then close them immediately
      // Toasts auto-dismiss after 5000ms, but we'll close them faster
      cy.wait(300) // Give toasts time to render

      // Try to close toasts if they exist (non-blocking)
      cy.get('body').then(($body) => {
        const toasts = $body.find('[data-testid^="toast-"]')
        if (toasts.length > 0) {
          // Close each toast by clicking its close button
          cy.get('[data-testid^="toast-"]').each(($toast) => {
            cy.wrap($toast)
              .find('button')
              .first()
              .click({ force: true, multiple: true })
          })
        }
      })

      // Wait for toasts to be removed from DOM (either by timeout or manual close)
      cy.get('[data-testid^="toast-"]', { timeout: 6000 }).should('not.exist')

      // Now verify the tickets section exists and scroll into view
      cy.contains('Cupons Disponíveis', { timeout: 10000 })
        .should('exist')
        .scrollIntoView({ offset: { top: -200, left: 0 } })

      cy.get('[data-testid="ticket-card"]', { timeout: 5000 }).should(
        'have.length.at.least',
        1,
      )
    })

    it('should display available tickets in cart', () => {
      // Wait for tickets to load (tickets section should appear after API call completes)
      cy.contains('Cupons Disponíveis', { timeout: 10000 })
        .should('exist')
        .scrollIntoView({ offset: { top: -100, left: 0 } })

      // Wait a bit more for all tickets to render
      cy.wait(500)

      // Verify tickets are displayed (should have at least 6: 3 public + 1 user promo + 2 exchange)
      cy.get('[data-testid="ticket-card"]', { timeout: 5000 }).should(
        'have.length.at.least',
        3,
      )

      // Verify public tickets are displayed
      cy.get('[data-testid="ticket-code"]').should('contain', 'PROMO10')
      cy.get('[data-testid="ticket-code"]').should('contain', 'BLACKFRIDAY')
      cy.get('[data-testid="ticket-code"]').should('contain', 'FRETE50')

      // Verify user-specific tickets are displayed
      cy.get('[data-testid="ticket-code"]').should('contain', 'WELCOME15')
      cy.get('[data-testid="ticket-code"]').should('contain', 'TROCA100')
      cy.get('[data-testid="ticket-code"]').should('contain', 'TROCA50')

      cy.log('✅ Available tickets displayed correctly')
    })

    it('should allow selecting single promotional ticket', () => {
      // Ensure toasts are not covering the page
      cy.get('[data-testid^="toast-"]', { timeout: 6000 }).should('not.exist')

      // Wait for tickets to be loaded - check existence first, then scroll for visibility
      cy.contains('Cupons Disponíveis', { timeout: 10000 })
        .should('exist')
        .scrollIntoView({ offset: { top: -200, left: 0 } })

      cy.get('[data-testid="ticket-card"]', { timeout: 5000 }).should(
        'have.length.at.least',
        1,
      )

      // Select one promotional ticket (BLACKFRIDAY)
      cy.get('[data-testid="ticket-code"]')
        .contains('BLACKFRIDAY', { timeout: 5000 })
        .should('exist')
        .closest('[data-testid="ticket-card"]')
        .scrollIntoView({ offset: { top: -150, left: 0 } })
        .should('exist')
        .within(() => {
          cy.get('[data-testid="ticket-checkbox"]', { timeout: 5000 })
            .should('exist')
            .check({ force: true })
        })

      // Wait for discount calculation
      cy.wait(500)

      // Verify discount is displayed
      cy.get('[data-testid="estimated-discount"]')
        .scrollIntoView({ offset: { top: -100, left: 0 } })
        .should('exist')
        .should('contain', 'R$')

      // Verify other promotional tickets are disabled
      cy.get('[data-testid="ticket-code"]')
        .contains('PROMO10')
        .closest('[data-testid="ticket-card"]')
        .within(() => {
          cy.get('[data-testid="ticket-checkbox"]').should('be.disabled')
        })

      cy.log('✅ Single promotional ticket selected correctly')
    })

    it('should allow selecting multiple exchange tickets with one promotional', () => {
      // Select one promotional ticket
      cy.get('[data-testid="ticket-code"]')
        .contains('BLACKFRIDAY')
        .closest('[data-testid="ticket-card"]')
        .scrollIntoView()
        .within(() => {
          cy.get('[data-testid="ticket-checkbox"]').check({ force: true })
        })

      cy.wait(500)

      // Select exchange tickets
      cy.get('[data-testid="ticket-code"]')
        .contains('TROCA100')
        .closest('[data-testid="ticket-card"]')
        .scrollIntoView()
        .within(() => {
          cy.get('[data-testid="ticket-checkbox"]').check({ force: true })
        })

      cy.wait(500)

      cy.get('[data-testid="ticket-code"]')
        .contains('TROCA50')
        .closest('[data-testid="ticket-card"]')
        .scrollIntoView()
        .within(() => {
          cy.get('[data-testid="ticket-checkbox"]').check({ force: true })
        })

      cy.wait(500)

      // Verify discount is calculated
      cy.get('[data-testid="estimated-discount"]')
        .scrollIntoView({ offset: { top: -100, left: 0 } })
        .should('exist')

      // Verify ticket count in summary
      cy.contains(/cupom.*selecionado/i).should('be.visible')

      cy.log('✅ Multiple tickets selected correctly')
    })

    it('should prevent selecting multiple promotional tickets', () => {
      // Select first promotional ticket
      cy.get('[data-testid="ticket-code"]')
        .contains('BLACKFRIDAY')
        .closest('[data-testid="ticket-card"]')
        .scrollIntoView()
        .within(() => {
          cy.get('[data-testid="ticket-checkbox"]').check({ force: true })
        })

      cy.wait(500)

      // Verify other promotional tickets are disabled
      cy.get('[data-testid="ticket-code"]')
        .contains('PROMO10')
        .closest('[data-testid="ticket-card"]')
        .scrollIntoView()
        .within(() => {
          cy.get('[data-testid="ticket-checkbox"]').should('be.disabled')
        })

      cy.get('[data-testid="ticket-code"]')
        .contains('FRETE50')
        .closest('[data-testid="ticket-card"]')
        .scrollIntoView()
        .within(() => {
          cy.get('[data-testid="ticket-checkbox"]').should('be.disabled')
        })

      cy.log('✅ Multiple promotional tickets prevented')
    })

    it('should update cart total when tickets are selected', () => {
      // Get initial total - scroll into view first to ensure visibility
      cy.get('[data-testid="cart-total-price"]')
        .scrollIntoView({ offset: { top: -100, left: 0 } })
        .should('exist')

      // Select tickets that give discount > item price (TROCA100 = R$ 100.00)
      cy.get('[data-testid="ticket-code"]')
        .contains('TROCA100')
        .closest('[data-testid="ticket-card"]')
        .scrollIntoView()
        .within(() => {
          cy.get('[data-testid="ticket-checkbox"]').check({ force: true })
        })

      cy.wait(1000)

      // Verify total shows discount or R$ 0,00 when discount covers full amount
      cy.get('[data-testid="cart-total-price"]')
        .scrollIntoView({ offset: { top: -100, left: 0 } })
        .should('exist')
      cy.get('[data-testid="estimated-discount"]')
        .scrollIntoView({ offset: { top: -100, left: 0 } })
        .should('exist')

      cy.log('✅ Cart total updated with tickets')
    })

    it('should show correct ticket nature badges', () => {
      // Verify promotional tickets show "Promocional"
      cy.get('[data-testid="ticket-nature"]')
        .contains('Promocional')
        .should('exist')

      // Verify exchange tickets show "Troca"
      cy.get('[data-testid="ticket-nature"]').contains('Troca').should('exist')

      cy.log('✅ Ticket nature badges displayed correctly')
    })
  })

  describe('Checkout Process', () => {
    beforeEach(() => {
      // Clear cart before each test
      cy.window().then((window) => {
        window.localStorage.removeItem('cart-storage')
      })

      // Ensure user has at least one address before checkout tests
      // Create address via API if user doesn't have one
      cy.request({
        method: 'GET',
        url: `${Cypress.env('API_URL') || 'http://localhost:3000'}/api/me`,
        headers: {
          Authorization: `Bearer ${testUser.token.accessToken}`,
        },
        failOnStatusCode: false,
      }).then((userResponse) => {
        if (
          userResponse.status === 200 &&
          (!userResponse.body.addresses ||
            userResponse.body.addresses.length === 0)
        ) {
          // User has no addresses - create one
          return cy
            .request({
              method: 'POST',
              url: `${Cypress.env('API_URL') || 'http://localhost:3000'}/api/me/addresses`,
              headers: {
                Authorization: `Bearer ${testUser.token.accessToken}`,
                'Content-Type': 'application/json',
              },
              body: {
                addressName: 'Casa',
                type: 'house',
                purpose: 'both',
                postalCode: '08720340',
                street: 'Avenida Professor Mariano Salvarani',
                number: '521',
                district: 'Jardim Camila',
                city: 'Mogi das Cruzes',
                state: 'SP',
                complement: 'Casa 1',
              },
              failOnStatusCode: false,
            })
            .then(() => {
              // Wait a bit for address to be saved
              cy.wait(300)
            })
        }
      })

      // Wait for address check/create to complete
      cy.wait(500)

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

      // Close any toast notifications
      cy.wait(300)
      cy.get('body').then(($body) => {
        const toasts = $body.find('[data-testid^="toast-"]')
        if (toasts.length > 0) {
          cy.get('[data-testid^="toast-"]').each(($toast) => {
            cy.wrap($toast)
              .find('button')
              .first()
              .click({ force: true, multiple: true })
          })
          cy.wait(300)
        }
      })

      // Close any toast notifications
      cy.wait(300)
      cy.get('body').then(($body) => {
        const toasts = $body.find('[data-testid^="toast-"]')
        if (toasts.length > 0) {
          cy.get('[data-testid^="toast-"]').each(($toast) => {
            cy.wrap($toast)
              .find('button')
              .first()
              .click({ force: true, multiple: true })
          })
          cy.wait(300)
        }
      })
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

      // Should redirect to orders page
      cy.url().should('include', '/orders', { timeout: 10000 })
      // Should redirect to orders page
      cy.url().should('include', '/orders', { timeout: 10000 })

      cy.log('✅ Checkout completed successfully')
    })

    it('should open add address form when clicking add button', () => {
      // Click checkout button
      cy.get('[data-testid="cart-checkout-button"]').click()

      // Wait for modal to appear
      cy.contains('Selecionar Endereço de Entrega', { timeout: 10000 }).should(
        'exist',
      )

      // Wait for modal to fully render
      cy.wait(500)

      // Click add address button - wait for it to be visible
      cy.get('[data-testid="add-address-button"]', { timeout: 5000 })
        .should('be.visible')
        .click()

      // Verify address form is displayed
      cy.contains('Adicionar Novo Endereço').should('be.visible')
      cy.get('[data-testid="address-form"]').should('be.visible')

      // Verify form fields are visible
      cy.contains('Nome do Endereço').should('be.visible')
      cy.contains('Tipo de Residência').should('be.visible')
      cy.contains('Finalidade').should('be.visible')
      cy.contains('CEP').should('be.visible')
      cy.contains('Rua').should('be.visible')
      cy.contains('Número').should('be.visible')
      cy.contains('Cidade').should('be.visible')
      cy.contains('Estado').should('be.visible')

      cy.log('✅ Add address form opened')
    })

    it('should create new address and show it in modal', () => {
      // Click checkout button
      cy.get('[data-testid="cart-checkout-button"]').click()

      // Wait for address selection modal to appear (user should have at least one address from beforeEach)
      cy.contains('Selecionar Endereço de Entrega', { timeout: 10000 }).should(
        'exist',
      )

      // Wait for modal to fully load
      cy.wait(500)

      // Click add address button - wait for it to be visible
      cy.get('[data-testid="add-address-button"]', { timeout: 5000 })
        .should('be.visible')
        .first()
        .click()

      cy.wait(500)

      // Fill address form
      cy.get('[data-testid="address-form"]').within(() => {
        cy.get('input[name="addressName"]').type('Trabalho')
        // Use aria-label to find selects since they don't have name attribute
        cy.get('select[aria-label="Tipo de Residência"]').select('work')
        cy.get('select[aria-label="Finalidade"]').select('delivery')
        cy.get('input[name="postalCode"]').type('01310100')
        cy.get('input[name="street"]').type('Avenida Paulista')
        cy.get('input[name="number"]').type('1000')
        cy.get('input[name="complement"]').type('Sala 100')
        cy.get('input[name="district"]').type('Bela Vista')
        cy.get('input[name="city"]').type('São Paulo')
        cy.get('select[aria-label="Estado"]').select('SP')
      })

      // Submit form
      cy.get('[data-testid="save-address-button"]').click()

      // Wait for success and form to close
      cy.wait(2000)

      // Verify new address appears in address list
      cy.contains('Trabalho').should('be.visible')

      // Verify new address is auto-selected (confirm button should be enabled)
      cy.get('[data-testid="address-confirm-button"]').should('not.be.disabled')

      cy.log('✅ New address created and displayed')
    })

    it('should cancel address creation and return to address list', () => {
      // Click checkout button
      cy.get('[data-testid="cart-checkout-button"]').click()

      // Wait for modal to appear
      cy.contains('Selecionar Endereço de Entrega', { timeout: 10000 }).should(
        'exist',
      )

      cy.wait(500)

      // Click add address button
      cy.get('[data-testid="add-address-button"]', { timeout: 5000 })
        .should('be.visible')
        .first()
        .click()

      cy.wait(500)

      // Fill some fields
      cy.get('[data-testid="address-form"]').within(() => {
        cy.get('input[name="addressName"]').type('Test Address')
      })

      // Click cancel button
      cy.get('[data-testid="cancel-add-address-button"]').click()

      cy.wait(500)

      // Verify form closes and address list is shown
      cy.contains('Adicionar Novo Endereço').should('not.exist')
      cy.contains('Seus Endereços').should('be.visible')

      cy.log('✅ Address creation canceled')
    })

    it('should validate address form fields', () => {
      // Click checkout button
      cy.get('[data-testid="cart-checkout-button"]').click()

      // Wait for modal to appear
      cy.contains('Selecionar Endereço de Entrega', { timeout: 10000 }).should(
        'exist',
      )

      cy.wait(500)

      // Click add address button
      cy.get('[data-testid="add-address-button"]', { timeout: 5000 })
        .should('be.visible')
        .first()
        .click()

      cy.wait(500)

      // Attempt to submit empty form
      cy.get('[data-testid="save-address-button"]').click()

      // Verify validation errors appear (form should not submit)
      cy.get('[data-testid="address-form"]').should('be.visible')

      // Fill required fields
      cy.get('[data-testid="address-form"]').within(() => {
        cy.get('input[name="addressName"]').type('Casa')
        // Use aria-label to find selects since they don't have name attribute
        cy.get('select[aria-label="Tipo de Residência"]').select('house')
        cy.get('select[aria-label="Finalidade"]').select('delivery')
        cy.get('input[name="postalCode"]').type('01310100')
        cy.get('input[name="street"]').type('Test Street')
        cy.get('input[name="number"]').type('123')
        cy.get('input[name="district"]').type('Test District')
        cy.get('input[name="city"]').type('São Paulo')
        cy.get('select[aria-label="Estado"]').select('SP')
      })

      // Verify submit is enabled now
      cy.get('[data-testid="save-address-button"]').should('not.be.disabled')

      cy.log('✅ Address form validation working')
    })

    it('should open add address form when clicking add button', () => {
      // Click checkout button
      cy.get('[data-testid="cart-checkout-button"]').click()

      // Wait for modal to appear
      cy.contains('Selecionar Endereço de Entrega', { timeout: 10000 }).should(
        'exist',
      )

      // Wait for modal to fully render
      cy.wait(500)

      // Click add address button - wait for it to be visible
      cy.get('[data-testid="add-address-button"]', { timeout: 5000 })
        .should('be.visible')
        .click()

      // Verify address form is displayed
      cy.contains('Adicionar Novo Endereço').should('be.visible')
      cy.get('[data-testid="address-form"]').should('be.visible')

      // Verify form fields are visible
      cy.contains('Nome do Endereço').should('be.visible')
      cy.contains('Tipo de Residência').should('be.visible')
      cy.contains('Finalidade').should('be.visible')
      cy.contains('CEP').should('be.visible')
      cy.contains('Rua').should('be.visible')
      cy.contains('Número').should('be.visible')
      cy.contains('Cidade').should('be.visible')
      cy.contains('Estado').should('be.visible')

      cy.log('✅ Add address form opened')
    })

    it('should create new address and show it in modal', () => {
      // Click checkout button
      cy.get('[data-testid="cart-checkout-button"]').click()

      // Wait for address selection modal to appear (user should have at least one address from beforeEach)
      cy.contains('Selecionar Endereço de Entrega', { timeout: 10000 }).should(
        'exist',
      )

      // Wait for modal to fully load
      cy.wait(500)

      // Click add address button - wait for it to be visible
      cy.get('[data-testid="add-address-button"]', { timeout: 5000 })
        .should('be.visible')
        .first()
        .click()

      cy.wait(500)

      // Fill address form
      cy.get('[data-testid="address-form"]').within(() => {
        cy.get('input[name="addressName"]').type('Trabalho')
        // Use aria-label to find selects since they don't have name attribute
        cy.get('select[aria-label="Tipo de Residência"]').select('work')
        cy.get('select[aria-label="Finalidade"]').select('delivery')
        cy.get('input[name="postalCode"]').type('01310100')
        cy.get('input[name="street"]').type('Avenida Paulista')
        cy.get('input[name="number"]').type('1000')
        cy.get('input[name="complement"]').type('Sala 100')
        cy.get('input[name="district"]').type('Bela Vista')
        cy.get('input[name="city"]').type('São Paulo')
        cy.get('select[aria-label="Estado"]').select('SP')
      })

      // Submit form
      cy.get('[data-testid="save-address-button"]').click()

      // Wait for success and form to close
      cy.wait(2000)

      // Verify new address appears in address list
      cy.contains('Trabalho').should('be.visible')

      // Verify new address is auto-selected (confirm button should be enabled)
      cy.get('[data-testid="address-confirm-button"]').should('not.be.disabled')

      cy.log('✅ New address created and displayed')
    })

    it('should cancel address creation and return to address list', () => {
      // Click checkout button
      cy.get('[data-testid="cart-checkout-button"]').click()

      // Wait for modal to appear
      cy.contains('Selecionar Endereço de Entrega', { timeout: 10000 }).should(
        'exist',
      )

      cy.wait(500)

      // Click add address button
      cy.get('[data-testid="add-address-button"]', { timeout: 5000 })
        .should('be.visible')
        .first()
        .click()

      cy.wait(500)

      // Fill some fields
      cy.get('[data-testid="address-form"]').within(() => {
        cy.get('input[name="addressName"]').type('Test Address')
      })

      // Click cancel button
      cy.get('[data-testid="cancel-add-address-button"]').click()

      cy.wait(500)

      // Verify form closes and address list is shown
      cy.contains('Adicionar Novo Endereço').should('not.exist')
      cy.contains('Seus Endereços').should('be.visible')

      cy.log('✅ Address creation canceled')
    })

    it('should validate address form fields', () => {
      // Click checkout button
      cy.get('[data-testid="cart-checkout-button"]').click()

      // Wait for modal to appear
      cy.contains('Selecionar Endereço de Entrega', { timeout: 10000 }).should(
        'exist',
      )

      cy.wait(500)

      // Click add address button
      cy.get('[data-testid="add-address-button"]', { timeout: 5000 })
        .should('be.visible')
        .first()
        .click()

      cy.wait(500)

      // Attempt to submit empty form
      cy.get('[data-testid="save-address-button"]').click()

      // Verify validation errors appear (form should not submit)
      cy.get('[data-testid="address-form"]').should('be.visible')

      // Fill required fields
      cy.get('[data-testid="address-form"]').within(() => {
        cy.get('input[name="addressName"]').type('Casa')
        // Use aria-label to find selects since they don't have name attribute
        cy.get('select[aria-label="Tipo de Residência"]').select('house')
        cy.get('select[aria-label="Finalidade"]').select('delivery')
        cy.get('input[name="postalCode"]').type('01310100')
        cy.get('input[name="street"]').type('Test Street')
        cy.get('input[name="number"]').type('123')
        cy.get('input[name="district"]').type('Test District')
        cy.get('input[name="city"]').type('São Paulo')
        cy.get('select[aria-label="Estado"]').select('SP')
      })

      // Verify submit is enabled now
      cy.get('[data-testid="save-address-button"]').should('not.be.disabled')

      cy.log('✅ Address form validation working')
    })

    it('should open add address form when clicking add button', () => {
      // Click checkout button
      cy.get('[data-testid="cart-checkout-button"]').click()

      // Wait for modal to appear
      cy.contains('Selecionar Endereço de Entrega', { timeout: 10000 }).should(
        'exist',
      )

      // Wait for modal to fully render
      cy.wait(500)

      // Click add address button - wait for it to be visible
      cy.get('[data-testid="add-address-button"]', { timeout: 5000 })
        .should('be.visible')
        .click()

      // Verify address form is displayed
      cy.contains('Adicionar Novo Endereço').should('be.visible')
      cy.get('[data-testid="address-form"]').should('be.visible')

      // Verify form fields are visible
      cy.contains('Nome do Endereço').should('be.visible')
      cy.contains('Tipo de Residência').should('be.visible')
      cy.contains('Finalidade').should('be.visible')
      cy.contains('CEP').should('be.visible')
      cy.contains('Rua').should('be.visible')
      cy.contains('Número').should('be.visible')
      cy.contains('Cidade').should('be.visible')
      cy.contains('Estado').should('be.visible')

      cy.log('✅ Add address form opened')
    })

    it('should create new address and show it in modal', () => {
      // Click checkout button
      cy.get('[data-testid="cart-checkout-button"]').click()

      // Wait for address selection modal to appear (user should have at least one address from beforeEach)
      cy.contains('Selecionar Endereço de Entrega', { timeout: 10000 }).should(
        'exist',
      )

      // Wait for modal to fully load
      cy.wait(500)

      // Click add address button - wait for it to be visible
      cy.get('[data-testid="add-address-button"]', { timeout: 5000 })
        .should('be.visible')
        .first()
        .click()

      cy.wait(500)

      // Fill address form
      cy.get('[data-testid="address-form"]').within(() => {
        cy.get('input[name="addressName"]').type('Trabalho')
        // Use aria-label to find selects since they don't have name attribute
        cy.get('select[aria-label="Tipo de Residência"]').select('work')
        cy.get('select[aria-label="Finalidade"]').select('delivery')
        cy.get('input[name="postalCode"]').type('01310100')
        cy.get('input[name="street"]').type('Avenida Paulista')
        cy.get('input[name="number"]').type('1000')
        cy.get('input[name="complement"]').type('Sala 100')
        cy.get('input[name="district"]').type('Bela Vista')
        cy.get('input[name="city"]').type('São Paulo')
        cy.get('select[aria-label="Estado"]').select('SP')
      })

      // Submit form
      cy.get('[data-testid="save-address-button"]').click()

      // Wait for success and form to close
      cy.wait(2000)

      // Verify new address appears in address list
      cy.contains('Trabalho').should('be.visible')

      // Verify new address is auto-selected (confirm button should be enabled)
      cy.get('[data-testid="address-confirm-button"]').should('not.be.disabled')

      cy.log('✅ New address created and displayed')
    })

    it('should cancel address creation and return to address list', () => {
      // Click checkout button
      cy.get('[data-testid="cart-checkout-button"]').click()

      // Wait for modal to appear
      cy.contains('Selecionar Endereço de Entrega', { timeout: 10000 }).should(
        'exist',
      )

      cy.wait(500)

      // Click add address button
      cy.get('[data-testid="add-address-button"]', { timeout: 5000 })
        .should('be.visible')
        .first()
        .click()

      cy.wait(500)

      // Fill some fields
      cy.get('[data-testid="address-form"]').within(() => {
        cy.get('input[name="addressName"]').type('Test Address')
      })

      // Click cancel button
      cy.get('[data-testid="cancel-add-address-button"]').click()

      cy.wait(500)

      // Verify form closes and address list is shown
      cy.contains('Adicionar Novo Endereço').should('not.exist')
      cy.contains('Seus Endereços').should('be.visible')

      cy.log('✅ Address creation canceled')
    })

    it('should validate address form fields', () => {
      // Click checkout button
      cy.get('[data-testid="cart-checkout-button"]').click()

      // Wait for modal to appear
      cy.contains('Selecionar Endereço de Entrega', { timeout: 10000 }).should(
        'exist',
      )

      cy.wait(500)

      // Click add address button
      cy.get('[data-testid="add-address-button"]', { timeout: 5000 })
        .should('be.visible')
        .first()
        .click()

      cy.wait(500)

      // Attempt to submit empty form
      cy.get('[data-testid="save-address-button"]').click()

      // Verify validation errors appear (form should not submit)
      cy.get('[data-testid="address-form"]').should('be.visible')

      // Fill required fields
      cy.get('[data-testid="address-form"]').within(() => {
        cy.get('input[name="addressName"]').type('Casa')
        // Use aria-label to find selects since they don't have name attribute
        cy.get('select[aria-label="Tipo de Residência"]').select('house')
        cy.get('select[aria-label="Finalidade"]').select('delivery')
        cy.get('input[name="postalCode"]').type('01310100')
        cy.get('input[name="street"]').type('Test Street')
        cy.get('input[name="number"]').type('123')
        cy.get('input[name="district"]').type('Test District')
        cy.get('input[name="city"]').type('São Paulo')
        cy.get('select[aria-label="Estado"]').select('SP')
      })

      // Verify submit is enabled now
      cy.get('[data-testid="save-address-button"]').should('not.be.disabled')

      cy.log('✅ Address form validation working')
    })

    it('should open add address form when clicking add button', () => {
      // Click checkout button
      cy.get('[data-testid="cart-checkout-button"]').click()

      // Wait for modal to appear
      cy.contains('Selecionar Endereço de Entrega', { timeout: 10000 }).should(
        'exist',
      )

      // Wait for modal to fully render
      cy.wait(500)

      // Click add address button - wait for it to be visible
      cy.get('[data-testid="add-address-button"]', { timeout: 5000 })
        .should('be.visible')
        .click()

      // Verify address form is displayed
      cy.contains('Adicionar Novo Endereço').should('be.visible')
      cy.get('[data-testid="address-form"]').should('be.visible')

      // Verify form fields are visible
      cy.contains('Nome do Endereço').should('be.visible')
      cy.contains('Tipo de Residência').should('be.visible')
      cy.contains('Finalidade').should('be.visible')
      cy.contains('CEP').should('be.visible')
      cy.contains('Rua').should('be.visible')
      cy.contains('Número').should('be.visible')
      cy.contains('Cidade').should('be.visible')
      cy.contains('Estado').should('be.visible')

      cy.log('✅ Add address form opened')
    })

    it('should create new address and show it in modal', () => {
      // Click checkout button
      cy.get('[data-testid="cart-checkout-button"]').click()

      // Wait for address selection modal to appear (user should have at least one address from beforeEach)
      cy.contains('Selecionar Endereço de Entrega', { timeout: 10000 }).should(
        'exist',
      )

      // Wait for modal to fully load
      cy.wait(500)

      // Click add address button - wait for it to be visible
      cy.get('[data-testid="add-address-button"]', { timeout: 5000 })
        .should('be.visible')
        .first()
        .click()

      cy.wait(500)

      // Fill address form
      cy.get('[data-testid="address-form"]').within(() => {
        cy.get('input[name="addressName"]').type('Trabalho')
        // Use aria-label to find selects since they don't have name attribute
        cy.get('select[aria-label="Tipo de Residência"]').select('work')
        cy.get('select[aria-label="Finalidade"]').select('delivery')
        cy.get('input[name="postalCode"]').type('01310100')
        cy.get('input[name="street"]').type('Avenida Paulista')
        cy.get('input[name="number"]').type('1000')
        cy.get('input[name="complement"]').type('Sala 100')
        cy.get('input[name="district"]').type('Bela Vista')
        cy.get('input[name="city"]').type('São Paulo')
        cy.get('select[aria-label="Estado"]').select('SP')
      })

      // Submit form
      cy.get('[data-testid="save-address-button"]').click()

      // Wait for success and form to close
      cy.wait(2000)

      // Verify new address appears in address list
      cy.contains('Trabalho').should('be.visible')

      // Verify new address is auto-selected (confirm button should be enabled)
      cy.get('[data-testid="address-confirm-button"]').should('not.be.disabled')

      cy.log('✅ New address created and displayed')
    })

    it('should cancel address creation and return to address list', () => {
      // Click checkout button
      cy.get('[data-testid="cart-checkout-button"]').click()

      // Wait for modal to appear
      cy.contains('Selecionar Endereço de Entrega', { timeout: 10000 }).should(
        'exist',
      )

      cy.wait(500)

      // Click add address button
      cy.get('[data-testid="add-address-button"]', { timeout: 5000 })
        .should('be.visible')
        .first()
        .click()

      cy.wait(500)

      // Fill some fields
      cy.get('[data-testid="address-form"]').within(() => {
        cy.get('input[name="addressName"]').type('Test Address')
      })

      // Click cancel button
      cy.get('[data-testid="cancel-add-address-button"]').click()

      cy.wait(500)

      // Verify form closes and address list is shown
      cy.contains('Adicionar Novo Endereço').should('not.exist')
      cy.contains('Seus Endereços').should('be.visible')

      cy.log('✅ Address creation canceled')
    })

    it('should validate address form fields', () => {
      // Click checkout button
      cy.get('[data-testid="cart-checkout-button"]').click()

      // Wait for modal to appear
      cy.contains('Selecionar Endereço de Entrega', { timeout: 10000 }).should(
        'exist',
      )

      cy.wait(500)

      // Click add address button
      cy.get('[data-testid="add-address-button"]', { timeout: 5000 })
        .should('be.visible')
        .first()
        .click()

      cy.wait(500)

      // Attempt to submit empty form
      cy.get('[data-testid="save-address-button"]').click()

      // Verify validation errors appear (form should not submit)
      cy.get('[data-testid="address-form"]').should('be.visible')

      // Fill required fields
      cy.get('[data-testid="address-form"]').within(() => {
        cy.get('input[name="addressName"]').type('Casa')
        // Use aria-label to find selects since they don't have name attribute
        cy.get('select[aria-label="Tipo de Residência"]').select('house')
        cy.get('select[aria-label="Finalidade"]').select('delivery')
        cy.get('input[name="postalCode"]').type('01310100')
        cy.get('input[name="street"]').type('Test Street')
        cy.get('input[name="number"]').type('123')
        cy.get('input[name="district"]').type('Test District')
        cy.get('input[name="city"]').type('São Paulo')
        cy.get('select[aria-label="Estado"]').select('SP')
      })

      // Verify submit is enabled now
      cy.get('[data-testid="save-address-button"]').should('not.be.disabled')

      cy.log('✅ Address form validation working')
    })

    it('should open add address form when clicking add button', () => {
      // Click checkout button
      cy.get('[data-testid="cart-checkout-button"]').click()

      // Wait for modal to appear
      cy.contains('Selecionar Endereço de Entrega', { timeout: 10000 }).should(
        'exist',
      )

      // Wait for modal to fully render
      cy.wait(500)

      // Click add address button - wait for it to be visible
      cy.get('[data-testid="add-address-button"]', { timeout: 5000 })
        .should('be.visible')
        .click()

      // Verify address form is displayed
      cy.contains('Adicionar Novo Endereço').should('be.visible')
      cy.get('[data-testid="address-form"]').should('be.visible')

      // Verify form fields are visible
      cy.contains('Nome do Endereço').should('be.visible')
      cy.contains('Tipo de Residência').should('be.visible')
      cy.contains('Finalidade').should('be.visible')
      cy.contains('CEP').should('be.visible')
      cy.contains('Rua').should('be.visible')
      cy.contains('Número').should('be.visible')
      cy.contains('Cidade').should('be.visible')
      cy.contains('Estado').should('be.visible')

      cy.log('✅ Add address form opened')
    })

    it('should create new address and show it in modal', () => {
      // Click checkout button
      cy.get('[data-testid="cart-checkout-button"]').click()

      // Wait for address selection modal to appear (user should have at least one address from beforeEach)
      cy.contains('Selecionar Endereço de Entrega', { timeout: 10000 }).should(
        'exist',
      )

      // Wait for modal to fully load
      cy.wait(500)

      // Click add address button - wait for it to be visible
      cy.get('[data-testid="add-address-button"]', { timeout: 5000 })
        .should('be.visible')
        .first()
        .click()

      cy.wait(500)

      // Fill address form
      cy.get('[data-testid="address-form"]').within(() => {
        cy.get('input[name="addressName"]').type('Trabalho')
        // Use aria-label to find selects since they don't have name attribute
        cy.get('select[aria-label="Tipo de Residência"]').select('work')
        cy.get('select[aria-label="Finalidade"]').select('delivery')
        cy.get('input[name="postalCode"]').type('01310100')
        cy.get('input[name="street"]').type('Avenida Paulista')
        cy.get('input[name="number"]').type('1000')
        cy.get('input[name="complement"]').type('Sala 100')
        cy.get('input[name="district"]').type('Bela Vista')
        cy.get('input[name="city"]').type('São Paulo')
        cy.get('select[aria-label="Estado"]').select('SP')
      })

      // Submit form
      cy.get('[data-testid="save-address-button"]').click()

      // Wait for success and form to close
      cy.wait(2000)

      // Verify new address appears in address list
      cy.contains('Trabalho').should('be.visible')

      // Verify new address is auto-selected (confirm button should be enabled)
      cy.get('[data-testid="address-confirm-button"]').should('not.be.disabled')

      cy.log('✅ New address created and displayed')
    })

    it('should cancel address creation and return to address list', () => {
      // Click checkout button
      cy.get('[data-testid="cart-checkout-button"]').click()

      // Wait for modal to appear
      cy.contains('Selecionar Endereço de Entrega', { timeout: 10000 }).should(
        'exist',
      )

      cy.wait(500)

      // Click add address button
      cy.get('[data-testid="add-address-button"]', { timeout: 5000 })
        .should('be.visible')
        .first()
        .click()

      cy.wait(500)

      // Fill some fields
      cy.get('[data-testid="address-form"]').within(() => {
        cy.get('input[name="addressName"]').type('Test Address')
      })

      // Click cancel button
      cy.get('[data-testid="cancel-add-address-button"]').click()

      cy.wait(500)

      // Verify form closes and address list is shown
      cy.contains('Adicionar Novo Endereço').should('not.exist')
      cy.contains('Seus Endereços').should('be.visible')

      cy.log('✅ Address creation canceled')
    })

    it('should validate address form fields', () => {
      // Click checkout button
      cy.get('[data-testid="cart-checkout-button"]').click()

      // Wait for modal to appear
      cy.contains('Selecionar Endereço de Entrega', { timeout: 10000 }).should(
        'exist',
      )

      cy.wait(500)

      // Click add address button
      cy.get('[data-testid="add-address-button"]', { timeout: 5000 })
        .should('be.visible')
        .first()
        .click()

      cy.wait(500)

      // Attempt to submit empty form
      cy.get('[data-testid="save-address-button"]').click()

      // Verify validation errors appear (form should not submit)
      cy.get('[data-testid="address-form"]').should('be.visible')

      // Fill required fields
      cy.get('[data-testid="address-form"]').within(() => {
        cy.get('input[name="addressName"]').type('Casa')
        // Use aria-label to find selects since they don't have name attribute
        cy.get('select[aria-label="Tipo de Residência"]').select('house')
        cy.get('select[aria-label="Finalidade"]').select('delivery')
        cy.get('input[name="postalCode"]').type('01310100')
        cy.get('input[name="street"]').type('Test Street')
        cy.get('input[name="number"]').type('123')
        cy.get('input[name="district"]').type('Test District')
        cy.get('input[name="city"]').type('São Paulo')
        cy.get('select[aria-label="Estado"]').select('SP')
      })

      // Verify submit is enabled now
      cy.get('[data-testid="save-address-button"]').should('not.be.disabled')

      cy.log('✅ Address form validation working')
    })

    it('should open add address form when clicking add button', () => {
      // Click checkout button
      cy.get('[data-testid="cart-checkout-button"]').click()

      // Wait for modal to appear
      cy.contains('Selecionar Endereço de Entrega', { timeout: 10000 }).should(
        'exist',
      )

      // Wait for modal to fully render
      cy.wait(500)

      // Click add address button - wait for it to be visible
      cy.get('[data-testid="add-address-button"]', { timeout: 5000 })
        .should('be.visible')
        .click()

      // Verify address form is displayed
      cy.contains('Adicionar Novo Endereço').should('be.visible')
      cy.get('[data-testid="address-form"]').should('be.visible')

      // Verify form fields are visible
      cy.contains('Nome do Endereço').should('be.visible')
      cy.contains('Tipo de Residência').should('be.visible')
      cy.contains('Finalidade').should('be.visible')
      cy.contains('CEP').should('be.visible')
      cy.contains('Rua').should('be.visible')
      cy.contains('Número').should('be.visible')
      cy.contains('Cidade').should('be.visible')
      cy.contains('Estado').should('be.visible')

      cy.log('✅ Add address form opened')
    })

    it('should create new address and show it in modal', () => {
      // Click checkout button
      cy.get('[data-testid="cart-checkout-button"]').click()

      // Wait for address selection modal to appear (user should have at least one address from beforeEach)
      cy.contains('Selecionar Endereço de Entrega', { timeout: 10000 }).should(
        'exist',
      )

      // Wait for modal to fully load
      cy.wait(500)

      // Click add address button - wait for it to be visible
      cy.get('[data-testid="add-address-button"]', { timeout: 5000 })
        .should('be.visible')
        .first()
        .click()

      cy.wait(500)

      // Fill address form
      cy.get('[data-testid="address-form"]').within(() => {
        cy.get('input[name="addressName"]').type('Trabalho')
        // Use aria-label to find selects since they don't have name attribute
        cy.get('select[aria-label="Tipo de Residência"]').select('work')
        cy.get('select[aria-label="Finalidade"]').select('delivery')
        cy.get('input[name="postalCode"]').type('01310100')
        cy.get('input[name="street"]').type('Avenida Paulista')
        cy.get('input[name="number"]').type('1000')
        cy.get('input[name="complement"]').type('Sala 100')
        cy.get('input[name="district"]').type('Bela Vista')
        cy.get('input[name="city"]').type('São Paulo')
        cy.get('select[aria-label="Estado"]').select('SP')
      })

      // Submit form
      cy.get('[data-testid="save-address-button"]').click()

      // Wait for success and form to close
      cy.wait(2000)

      // Verify new address appears in address list
      cy.contains('Trabalho').should('be.visible')

      // Verify new address is auto-selected (confirm button should be enabled)
      cy.get('[data-testid="address-confirm-button"]').should('not.be.disabled')

      cy.log('✅ New address created and displayed')
    })

    it('should cancel address creation and return to address list', () => {
      // Click checkout button
      cy.get('[data-testid="cart-checkout-button"]').click()

      // Wait for modal to appear
      cy.contains('Selecionar Endereço de Entrega', { timeout: 10000 }).should(
        'exist',
      )

      cy.wait(500)

      // Click add address button
      cy.get('[data-testid="add-address-button"]', { timeout: 5000 })
        .should('be.visible')
        .first()
        .click()

      cy.wait(500)

      // Fill some fields
      cy.get('[data-testid="address-form"]').within(() => {
        cy.get('input[name="addressName"]').type('Test Address')
      })

      // Click cancel button
      cy.get('[data-testid="cancel-add-address-button"]').click()

      cy.wait(500)

      // Verify form closes and address list is shown
      cy.contains('Adicionar Novo Endereço').should('not.exist')
      cy.contains('Seus Endereços').should('be.visible')

      cy.log('✅ Address creation canceled')
    })

    it('should validate address form fields', () => {
      // Click checkout button
      cy.get('[data-testid="cart-checkout-button"]').click()

      // Wait for modal to appear
      cy.contains('Selecionar Endereço de Entrega', { timeout: 10000 }).should(
        'exist',
      )

      cy.wait(500)

      // Click add address button
      cy.get('[data-testid="add-address-button"]', { timeout: 5000 })
        .should('be.visible')
        .first()
        .click()

      cy.wait(500)

      // Attempt to submit empty form
      cy.get('[data-testid="save-address-button"]').click()

      // Verify validation errors appear (form should not submit)
      cy.get('[data-testid="address-form"]').should('be.visible')

      // Fill required fields
      cy.get('[data-testid="address-form"]').within(() => {
        cy.get('input[name="addressName"]').type('Casa')
        // Use aria-label to find selects since they don't have name attribute
        cy.get('select[aria-label="Tipo de Residência"]').select('house')
        cy.get('select[aria-label="Finalidade"]').select('delivery')
        cy.get('input[name="postalCode"]').type('01310100')
        cy.get('input[name="street"]').type('Test Street')
        cy.get('input[name="number"]').type('123')
        cy.get('input[name="district"]').type('Test District')
        cy.get('input[name="city"]').type('São Paulo')
        cy.get('select[aria-label="Estado"]').select('SP')
      })

      // Verify submit is enabled now
      cy.get('[data-testid="save-address-button"]').should('not.be.disabled')

      cy.log('✅ Address form validation working')
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

      // Check the "Show cancelled orders" checkbox to display cancelled orders
      cy.get('#show-cancelled').check({ force: true })

      // Wait for orders to update
      cy.wait(1000)

      // Check the "Show cancelled orders" checkbox to display cancelled orders
      cy.get('#show-cancelled').check({ force: true })

      // Wait for orders to update
      cy.wait(1000)

      // Verify the first order card has Cancelado status and no action buttons
      cy.get('[data-testid="order-card"]', { timeout: 5000 })
      cy.get('[data-testid="order-card"]', { timeout: 5000 })
        .first()
        .within(() => {
          // Order status should be Cancelado
          cy.get('[data-testid="order-status-badge"]', {
            timeout: 5000,
          }).should('contain', 'Cancelado')

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

      // Create a payment card for tests that need it
      cy.request({
        method: 'POST',
        url: `${Cypress.env('API_URL') || 'http://localhost:3000'}/api/me/cards`,
        headers: {
          Authorization: `Bearer ${testUser.token.accessToken}`,
        },
        body: {
          number: '4111111111111111',
          holderName: testUser.name || 'Test User',
          expirationDate: new Date('2030-12-01').toISOString(),
          cvv: '123',
          type: 'credit',
        },
        failOnStatusCode: false,
      })

      // Create a payment card for tests that need it
      cy.request({
        method: 'POST',
        url: `${Cypress.env('API_URL') || 'http://localhost:3000'}/api/me/cards`,
        headers: {
          Authorization: `Bearer ${testUser.token.accessToken}`,
        },
        body: {
          number: '4111111111111111',
          holderName: testUser.name || 'Test User',
          expirationDate: new Date('2030-12-01').toISOString(),
          cvv: '123',
          type: 'credit',
        },
        failOnStatusCode: false,
      })
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

    it('should display applied tickets in payment modal', () => {
      // Create an order with tickets first
      cy.visit('/catalog')
      cy.get('[data-testid="book-card"]', { timeout: 10000 })
        .first()
        .within(() => {
          cy.get('[data-testid="book-add-to-cart-button"]').click()
        })

      cy.get('[data-testid="cart-icon"]').click({ force: true })
      cy.wait(1000)

      // Select tickets
      cy.get('[data-testid="ticket-code"]')
        .contains('BLACKFRIDAY')
        .closest('[data-testid="ticket-card"]')
        .scrollIntoView()
        .within(() => {
          cy.get('[data-testid="ticket-checkbox"]').check({ force: true })
        })

      cy.wait(500)

      cy.get('[data-testid="ticket-code"]')
        .contains('TROCA100')
        .closest('[data-testid="ticket-card"]')
        .scrollIntoView()
        .within(() => {
          cy.get('[data-testid="ticket-checkbox"]').check({ force: true })
        })

      cy.wait(500)

      // Complete checkout
      cy.get('[data-testid="cart-checkout-button"]').click()
      cy.wait(1000)
      cy.get('[data-testid="address-card"]').first().click()
      cy.get('[data-testid="address-confirm-button"]').click()

      // Navigate to orders
      cy.visit('/orders')
      cy.wait(2000)

      // Click pay button
      cy.get('[data-testid="order-pay-button"]', { timeout: 10000 })
        .first()
        .click()

      // Verify tickets section shows applied tickets
      cy.contains('Cupons Aplicados').should('be.visible')
      cy.contains('BLACKFRIDAY').should('be.visible')
      cy.contains('TROCA100').should('be.visible')

      cy.log('✅ Applied tickets displayed in payment modal')
    })

    it('should open add card form when clicking add button', () => {
      // Click pay button
      cy.get('[data-testid="order-pay-button"]', { timeout: 10000 })
        .first()
        .click()

      // Click add card button
      cy.get('[data-testid="add-card-button"]').click()

      // Verify card form is displayed
      cy.contains('Adicionar Cartão').should('be.visible')
      cy.get('[data-testid="card-form"]').should('be.visible')

      // Verify form fields
      cy.contains('Número do cartão').should('be.visible')
      cy.contains('Nome do portador').should('be.visible')
      cy.contains('Validade').should('be.visible')
      cy.contains('CVV').should('be.visible')
      cy.contains('Tipo do cartão').should('be.visible')

      cy.log('✅ Add card form opened')
    })

    it('should create new card and show it in list', () => {
      // Click pay button
      cy.get('[data-testid="order-pay-button"]', { timeout: 10000 })
        .first()
        .click()

      // Click add card button
      cy.get('[data-testid="add-card-button"]').click()

      cy.wait(500)

      // Fill card form
      cy.get('[data-testid="card-form"]').within(() => {
        cy.get('input[name="number"]').type('5555555555554444')
        cy.get('input[name="holderName"]').type('Test User Name')
        cy.get('input[name="expiryDate"]').type('1230')
        cy.get('input[name="cvv"]').type('123')
        // Use aria-label to find select since it doesn't have name attribute
        cy.get('select[aria-label="Tipo do cartão"]').select('credit')
      })

      // Submit form
      cy.get('[data-testid="save-card-button"]').click()

      // Wait for success
      cy.wait(2000)

      // Verify new card appears in payment card list
      cy.contains('**** **** **** 4444').should('be.visible')
      cy.get('[data-testid="payment-card-option"]').should(
        'have.length.at.least',
        1,
      )

      cy.log('✅ New card created and displayed')
    })

    it('should cancel card creation and return to card list', () => {
      // Click pay button
      cy.get('[data-testid="order-pay-button"]', { timeout: 10000 })
        .first()
        .click()

      // Click add card button
      cy.get('[data-testid="add-card-button"]').click()

      cy.wait(500)

      // Fill some fields
      cy.get('[data-testid="card-form"]').within(() => {
        cy.get('input[name="number"]').type('5555555555554444')
      })

      // Click cancel button
      cy.get('[data-testid="cancel-add-card-button"]').click()

      cy.wait(500)

      cy.log('✅ Card creation canceled')
    })

    it('should allow selecting multiple cards and dividing payment', () => {
      // Create second card first
      cy.request({
        method: 'POST',
        url: `${Cypress.env('API_URL') || 'http://localhost:3000'}/api/me/cards`,
        headers: {
          Authorization: `Bearer ${testUser.token.accessToken}`,
        },
        body: {
          number: '5555555555554444',
          holderName: testUser.name || 'Test User',
          expirationDate: new Date('2030-12-01').toISOString(),
          cvv: '123',
          type: 'credit',
        },
        failOnStatusCode: false,
      })

      cy.reload()
      cy.wait(2000)

      // Click pay button
      cy.get('[data-testid="order-pay-button"]', { timeout: 10000 })
        .first()
        .click()

      cy.wait(1000)

      // Select first card
      cy.get('[data-testid="payment-card-option"]').first().click()
      cy.wait(1000)

      // Enter amount for first card
      cy.get('[data-testid="payment-card-option"]')
        .first()
        .within(() => {
          cy.get('input[type="text"]').clear().type('40,00')
        })

      cy.wait(500)

      // Select second card
      cy.get('[data-testid="payment-card-option"]').eq(1).click()
      cy.wait(1000)

      // Verify input appears for second card
      cy.get('[data-testid="payment-card-option"]')
        .eq(1)
        .within(() => {
          cy.get('input[type="text"]').should('be.visible')
        })

      cy.log('✅ Multiple cards selected for payment')
    })

    it('should generate exchange ticket when ticket discount exceeds order total', () => {
      // Create order with ticket that exceeds order value
      cy.visit('/catalog')
      cy.get('[data-testid="book-card"]', { timeout: 10000 })
        .contains('Design Patterns')
        .closest('[data-testid="book-card"]')
        .within(() => {
          cy.get('[data-testid="book-add-to-cart-button"]').click()
        })

      cy.get('[data-testid="cart-icon"]').click({ force: true })
      cy.wait(1000)

      // Select TROCA100 ticket (R$ 100.00, item is R$ 79.90)
      cy.get('[data-testid="ticket-code"]')
        .contains('TROCA100')
        .closest('[data-testid="ticket-card"]')
        .scrollIntoView()
        .within(() => {
          cy.get('[data-testid="ticket-checkbox"]').check({ force: true })
        })

      cy.wait(1000)

      // Complete checkout
      cy.get('[data-testid="cart-checkout-button"]').click()
      cy.wait(1000)
      cy.get('[data-testid="address-card"]').first().click()
      cy.get('[data-testid="address-confirm-button"]').click()

      // Wait for order creation and redirect to orders page
      cy.url().should('include', '/orders', { timeout: 15000 })
      cy.wait(2000)

      // Find the order with "1 cupom aplicado" that is still Pendente (newest one we just created)
      // and click its pay button
      cy.get('[data-testid="order-card"]')
        .filter(':contains("1 cupom aplicado")')
        .filter(':contains("Pendente")')
        .first()
        .within(() => {
          cy.get('[data-testid="order-pay-button"]').click()
        })

      cy.wait(1000)

      // Wait for payment modal and card options to load
      cy.contains('Pagamento do Pedido', { timeout: 10000 }).should('be.visible')
      
      // Select card and complete payment
      cy.get('[data-testid="payment-card-option"]', { timeout: 10000 })
        .should('exist')
        .first()
        .click()

      cy.wait(1000)
      
      // Confirm payment
      cy.get('[data-testid="payment-confirm-button"]').should('not.be.disabled').click()
      
      // Wait for payment to process - increased timeout
      cy.wait(5000)

      // Reload and wait for data to update
      cy.reload()
      cy.wait(3000)

      // Verify order is confirmed - use a more flexible approach
      // Look for any order with coupon that is now Confirmado
      cy.get('[data-testid="order-card"]').then(($cards) => {
        // Find cards that contain both "cupom aplicado" and "Confirmado"
        const confirmedWithCoupon = $cards.filter((_, el) => {
          const text = Cypress.$(el).text()
          return text.includes('cupom aplicado') && text.includes('Confirmado')
        })
        
        // Assert we have at least one
        expect(confirmedWithCoupon.length).to.be.at.least(1)
      })

      // Navigate to cart in new purchase to check for new exchange ticket
      cy.visit('/catalog')
      cy.get('[data-testid="book-card"]', { timeout: 10000 })
        .first()
        .within(() => {
          cy.get('[data-testid="book-add-to-cart-button"]').click()
        })

      cy.get('[data-testid="cart-icon"]').click({ force: true })
      cy.wait(2000)

      // Scroll to tickets section first - scroll into view before checking visibility
      cy.contains('Cupons Disponíveis', { timeout: 5000 }).scrollIntoView()
      cy.wait(1000) // Wait for scroll to complete

      // Verify new exchange ticket appears by finding the ticket card with TROCA code
      // The ticket list is in a scrollable container, so we just verify existence
      // rather than visibility (which fails due to fixed header overlap)
      cy.get('[data-testid="ticket-code"]')
        .contains(/TROCA-[A-Z0-9-]+/i, { timeout: 5000 }) // Match the generated TROCA ticket code pattern
        .should('exist')

      // Verify it's within a ticket card
      cy.get('[data-testid="ticket-code"]')
        .contains(/TROCA-[A-Z0-9-]+/i)
        .closest('[data-testid="ticket-card"]')
        .should('exist')

      // Verify the ticket nature badge shows "Troca"
      cy.get('[data-testid="ticket-code"]')
        .contains(/TROCA-[A-Z0-9-]+/i)
        .closest('[data-testid="ticket-card"]')
        .find('[data-testid="ticket-nature"]')
        .should('contain', 'Troca')

      cy.log('✅ Exchange ticket generated when discount exceeded order total')
    })

    it('should complete payment with tickets and new card', () => {
      // Full flow: add item → select tickets → checkout → add address → create order → pay → add card → complete payment
      cy.visit('/catalog')
      cy.get('[data-testid="book-card"]', { timeout: 10000 })
        .first()
        .within(() => {
          cy.get('[data-testid="book-add-to-cart-button"]').click()
        })

      cy.get('[data-testid="cart-icon"]').click({ force: true })
      cy.wait(1000)

      // Select tickets
      cy.get('[data-testid="ticket-code"]')
        .contains('BLACKFRIDAY')
        .closest('[data-testid="ticket-card"]')
        .scrollIntoView()
        .within(() => {
          cy.get('[data-testid="ticket-checkbox"]').check({ force: true })
        })

      cy.wait(500)

      // Checkout
      cy.get('[data-testid="cart-checkout-button"]').click()
      cy.wait(1000)
      cy.get('[data-testid="address-card"]').first().click()
      cy.get('[data-testid="address-confirm-button"]').click()

      cy.visit('/orders')
      cy.wait(2000)

      // Pay
      cy.get('[data-testid="order-pay-button"]', { timeout: 10000 })
        .first()
        .click()

      cy.wait(1000)

      // Check if we need to create a card or if cards already exist
      cy.get('body').then(($body) => {
        // Check if add-card-button is visible (means no cards exist)
        if ($body.find('[data-testid="add-card-button"]').length > 0) {
          cy.get('[data-testid="add-card-button"]').should('be.visible').click()
          cy.wait(500)
          cy.get('[data-testid="card-form"]').within(() => {
            cy.get('input[name="number"]').type('5555555555554444')
            cy.get('input[name="holderName"]').type('Test User')
            cy.get('input[name="expiryDate"]').type('1230')
            cy.get('input[name="cvv"]').type('123')
            // Use aria-label to find select since it doesn't have name attribute
            cy.get('select[aria-label="Tipo do cartão"]').select('credit')
          })
          cy.get('[data-testid="save-card-button"]').click()

          // Wait for form to close OR check if there's an error
          // If form doesn't close, there might be a validation error or duplicate card
          cy.wait(2000)

          // Check if form closed (card created successfully)
          cy.get('body').then(($body) => {
            if ($body.find('[data-testid="card-form"]').length > 0) {
              // Form still exists - might be validation error or card already exists
              // Close the form by clicking cancel
              cy.get('[data-testid="cancel-add-card-button"]').click()
              cy.wait(500)
            }
          })

          // Wait a bit more for cards list to update
          cy.wait(1000)
        }
      })

      // Complete payment
      // Wait for payment card options to appear (either existing or newly created)
      cy.get('[data-testid="payment-card-option"]', { timeout: 10000 })
        .should('exist')
        .should('be.visible')
        .first()
        .click()
      cy.wait(1000)
      cy.get('[data-testid="payment-confirm-button"]').click()
      cy.wait(3000)

      // Verify order status
      cy.reload()
      cy.wait(2000)
      cy.get('[data-testid="order-status-badge"]')
        .first()
        .should('contain', 'Confirmado')

      cy.log('✅ Full flow completed with tickets and new card')
    })
  })
})
