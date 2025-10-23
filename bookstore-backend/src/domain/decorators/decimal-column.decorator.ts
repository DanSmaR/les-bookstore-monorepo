import { Column, ColumnOptions } from 'typeorm';

interface DecimalColumnOptions extends Omit<ColumnOptions, 'transformer'> {
  precision?: number;
  scale?: number;
}

export function DecimalColumn(options: DecimalColumnOptions = {}) {
  const { precision = 10, scale = 2, ...otherOptions } = options;

  return Column('decimal', {
    precision,
    scale,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
    ...otherOptions,
  });
}
