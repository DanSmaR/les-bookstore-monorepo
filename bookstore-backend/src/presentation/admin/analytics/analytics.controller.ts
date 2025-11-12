import { Controller, Get, Query, UseGuards } from '@nestjs/common';

import { UserRole } from '@/domain/user/enums/role.enum';
import { Roles } from '@/infrastructure/auth/decorators/roles.decorator';
import { JwtAuthGuard, RolesGuard } from '@/infrastructure/auth/guards';

import { AnalyticsWebService } from './analytics.webservice';
import { ChartDataDTO } from './dtos/chart/chart-data.dto';
import { OrdersAnalyticsChartDataPointDTO } from './dtos/chart/datapoints/orders-analytics-datapoint.dto';
import { OrderAnalyticsParamsDTO } from './dtos/order-analytics-params.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsWebService: AnalyticsWebService) {}

  /**
   * GET /analytics/orders?startDate=2024-01-01&endDate=2024-01-31&period=daily
   * Returns: Complete analytics data with all metrics (revenue, sales volume, order count, average order value)
   * Use Cases:
   * - "Show me sales volume chart" - use salesVolume property
   * - "Show me revenue trend" - use revenue property
   * - "Show me order count" - use orderCount property
   * - "Show me average order value" - use averageOrderValue property
   * - "Show me everything on a dashboard" - use all properties
   */
  @Get('/orders')
  async getOrderAnalytics(
    @Query() params: OrderAnalyticsParamsDTO,
  ): Promise<ChartDataDTO<OrdersAnalyticsChartDataPointDTO>> {
    return this.analyticsWebService.getOrderAnalyticsChartData(
      params.startDate,
      params.endDate,
      params.period,
    );
  }
}
