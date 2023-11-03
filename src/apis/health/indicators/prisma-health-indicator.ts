import { Injectable } from '@nestjs/common';
import {
  HealthCheckError,
  HealthIndicator,
  HealthIndicatorResult,
} from '@nestjs/terminus';
import { PrismaService } from '@src/core/prisma/prisma.service';

/**
 * @todo exception filter
 */
@Injectable()
export class PrismaHealthIndicator extends HealthIndicator {
  constructor(private readonly prismaService: PrismaService) {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      await this.prismaService.$queryRaw`SELECT asd`;

      return this.getStatus(key, true);
    } catch (e) {
      throw new HealthCheckError('rdb check failed', e);
    }
  }
}
