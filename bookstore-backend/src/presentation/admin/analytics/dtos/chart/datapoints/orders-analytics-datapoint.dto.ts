import { ChartDataPointDTO } from '../chart-datapoint.dto';

export class OrdersAnalyticsChartDataPointDTO extends ChartDataPointDTO {
  revenue: number;
  salesVolume: number;
  orderCount: number;
  averageOrderValue: number;

  constructor(
    key: string,
    revenue: number,
    salesVolume: number,
    orderCount: number,
  ) {
    super(key);
    this.revenue = revenue;
    this.salesVolume = salesVolume;
    this.orderCount = orderCount;
    this.averageOrderValue = orderCount > 0 ? revenue / orderCount : 0;
  }
}
