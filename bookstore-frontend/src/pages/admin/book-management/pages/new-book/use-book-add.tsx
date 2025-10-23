import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'

import type { CreateBookDTO } from '@/dtos'
import { useBook } from '@/hooks'
import { useToast } from '@/providers/toast/use-toast'
import { ROUTES } from '@/routes'
import { type BookAddFormData, bookAddSchema } from '@/schemas'

/**
 * Book Add Hook
 * Manages book add page state and logic
 */
export const useBookAdd = () => {
  const navigate = useNavigate()
  const { createBook, isLoading } = useBook()
  const { showError, showSuccess } = useToast()

  const form = useForm<BookAddFormData>({
    resolver: zodResolver(bookAddSchema),
    mode: 'onChange',
    defaultValues: {
      title: '',
      author: '',
      isbn: '',
      description: '',
      price: '',
      stock: '',
      publisher: '',
      publishedDate: '',
    },
  })

  const handleSubmit = async (data: CreateBookDTO) => {
    try {
      await createBook(data)
      showSuccess('Livro adicionado com sucesso!')
      navigate(ROUTES.ADMIN_BOOKS)
    } catch {
      showError('Erro ao adicionar livro. Tente novamente.')
    }
  }

  return {
    form,
    handleSubmit,
    isLoading,
  }
}
