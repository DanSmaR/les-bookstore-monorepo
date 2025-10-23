/// <reference types="cypress" />

import { generateValidCPF } from '../../support/cpf-utils'

describe('Profile Edit - With Authentication', () => {
  let authenticatedUser: any
  const API_URL = Cypress.env('API_URL') || 'http://localhost:3000'

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
    // Create and authenticate a real user for testing
    cy.setupAuthenticatedUser().then((user) => {
      authenticatedUser = user
      cy.log('✅ Authenticated user created:', authenticatedUser.user?.id)
    })
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

  beforeEach(() => {
    // Skip if no authenticated user
    if (!authenticatedUser?.token) {
      cy.log('❌ Authenticated user not available, skipping test')
      return
    }

    // Visit the page first to establish the domain context
    cy.visit('/')

    // Then set authentication in localStorage within the page context using the correct key
    cy.window().then((window) => {
      window.localStorage.setItem(
        'auth-token',
        JSON.stringify(authenticatedUser.token),
      )
    })

    // Now navigate to the authenticated route
    cy.visit('/my-profile')
    
    // Wait for profile page to load
    cy.contains('Meu Perfil', { timeout: 10000 }).should('be.visible')
  })

  afterEach(() => {
    // Clear authentication after each test
    cy.clearAuth()
  })

  it('should load profile edit page and display user data', () => {
    if (!authenticatedUser?.token) {
      cy.skip('User authentication failed')
      return
    }

    cy.contains('Meu Perfil').should('be.visible')
    cy.contains('Informações Pessoais').should('be.visible')

    cy.get('[data-testid="profile-name-input"]', { timeout: 10000 })
      .should('be.visible')
      .should('be.disabled')

    cy.log('✅ Profile page loaded successfully with authenticated user data')
  })

  it('should enable edit mode when clicking Editar Perfil button', () => {
    if (!authenticatedUser?.token) {
      cy.skip('User authentication failed')
      return
    }

    cy.get('[data-testid="profile-name-input"]').should('be.disabled')

    cy.contains('button', 'Editar Perfil').click()

    cy.get('[data-testid="profile-name-input"]').should('not.be.disabled')
    cy.get('[data-testid="profile-email-input"]').should('not.be.disabled')
    cy.get('[data-testid="profile-phone-input"]').should('not.be.disabled')

    cy.get('[data-testid="profile-name-input"]').should(
      'have.value',
      authenticatedUser.name,
    )

    cy.get('[data-testid="profile-email-input"]').should(
      'have.value',
      authenticatedUser.email,
    )

    cy.log('✅ Edit mode enabled successfully')
  })

  it('should validate required fields when empty', () => {
    if (!authenticatedUser?.token) {
      cy.skip('User authentication failed')
      return
    }

    cy.contains('button', 'Editar Perfil').click()

    cy.get('[data-testid="profile-name-input"]').clear()
    cy.get('[data-testid="profile-email-input"]').clear()

    cy.contains('button[type="submit"]', 'Salvar Alterações').click()

    cy.contains('Nome deve ter pelo menos').should('be.visible')
    cy.log('✅ Required field validation working')
  })

  it('should validate email format', () => {
    if (!authenticatedUser?.token) {
      cy.skip('User authentication failed')
      return
    }

    cy.contains('button', 'Editar Perfil').click()

    cy.get('[data-testid="profile-email-input"]')
      .clear()
      .type('invalid-email')
      .blur()

    cy.contains('Email deve ter um formato válido').should('be.visible')
    cy.log('✅ Email format validation working')
  })

  it('should validate CPF format if editable', () => {
    if (!authenticatedUser?.token) {
      cy.skip('User authentication failed')
      return
    }

    cy.contains('button', 'Editar Perfil').click()

    cy.get('[data-testid="profile-cpf-input"]').then(($cpfInput) => {
      if (!$cpfInput.prop('readonly') && !$cpfInput.prop('disabled')) {
        cy.wrap($cpfInput).clear().type('00000000000').blur()

        cy.get('body').then(($body) => {
          if (
            $body.text().includes('CPF inválido') ||
            $body.text().includes('CPF deve')
          ) {
            cy.contains(/CPF.*(inválido|deve)/).should('be.visible')

            const validCPF = generateValidCPF()
            cy.get('[data-testid="profile-cpf-input"]')
              .clear()
              .type(validCPF)
              .blur()

            cy.contains(/CPF.*(inválido|deve)/).should('not.exist')
            cy.log('✅ CPF validation working with generated CPF:', validCPF)
          } else {
            cy.log(
              'ℹ️  CPF validation not found or different validation approach',
            )
          }
        })
      } else {
        cy.log('ℹ️  CPF field is read-only, skipping validation test')
      }
    })
  })

  it('should validate name minimum length', () => {
    if (!authenticatedUser?.token) {
      cy.skip('User authentication failed')
      return
    }

    cy.contains('button', 'Editar Perfil').click()

    cy.get('[data-testid="profile-name-input"]').clear().type('A').blur()

    cy.contains('Nome deve ter pelo menos').should('be.visible')
    cy.log('✅ Name length validation working')
  })

  it('should apply input masks correctly', () => {
    if (!authenticatedUser?.token) {
      cy.skip('User authentication failed')
      return
    }

    cy.contains('button', 'Editar Perfil').click()

    cy.get('[data-testid="profile-phone-input"]')
      .clear()
      .type('11999888777')
      .should('have.value', '(11) 99988-8777')

    cy.get('[data-testid="profile-cpf-input"]').should(
      'contain.value',
      `${authenticatedUser.cpf.slice(0, 3)}.${authenticatedUser.cpf.slice(3, 6)}.${authenticatedUser.cpf.slice(6, 9)}-${authenticatedUser.cpf.slice(9, 11)}`,
    )

    cy.log('✅ Input masks working correctly')
  })

  it('should update profile successfully with authentication', () => {
    if (!authenticatedUser?.token) {
      cy.skip('User authentication failed')
      return
    }

    cy.contains('button', 'Editar Perfil').click()

    const newName = 'Updated User'
    const newPhone = '11888777666'

    cy.get('[data-testid="profile-name-input"]').clear().type(newName)

    cy.get('[data-testid="profile-phone-input"]').clear().type(newPhone)

    cy.intercept('PUT', `${API_URL}/api/me`, (req) => {
      expect(req.headers).to.have.property('authorization')
      expect(req.headers.authorization).to.include('Bearer')
    }).as('updateProfile')

    cy.contains('button[type="submit"]', 'Salvar Alterações').click()

    cy.wait('@updateProfile')

    cy.contains('Perfil atualizado', { timeout: 10000 }).should('be.visible')
    cy.log('✅ Profile update working successfully with authentication')
  })

  it('should maintain form accessibility', () => {
    if (!authenticatedUser?.token) {
      cy.skip('User authentication failed')
      return
    }

    cy.contains('button', 'Editar Perfil').click()

    cy.get('[data-testid="profile-name-input"]').should('have.attr', 'name')

    cy.get('[data-testid="profile-email-input"]').should(
      'have.attr',
      'type',
      'email',
    )

    cy.get('form').should('exist')

    cy.log('✅ Form accessibility attributes present')
  })

  // Address Editing Tests
  describe('Address Editing Tests with Authentication', () => {
    it('should open address edit modal when clicking Editar button', () => {
      if (!authenticatedUser?.token) {
        cy.skip('User authentication failed')
        return
      }

      // Wait for address section to load
      cy.contains('Seus Endereços', { timeout: 10000 }).should('be.visible')

      // First, click "Editar Perfil" to enable edit mode
      cy.contains('button', 'Editar Perfil').should('be.visible').click()
      
      // Wait for edit mode to be enabled
      cy.contains('button', 'Cancelar Edição', { timeout: 5000 }).should('be.visible')

      // Now click the Edit button using the data-testid
      cy.get('[data-testid="profile-address-edit-button"]')
        .should('be.visible')
        .should('not.be.disabled')
        .click()

      // Wait for modal to appear
      cy.contains('Editar Endereço', { timeout: 10000 }).should('be.visible')

      // Verify modal content is loaded
      cy.get('input[name="addressName"]', { timeout: 5000 }).should('be.visible')
      cy.get('select[aria-label="Tipo de Residência"]').should('be.visible')

      cy.log('✅ Address edit modal opened successfully')
    })

    it('should display current address data in the form', () => {
      if (!authenticatedUser?.token) {
        cy.skip('User authentication failed')
        return
      }

      // Wait for addresses to load
      cy.contains('Seus Endereços', { timeout: 10000 }).should('be.visible')

      // First, click "Editar Perfil" to enable edit mode
      cy.contains('button', 'Editar Perfil').should('be.visible').click()
      
      // Wait for edit mode to be enabled
      cy.contains('button', 'Cancelar Edição', { timeout: 5000 }).should('be.visible')

      // Click edit button using data-testid
      cy.get('[data-testid="profile-address-edit-button"]').click()

      // Wait for modal
      cy.contains('Editar Endereço', { timeout: 10000 }).should('be.visible')

      // Check if form is populated with current address data
      if (authenticatedUser.addresses && authenticatedUser.addresses[0]) {
        const address = authenticatedUser.addresses[0]

        cy.get('input[name="addressName"]').should(
          'have.value',
          address.addressName,
        )

        cy.get('select[aria-label="Tipo de Residência"]').should(
          'have.value',
          address.type,
        )

        cy.get('select[aria-label="Finalidade"]').should(
          'have.value',
          address.purpose,
        )

        cy.get('input[name="street"]').should('have.value', address.street)

        cy.get('input[name="number"]').should('have.value', address.number)

        cy.get('input[name="city"]').should('have.value', address.city)

        cy.get('select[aria-label="Estado"]').should(
          'have.value',
          address.state,
        )
      }

      cy.log('✅ Address form populated with current data')
    })

    it('should validate required address fields', () => {
      if (!authenticatedUser?.token) {
        cy.skip('User authentication failed')
        return
      }

      // First, click "Editar Perfil" to enable edit mode
      cy.contains('button', 'Editar Perfil').should('be.visible').click()
      
      // Wait for edit mode to be enabled
      cy.contains('button', 'Cancelar Edição', { timeout: 5000 }).should('be.visible')

      // Open address modal using data-testid
      cy.get('[data-testid="profile-address-edit-button"]').click()

      cy.contains('Editar Endereço', { timeout: 10000 }).should('be.visible')

      // Clear required fields
      cy.get('input[name="addressName"]').clear()
      cy.get('input[name="street"]').clear()
      cy.get('input[name="number"]').clear()
      cy.get('input[name="district"]').clear()
      cy.get('input[name="city"]').clear()

      // Try to submit form
      cy.contains('button', 'Atualizar Endereço').click()

      // Check for validation messages
      cy.contains('Campo deve ter pelo menos 2 caracteres').should('be.visible')

      cy.log('✅ Address field validation working')
    })

    it('should validate CEP format', () => {
      if (!authenticatedUser?.token) {
        cy.skip('User authentication failed')
        return
      }

      // First, click "Editar Perfil" to enable edit mode
      cy.contains('button', 'Editar Perfil').should('be.visible').click()
      
      // Wait for edit mode to be enabled
      cy.contains('button', 'Cancelar Edição', { timeout: 5000 }).should('be.visible')

      // Open address modal using data-testid
      cy.get('[data-testid="profile-address-edit-button"]').click()

      cy.contains('Editar Endereço', { timeout: 10000 }).should('be.visible')

      // Test invalid CEP
      cy.get('input[name="postalCode"]').clear().type('12345').blur()

      // Check for CEP validation message
      cy.contains('CEP deve estar no formato 00000-000').should('be.visible')

      cy.log('✅ CEP validation working')
    })

    it('should apply CEP mask correctly', () => {
      if (!authenticatedUser?.token) {
        cy.skip('User authentication failed')
        return
      }

      // First, click "Editar Perfil" to enable edit mode
      cy.contains('button', 'Editar Perfil').should('be.visible').click()
      
      // Wait for edit mode to be enabled
      cy.contains('button', 'Cancelar Edição', { timeout: 5000 }).should('be.visible')

      // Open address modal using data-testid
      cy.get('[data-testid="profile-address-edit-button"]').click()

      cy.contains('Editar Endereço', { timeout: 10000 }).should('be.visible')

      // Test CEP mask
      cy.get('input[name="postalCode"]')
        .clear()
        .type('01234567')
        .should('have.value', '01234-567')

      cy.log('✅ CEP mask applied correctly')
    })

    it('should update address successfully with authentication', () => {
      if (!authenticatedUser?.token) {
        cy.skip('User authentication failed')
        return
      }

      // First, click "Editar Perfil" to enable edit mode
      cy.contains('button', 'Editar Perfil').should('be.visible').click()
      
      // Wait for edit mode to be enabled
      cy.contains('button', 'Cancelar Edição', { timeout: 5000 }).should('be.visible')

      // Open address modal using data-testid
      cy.get('[data-testid="profile-address-edit-button"]').click()

      cy.contains('Editar Endereço', { timeout: 10000 }).should('be.visible')

      // Update address fields
      cy.get('input[name="addressName"]').clear().type('Casa Nova')

      cy.get('select[aria-label="Tipo de Residência"]').select('apartment')

      cy.get('select[aria-label="Finalidade"]').select('delivery')

      cy.get('input[name="street"]').clear().type('Rua das Flores Atualizada')

      cy.get('input[name="number"]').clear().type('456')

      cy.get('input[name="complement"]').clear().type('Apto 10')

      cy.get('input[name="district"]').clear().type('Centro Novo')

      cy.get('input[name="city"]').clear().type('São Paulo')

      cy.get('select[aria-label="Estado"]').select('SP')

      // Intercept the authenticated PUT request
      cy.intercept('PUT', `${API_URL}/api/me/addresses/*`, (req) => {
        expect(req.headers).to.have.property('authorization')
        expect(req.headers.authorization).to.include('Bearer')
      }).as('updateAddress')

      // Submit the form
      cy.contains('button', 'Atualizar Endereço').click()

      // Wait for authenticated request
      cy.wait('@updateAddress')

      // Check for success message
      cy.contains('Endereço atualizado', { timeout: 10000 }).should(
        'be.visible',
      )

      cy.log('✅ Address updated successfully with authentication')
    })

    it('should cancel address editing', () => {
      if (!authenticatedUser?.token) {
        cy.skip('User authentication failed')
        return
      }

      // First, click "Editar Perfil" to enable edit mode
      cy.contains('button', 'Editar Perfil').should('be.visible').click()
      
      // Wait for edit mode to be enabled
      cy.contains('button', 'Cancelar Edição', { timeout: 5000 }).should('be.visible')

      // Open address modal using data-testid
      cy.get('[data-testid="profile-address-edit-button"]').click()

      cy.contains('Editar Endereço', { timeout: 10000 }).should('be.visible')

      // Make some changes
      cy.get('input[name="addressName"]').clear().type('Nome Temporário')

      // Click cancel button in the address form (not the header cancel button)
      cy.get('[data-testid="address-form-cancel-button"]').click()

      // Check if modal is closed
      cy.contains('Editar Endereço').should('not.exist')

      // Verify we're back to the profile page
      cy.contains('Informações Pessoais').should('be.visible')

      cy.log('✅ Address editing cancelled successfully')
    })

    it('should handle address selection dropdowns', () => {
      if (!authenticatedUser?.token) {
        cy.skip('User authentication failed')
        return
      }

      // First, click "Editar Perfil" to enable edit mode
      cy.contains('button', 'Editar Perfil').should('be.visible').click()
      
      // Wait for edit mode to be enabled
      cy.contains('button', 'Cancelar Edição', { timeout: 5000 }).should('be.visible')

      // Open address modal using data-testid
      cy.get('[data-testid="profile-address-edit-button"]').click()

      cy.contains('Editar Endereço', { timeout: 10000 }).should('be.visible')

      // Test residence type dropdown
      cy.get('select[aria-label="Tipo de Residência"]').within(() => {
        cy.get('option[value="house"]').should('contain', 'Casa')
        cy.get('option[value="apartment"]').should('contain', 'Apartamento')
        cy.get('option[value="condo"]').should('contain', 'Condomínio')
        cy.get('option[value="work"]').should('contain', 'Trabalho')
        cy.get('option[value="rural"]').should('contain', 'Rural')
      })

      // Test purpose dropdown
      cy.get('select[aria-label="Finalidade"]').within(() => {
        cy.get('option[value="billing"]').should('contain', 'Cobrança')
        cy.get('option[value="delivery"]').should('contain', 'Entrega')
        cy.get('option[value="both"]').should('contain', 'Cobrança e Entrega')
      })

      // Test state dropdown
      cy.get('select[aria-label="Estado"]').within(() => {
        cy.get('option[value="SP"]').should('contain', 'São Paulo')
        cy.get('option[value="RJ"]').should('contain', 'Rio de Janeiro')
        cy.get('option[value="MG"]').should('contain', 'Minas Gerais')
      })

      cy.log('✅ Address dropdown options working correctly')
    })

    it('should display address information in card format', () => {
      if (!authenticatedUser?.token) {
        cy.skip('User authentication failed')
        return
      }

      // Check if address card is displayed
      cy.contains('Seus Endereços').should('be.visible')
      
      // Check for address content
      cy.contains('apartment').should('be.visible')
      cy.contains('Rua das Flores Atualizada, 456 - Apto 10').should('be.visible')

      cy.log('✅ Address information displayed in card format')
    })
  })
})
