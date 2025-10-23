/// <reference types="cypress" />

import { generateValidCPF } from '../../support/cpf-utils'

describe('Sign Up Form', () => {
  before(() => {
    // Reset database before all tests to ensure clean state
    cy.task('resetTestDatabase').then((result: any) => {
      if (!result.success) {
        cy.log('⚠️ Database reset failed:', result.error)
        cy.log('⚠️ Tests may fail due to existing data conflicts')
      } else {
        cy.log('✅ Database reset successfully')
      }
    })
  })

  after(() => {
    // Clean up database after all tests
    cy.task('resetTestDatabase').then((result: any) => {
      if (result.success) {
        cy.log('✅ Database cleaned up after tests')
      } else {
        cy.log('⚠️ Database cleanup failed:', result.error)
      }
    })
  })

  beforeEach(() => {
    cy.visit('/sign-up')
  })

  describe('Page Load and Initial State', () => {
    it('should load the sign-up page successfully', () => {
      cy.contains('Criar Conta').should('be.visible')
      cy.contains('Dados Pessoais').should('be.visible')
      cy.contains('Endereço').should('be.visible')
    })

    it('should have all required form fields', () => {
      // Personal data fields
      cy.get('[data-testid="name-input"]').should('be.visible')
      cy.get('[data-testid="cpf-input"]').should('be.visible')
      cy.get('[data-testid="email-input"]').should('be.visible')
      cy.get('[data-testid="phone-input"]').should('be.visible')
      cy.get('[data-testid="gender-select"]').should('be.visible')
      cy.get('[data-testid="birth-date-input"]').should('be.visible')
      cy.get('[data-testid="password-input"]').should('be.visible')
      cy.get('[data-testid="confirm-password-input"]').should('be.visible')

      // Address fields
      cy.get('[data-testid="zip-code-input"]').should('be.visible')
      cy.get('[data-testid="street-input"]').should('be.visible')
      cy.get('[data-testid="number-input"]').should('be.visible')
      cy.get('[data-testid="complement-input"]').should('be.visible')
      cy.get('[data-testid="neighborhood-input"]').should('be.visible')
      cy.get('[data-testid="city-input"]').should('be.visible')
      cy.get('[data-testid="state-select"]').should('be.visible')
      cy.get('[data-testid="residence-type-select"]').should('be.visible')
      cy.get('[data-testid="address-identifier-input"]').should('be.visible')

      // Submit button
      cy.get('[data-testid="submit-button"]').should('be.visible')
    })

    it('should have login link', () => {
      cy.contains('Já tem uma conta').should('be.visible')
      cy.get('a[href="/sign-in"]').should('be.visible')
    })
  })

  describe('Form Validation - Required Fields', () => {
    it('should show validation errors for empty required fields', () => {
      cy.get('[data-testid="submit-button"]').click()

      // Check for validation messages for required fields
      cy.contains(/nome deve ter pelo menos/i).should('be.visible')
      cy.contains(/email é obrigatório/i).should('be.visible')
      cy.contains(/cpf é obrigatório/i).should('be.visible')
      cy.contains(/telefone é obrigatório/i).should('be.visible')
      cy.contains(/data de nascimento é obrigatória/i).should('be.visible')
      cy.contains(/senha deve ter pelo menos/i).should('be.visible')
      cy.contains(/confirmação de senha é obrigatória/i).should('be.visible')
      cy.contains(/cep é obrigatório/i).should('be.visible')
      cy.contains(/Campo deve ter pelo menos 2 caracteres/i).should(
        'be.visible',
      )
    })

    it('should validate each required field individually', () => {
      // Test name field
      cy.get('[data-testid="name-input"]').type('A')
      cy.contains(/nome deve ter pelo menos/i).should('be.visible')

      // Test email field
      cy.get('[data-testid="email-input"]').type('A')
      cy.contains(/Email deve ter um formato válido/i).should('be.visible')

      // Test CPF field
      cy.get('[data-testid="cpf-input"]').type('1')
      cy.contains(/CPF deve estar no formato 000.000.000-00/i).should(
        'be.visible',
      )

      cy.get('[data-testid="cpf-input"]').clear().type('A')
      cy.contains(/CPF é obrigatório/i).should('be.visible')

      // Test phone field
      cy.get('[data-testid="phone-input"]').type('A')
      cy.contains(/telefone é obrigatório/i).should('be.visible')

      cy.get('[data-testid="phone-input"]').clear().type('1')
      cy.contains(/Telefone deve estar no formato/i).should('be.visible')

      // Test birth date field
      cy.get('[data-testid="birth-date-input"]').type('A')
      cy.contains(/data de nascimento é obrigatória/i).should('be.visible')

      cy.get('[data-testid="birth-date-input"]').clear().type('11')
      cy.contains(/Data deve estar no formato DD\/MM\/AAAA/i).should(
        'be.visible',
      )
      // Test password field
      cy.get('[data-testid="password-input"]').type('A')
      cy.contains(/Senha deve ter pelo menos 8 caracteres/i).should(
        'be.visible',
      )

      cy.get('[data-testid="password-input"]').clear().type('11111111')
      cy.contains(/Senha deve conter pelo menos uma letra maiúscula/i).should(
        'be.visible',
      )

      cy.get('[data-testid="password-input"]').clear().type('1111111A')
      cy.contains(/Senha deve conter pelo menos uma letra minúscula/i).should(
        'be.visible',
      )

      cy.get('[data-testid="password-input"]').clear().type('111111Aa')
      cy.contains(/Senha deve conter pelo menos um caractere especial/i).should(
        'be.visible',
      )

      // Test confirm password field
      cy.get('[data-testid="confirm-password-input"]').type('A').clear()
      cy.contains(/confirmação de senha é obrigatória/i).should('be.visible')
    })
  })

  describe('Form Validation - Format Validation', () => {
    it('should validate CEP format', () => {
      // Invalid format
      cy.get('[data-testid="zip-code-input"]').type('123456')
      cy.get('[data-testid="zip-code-input"]').blur()
      cy.contains(/cep deve estar no formato/i).should('be.visible')

      // Valid format
      cy.get('[data-testid="zip-code-input"]').clear().type('12345-678')
      cy.get('[data-testid="zip-code-input"]').blur()
      cy.contains(/cep deve estar no formato/i).should('not.exist')
    })
  })
  describe('Field Masking and Input Formatting', () => {
    it('should apply CPF mask while typing', () => {
      cy.get('[data-testid="cpf-input"]').type('12345678909')
      cy.get('[data-testid="cpf-input"]').should('have.value', '123.456.789-09')
    })

    it('should apply phone mask while typing', () => {
      cy.get('[data-testid="phone-input"]').type('11999999999')
      cy.get('[data-testid="phone-input"]').should(
        'have.value',
        '(11) 99999-9999',
      )
    })

    it('should apply CEP mask while typing', () => {
      cy.get('[data-testid="zip-code-input"]').type('12345678')
      cy.get('[data-testid="zip-code-input"]').should('have.value', '12345-678')
    })

    it('should apply date mask while typing', () => {
      cy.get('[data-testid="birth-date-input"]').type('01012005')
      cy.get('[data-testid="birth-date-input"]').should(
        'have.value',
        '01/01/2005',
      )
    })
  })

  describe('Select Field Validation', () => {
    it('should validate gender selection', () => {
      cy.get('[data-testid="gender-select"]').select('male')
      cy.get('[data-testid="gender-select"]').should('have.value', 'male')
    })

    it('should validate state selection', () => {
      cy.get('[data-testid="state-select"]').select('SP')
      cy.get('[data-testid="state-select"]').should('have.value', 'SP')
    })

    it('should validate residence type selection', () => {
      cy.get('[data-testid="residence-type-select"]').select('house')
      cy.get('[data-testid="residence-type-select"]').should(
        'have.value',
        'house',
      )
    })
  })

  describe('Successful Form Submission', () => {
    let validUserData: any

    beforeEach(() => {
      // Generate unique user data for each test to avoid conflicts
      const timestamp = Date.now()
      const validCPF = generateValidCPF()
      
      validUserData = {
        name: 'João Silva Santos',
        email: `test.user.${timestamp}@example.com`,
        cpf: validCPF,
        phone: '(11) 99999-9999',
        gender: 'male',
        birthDate: '01/01/1990',
        password: 'Password123@',
        confirmPassword: 'Password123@',
        zipCode: '01234-567',
        street: 'Rua das Flores',
        number: '123',
        complement: 'Apto 45',
        neighborhood: 'Centro',
        city: 'São Paulo',
        state: 'SP',
        residenceType: 'apartment',
        identifier: 'Casa Principal',
      }
    })

    it('should submit form successfully with valid data', () => {
      // Fill all form fields using data-testids
      cy.get('[data-testid="name-input"]').type(validUserData.name)
      cy.get('[data-testid="email-input"]').type(validUserData.email)
      cy.get('[data-testid="cpf-input"]').type(validUserData.cpf)
      cy.get('[data-testid="phone-input"]').type(validUserData.phone)
      cy.get('[data-testid="gender-select"]').select(validUserData.gender)
      cy.get('[data-testid="birth-date-input"]').type(validUserData.birthDate)
      cy.get('[data-testid="password-input"]').type(validUserData.password)
      cy.get('[data-testid="confirm-password-input"]').type(
        validUserData.confirmPassword,
      )

      // Address fields
      cy.get('[data-testid="zip-code-input"]').type(validUserData.zipCode)
      cy.get('[data-testid="street-input"]').type(validUserData.street)
      cy.get('[data-testid="number-input"]').type(validUserData.number)
      cy.get('[data-testid="complement-input"]').type(validUserData.complement)
      cy.get('[data-testid="neighborhood-input"]').type(
        validUserData.neighborhood,
      )
      cy.get('[data-testid="city-input"]').type(validUserData.city)
      cy.get('[data-testid="state-select"]').select(validUserData.state)
      cy.get('[data-testid="residence-type-select"]').select(
        validUserData.residenceType,
      )
      cy.get('[data-testid="address-identifier-input"]').type(
        validUserData.identifier,
      )

      // Submit form
      cy.get('[data-testid="submit-button"]').click()

      // Verify success snackbar/toast message appears
      cy.get('[data-testid="toast-success"]').should('be.visible')
      cy.get('[data-testid="toast-success"]').should(
        'contain',
        'Conta criada com sucesso! Redirecionando...',
      )

      // Alternative: Also check by text content
      cy.contains('Conta criada com sucesso! Redirecionando...').should(
        'be.visible',
      )
    })
  })

  describe('Error Handling', () => {
    it('should handle API errors gracefully', () => {
      // Mock API error response
      cy.intercept('POST', '**/auth/signup', {
        statusCode: 400,
        body: {
          success: false,
          message: 'Email already exists',
        },
      }).as('signupError')

      // Fill form with valid data
      cy.get('[data-testid="name-input"]').type('João Silva')
      cy.get('[data-testid="email-input"]').type('existing@example.com')
      cy.get('[data-testid="cpf-input"]').type('123.456.789-09')
      cy.get('[data-testid="phone-input"]').type('(11) 99999-9999')
      cy.get('[data-testid="birth-date-input"]').type('01/01/1990')
      cy.get('[data-testid="password-input"]').type('Password123@')
      cy.get('[data-testid="confirm-password-input"]').type('Password123@')
      cy.get('[data-testid="zip-code-input"]').type('01234-567')
      cy.get('[data-testid="street-input"]').type('Rua das Flores')
      cy.get('[data-testid="number-input"]').type('123')
      cy.get('[data-testid="neighborhood-input"]').type('Centro')
      cy.get('[data-testid="city-input"]').type('São Paulo')
      cy.get('[data-testid="state-select"]').select('SP')
      cy.get('[data-testid="address-identifier-input"]').type('Casa')

      // Submit form
      cy.get('[data-testid="submit-button"]').click()

      // Verify error toast appears
      cy.get('[data-testid="toast-error"]').should('be.visible')
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      cy.get('[data-testid="gender-select"]').should(
        'have.attr',
        'aria-label',
        'Gênero',
      )
      cy.get('[data-testid="state-select"]').should(
        'have.attr',
        'aria-label',
        'Estado',
      )
      cy.get('[data-testid="submit-button"]').should(
        'have.attr',
        'type',
        'submit',
      )
    })
  })
})
