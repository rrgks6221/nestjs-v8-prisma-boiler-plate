import { Controller, Get, UseFilters } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { HealthCheckErrorFilter } from '@src/apis/health/filter/health-check-error.filter';
import { PrismaHealthIndicator } from '@src/apis/health/indicators/prisma-health-indicator';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly healthCheckService: HealthCheckService,
    private readonly prismaHealthIndicator: PrismaHealthIndicator,
  ) {}

  @Get()
  @UseFilters(HealthCheckErrorFilter)
  @HealthCheck()
  check() {
    return this.healthCheckService.check([
      () => this.prismaHealthIndicator.isHealthy('rdb'),
    ]);
  }
}
