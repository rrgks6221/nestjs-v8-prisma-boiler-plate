import { HealthCheckService } from '@nestjs/terminus';
import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from '@src/apis/health/controllers/health.controller';
import { PrismaHealthIndicator } from '@src/apis/health/indicators/prisma-health-indicator';
import { MockPrismaHealthIndicator } from '@test/mock/indicator.mock';
import { MockHealthCheckService } from '@test/mock/services.mock';

describe(HealthController.name, () => {
  let controller: HealthController;
  let mockHealthCheckService: MockHealthCheckService;
  let mockPrismaHealthIndicator: MockPrismaHealthIndicator;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthController,
        {
          provide: HealthCheckService,
          useClass: MockHealthCheckService,
        },
        {
          provide: PrismaHealthIndicator,
          useClass: MockPrismaHealthIndicator,
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
    mockHealthCheckService = module.get(HealthCheckService);
    mockPrismaHealthIndicator = module.get(PrismaHealthIndicator);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe(HealthController.prototype.check.name, () => {
    it('success', () => {
      mockPrismaHealthIndicator.isHealthy.mockReturnValue({
        key: 'rdb',
        isHealthy: true,
      });
      mockHealthCheckService.check.mockResolvedValue([
        mockPrismaHealthIndicator.isHealthy('rdb'),
      ]);

      expect(controller.check()).resolves.toStrictEqual([
        {
          key: 'rdb',
          isHealthy: true,
        },
      ]);
    });
  });
});
