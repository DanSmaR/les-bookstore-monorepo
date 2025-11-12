import { Injectable } from '@nestjs/common';

import { OrdersService } from '@/application/orders/services/orders.service';
import { OrderStatus } from '@/domain/order/enums/status.enum';

import { ChartDataDTO, ChartMetadataDTO } from './dtos/chart/chart-data.dto';
import { OrdersAnalyticsChartDataPointDTO } from './dtos/chart/datapoints/orders-analytics-datapoint.dto';
import { Period } from './dtos/chart/period.enum';

@Injectable()
export class AnalyticsWebService {
  constructor(private readonly ordersService: OrdersService) {}

  public async getOrderAnalyticsChartData(
    startDate: Date,
    endDate: Date,
    period: Period,
  ): Promise<ChartDataDTO<OrdersAnalyticsChartDataPointDTO>> {
    const orders = await this.ordersService.findAllInPeriod(
      'orderDate',
      startDate,
      endDate,
      { status: OrderStatus.DELIVERED },
    );

    const aggregatedData = new Map<
      string,
      { revenue: number; salesVolume: number; orderCount: number }
    >();

    orders.forEach((order) => {
      const key = this.getKeyForDate(period, order.orderDate);
      const current = aggregatedData.get(key) || {
        revenue: 0,
        salesVolume: 0,
        orderCount: 0,
      };

      current.revenue += order.getFinalPrice();
      current.salesVolume += order.getTotalItems();
      current.orderCount += 1;

      aggregatedData.set(key, current);
    });

    return this.buildOrdersAnalyticsChartResponse(aggregatedData, period);
  }

  private buildOrdersAnalyticsChartResponse(
    aggregatedData: Map<
      string,
      { revenue: number; salesVolume: number; orderCount: number }
    >,
    period: Period,
  ): ChartDataDTO<OrdersAnalyticsChartDataPointDTO> {
    const chartDataPoints: OrdersAnalyticsChartDataPointDTO[] = Array.from(
      aggregatedData.entries(),
    )
      .map(
        ([key, data]) =>
          new OrdersAnalyticsChartDataPointDTO(
            key,
            data.revenue,
            data.salesVolume,
            data.orderCount,
          ),
      )
      .sort((a, b) => a.key.localeCompare(b.key));

    // Calculate total revenue for metadata
    const totalRevenue = chartDataPoints.reduce(
      (sum, point) => sum + point.revenue,
      0,
    );

    const totalCount = chartDataPoints.reduce(
      (sum, point) => sum + point.salesVolume,
      0,
    );

    const orders = chartDataPoints.reduce(
      (sum, point) => sum + point.orderCount,
      0,
    );

    const metadata = new ChartMetadataDTO(
      totalRevenue,
      totalCount,
      orders,
      period,
    );
    return new ChartDataDTO<OrdersAnalyticsChartDataPointDTO>(
      chartDataPoints,
      metadata,
    );
  }

  private getKeyForDate(period: Period, date: Date): string {
    switch (period) {
      case Period.DAILY:
        return date.toISOString().split('T')[0]; // YYYY-MM-DD
      case Period.MONTHLY:
        return `${date.getFullYear()}-${(date.getMonth() + 1)
          .toString()
          .padStart(2, '0')}`; // YYYY-MM
      case Period.YEARLY:
        return date.getFullYear().toString(); // YYYY
    }
  }
}
