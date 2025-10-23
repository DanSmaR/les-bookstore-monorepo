import { z } from 'zod'

/**
 * Card validation schemas
 */

// Card number validation
export const creditCardNumber = z
  .string()
  .min(1, 'Número do cartão é obrigatório')
  .regex(
    /^\d{4}\s\d{4}\s\d{4}\s\d{4}$/,
    'Número do cartão deve estar no formato 0000 0000 0000 0000',
  )
  .refine((cardNumber) => {
    // Remove spaces for validation
    const cleanNumber = cardNumber.replace(/\s/g, '')

    // Luhn algorithm validation
    let sum = 0
    let isEven = false

    for (let i = cleanNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cleanNumber[i])

      if (isEven) {
        digit *= 2
        if (digit > 9) {
          digit = digit
            .toString()
            .split('')
            .map(Number)
            .reduce((a, b) => a + b, 0)
        }
      }

      sum += digit
      isEven = !isEven
    }

    return sum % 10 === 0
  }, 'Número do cartão inválido')

// Cardholder name validation
export const cardHolderName = z
  .string()
  .min(1, 'Nome do portador é obrigatório')
  .min(2, 'Nome deve ter pelo menos 2 caracteres')
  .max(100, 'Nome deve ter no máximo 100 caracteres')
  .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras e espaços')

// Card expiry date validation
export const cardExpiryDate = z
  .string()
  .min(1, 'Data de validade é obrigatória')
  .regex(
    /^(0[1-9]|1[0-2])\/\d{2}$/,
    'Data de validade deve estar no formato MM/AA',
  )
  .refine((expiry) => {
    const [month, year] = expiry.split('/')
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear() % 100
    const currentMonth = currentDate.getMonth() + 1

    const expiryYear = parseInt(year)
    const expiryMonth = parseInt(month)

    // Check if card is not expired
    if (expiryYear > currentYear) return true
    if (expiryYear === currentYear && expiryMonth >= currentMonth) return true

    return false
  }, 'Cartão expirado')

// CVV validation
export const cardCVV = z
  .string()
  .min(1, 'CVV é obrigatório')
  .regex(/^\d{3,4}$/, 'CVV deve ter 3 ou 4 dígitos')

// Card type validation
export const cardType = z.enum(['credit', 'debit'], {
  message: 'Tipo do cartão deve ser crédito ou débito',
})

// Complete card form schema
export const cardFormSchema = z.object({
  number: creditCardNumber,
  holderName: cardHolderName,
  expiryDate: cardExpiryDate,
  cvv: cardCVV,
  type: cardType,
})

// Infer TypeScript type from schema
export type CardFormData = z.infer<typeof cardFormSchema>

// Card edit schema (for updating existing cards)
export const cardEditSchema = z.object({
  holderName: cardHolderName,
  expiryDate: cardExpiryDate,
})
