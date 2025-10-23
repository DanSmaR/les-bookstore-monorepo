import { z } from 'zod'

/**
 * Book validation schemas for form handling and data validation
 */

export const bookAddSchema = z.object({
  title: z
    .string()
    .min(1, 'Título é obrigatório')
    .max(255, 'Título deve ter no máximo 255 caracteres'),

  author: z
    .string()
    .min(1, 'Autor é obrigatório')
    .max(255, 'Autor deve ter no máximo 255 caracteres'),

  isbn: z
    .string()
    .min(1, 'ISBN é obrigatório')
    .refine(
      (value) => {
        const cleanISBN = value.replace(/[^0-9X]/gi, '')
        return cleanISBN.length === 10 || cleanISBN.length === 13
      },
      {
        message: 'ISBN deve ter 10 ou 13 dígitos',
      },
    ),

  description: z
    .string()
    .max(1000, 'Descrição deve ter no máximo 1000 caracteres')
    .optional()
    .or(z.literal('')),

  price: z
    .string()
    .min(1, 'Preço é obrigatório')
    .regex(/^\d+([.,]\d{1,2})?$/, 'Preço deve ter formato válido (ex: 29,90)'),

  stock: z
    .string()
    .min(1, 'Estoque é obrigatório')
    .regex(/^\d+$/, 'Estoque deve ser um número inteiro'),

  publisher: z
    .string()
    .max(100, 'Editora deve ter no máximo 100 caracteres')
    .optional()
    .or(z.literal('')),

  publishedDate: z
    .string()
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, 'Data deve ter formato DD/MM/AAAA')
    .optional()
    .or(z.literal('')),
})

export type BookAddFormData = z.infer<typeof bookAddSchema>
