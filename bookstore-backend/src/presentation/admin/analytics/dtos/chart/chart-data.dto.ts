import { ChartDataPointDTO } from './chart-datapoint.dto';
import { Period } from './period.enum';

export class ChartDataDTO<D extends ChartDataPointDTO> {
  data: D[];
  meta: ChartMetadataDTO;

  constructor(data: D[], meta: ChartMetadataDTO) {
    this.data = data;
    this.meta = meta;
  }
}

export class ChartMetadataDTO {
  total: number;
  count: number;
  orders: number;
  period: Period;
  currency?: string;

  constructor(
    total: number,
    count: number,
    orders: number,
    period: Period,
    currency: string = 'BRL',
  ) {
    this.total = total;
    this.count = count;
    this.orders = orders;
    this.period = period;
    this.currency = currency;
  }
}
