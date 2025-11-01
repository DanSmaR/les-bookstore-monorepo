import type { OrderDTO } from '@/dtos'

/**
 * Calculate the total price of an order from subtotal and discount
 */
export const calculateOrderTotal = (order: OrderDTO): number => {
  const subtotal =
    typeof order.subtotal === 'string'
      ? parseFloat(order.subtotal)
      : order.subtotal || 0
  const discount =
    typeof order.discount === 'string'
      ? parseFloat(order.discount)
      : order.discount || 0

  return subtotal - discount
}

/**
 * Format order total as currency
 */
export const formatOrderTotal = (
  order: OrderDTO,
  formatCurrency: (value: number) => string,
): string => {
  return formatCurrency(calculateOrderTotal(order))
}
