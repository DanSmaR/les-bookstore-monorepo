import type { AxiosError } from 'axios'

import type { ApiErrorResponseDTO } from '@/dtos'

/**
 * Type for Axios error with typed backend response
 */
export type ApiAxiosError = AxiosError<ApiErrorResponseDTO>

/**
 * Type guard to check if error is an Axios error with backend response
 */
export const isApiAxiosError = (error: unknown): error is ApiAxiosError => {
  if (typeof error !== 'object' || error === null) return false
  if (!('response' in error)) return false

  const axiosError = error as AxiosError
  if (!axiosError.response?.data) return false

  const data = axiosError.response.data as Record<string, unknown>
  return (
    typeof data.message === 'string' &&
    typeof data.error === 'string' &&
    typeof data.statusCode === 'number'
  )
}
