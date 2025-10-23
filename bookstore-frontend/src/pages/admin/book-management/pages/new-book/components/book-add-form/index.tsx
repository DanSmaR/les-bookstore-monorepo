import type { UseFormReturn } from 'react-hook-form'

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Form,
  FormField,
} from '@/components'
import type { CreateBookDTO } from '@/dtos'
import type { BookAddFormData } from '@/schemas'
import { convertFromMaskedFormat } from '@/utils'

import * as S from './styles'

interface BookAddFormProps {
  form: UseFormReturn<BookAddFormData>
  onSubmit: (data: CreateBookDTO) => void
  loading?: boolean
}

export const BookAddForm = ({
  form,
  onSubmit,
  loading = false,
}: BookAddFormProps) => {
  const handleSubmit = (data: BookAddFormData) => {
    // Convert masked data back to backend format
    const convertedData: CreateBookDTO = {
      title: data.title,
      author: data.author,
      isbn: convertFromMaskedFormat.isbn(data.isbn),
      description: data.description || undefined,
      price: parseFloat(data.price.replace(',', '.')),
      stock: parseInt(data.stock, 10),
      publisher: data.publisher || undefined,
      publishedDate: data.publishedDate
        ? new Date(convertFromMaskedFormat.date(data.publishedDate))
        : undefined,
    }
    onSubmit(convertedData)
  }

  return (
    <S.Container>
      <Card>
        <CardHeader>
          <CardTitle>Informações do Livro</CardTitle>
          <CardDescription>
            Preencha todas as informações necessárias para cadastrar o livro no
            sistema.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form form={form} onSubmit={handleSubmit}>
            <S.FormContent>
              {/* Title - Full width */}
              <S.FullWidthField>
                <FormField
                  form={form}
                  name="title"
                  type="text"
                  label="Título"
                  placeholder="Digite o título do livro"
                  data-testid="book-title-input"
                />
              </S.FullWidthField>

              {/* Author and Publisher - Side by side */}
              <S.FieldRow>
                <FormField
                  form={form}
                  name="author"
                  type="text"
                  label="Autor"
                  placeholder="Digite o nome do autor"
                  data-testid="book-author-input"
                />
                <FormField
                  form={form}
                  name="publisher"
                  type="text"
                  label="Editora"
                  placeholder="Digite o nome da editora"
                  data-testid="book-publisher-input"
                />
              </S.FieldRow>

              {/* ISBN and Published Date - Side by side */}
              <S.FieldRow>
                <FormField
                  form={form}
                  name="isbn"
                  type="isbn"
                  label="ISBN"
                  placeholder="Digite o ISBN (10 ou 13 dígitos)"
                  data-testid="book-isbn-input"
                />
                <FormField
                  form={form}
                  name="publishedDate"
                  type="date"
                  label="Data de Publicação"
                  placeholder="DD/MM/AAAA"
                  data-testid="book-published-date-input"
                />
              </S.FieldRow>

              {/* Price and Stock - Side by side */}
              <S.FieldRow>
                <FormField
                  form={form}
                  name="price"
                  type="text"
                  label="Preço (R$)"
                  placeholder="29,90"
                  data-testid="book-price-input"
                />
                <FormField
                  form={form}
                  name="stock"
                  type="text"
                  label="Estoque"
                  placeholder="Digite a quantidade em estoque"
                  data-testid="book-stock-input"
                />
              </S.FieldRow>

              {/* Description - Full width */}
              <S.FullWidthField>
                <FormField
                  form={form}
                  name="description"
                  type="textarea"
                  label="Descrição"
                  placeholder="Digite uma breve descrição do livro"
                  rows={4}
                  data-testid="book-description-input"
                />
              </S.FullWidthField>

              <S.FormActions>
                <Button type="submit" loading={loading}>
                  Adicionar Livro
                </Button>
              </S.FormActions>
            </S.FormContent>
          </Form>
        </CardContent>
      </Card>
    </S.Container>
  )
}
