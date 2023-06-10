import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from '@src/apis/health/controllers/health.controller';
import { PrismaHealthIndicator } from '@src/apis/health/indicators/prisma-health-indicator';
import { PrismaModule } from '@src/core/prisma/prisma.module';

@Module({
  imports: [TerminusModule, HttpModule, PrismaModule],
  controllers: [HealthController],
  providers: [PrismaHealthIndicator],
})
export class HealthModule {}
