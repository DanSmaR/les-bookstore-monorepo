import { ValueTransformer } from 'typeorm';

import { OrderStatus } from '../enums/status.enum';
import { OrderStatusChange } from '../order.entity';

interface OrderStatusChangeData {
  previous: OrderStatus;
  current: OrderStatus;
  at: string | Date;
}

function isOrderStatusChangeData(item: unknown): item is OrderStatusChangeData {
  if (typeof item !== 'object' || item === null) return false;

  const obj = item as Record<string, unknown>;
  return (
    'previous' in obj &&
    'current' in obj &&
    'at' in obj &&
    typeof obj.previous === 'string' &&
    typeof obj.current === 'string' &&
    Object.values(OrderStatus).includes(obj.previous as OrderStatus) &&
    Object.values(OrderStatus).includes(obj.current as OrderStatus)
  );
}

export const OrderStatusChangeTransformer: ValueTransformer = {
  to: (value: OrderStatusChange[]) => value,
  from: (value: unknown): OrderStatusChange[] => {
    if (!value || !Array.isArray(value)) return [];

    return value.filter(isOrderStatusChangeData).map((data) => {
      const change = new OrderStatusChange(data.previous, data.current);
      change.at = typeof data.at === 'string' ? new Date(data.at) : data.at;
      return change;
    });
  },
};
