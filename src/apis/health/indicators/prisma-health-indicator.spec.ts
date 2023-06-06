import { HealthCheckError } from '@nestjs/terminus';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaHealthIndicator } from '@src/apis/health/indicators/prisma-health-indicator';
import { PrismaService } from '@src/core/prisma/prisma.service';
import { mockPrismaService } from '@test/mock/prisma-service.mock';

describe('PrismaHealthIndicator', () => {
  let indicator: PrismaHealthIndicator;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaHealthIndicator,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    indicator = module.get<PrismaHealthIndicator>(PrismaHealthIndicator);
  });

  it('should be defined', () => {
    expect(indicator).toBeDefined();
  });

  describe('isHealthy', () => {
    let key: string;

    beforeEach(() => {
      key = 'rdb';
    });

    it('success', () => {
      mockPrismaService.$queryRaw.mockResolvedValue('1');

      expect(indicator.isHealthy(key)).resolves.toStrictEqual({
        rdb: {
          status: 'up',
        },
      });
    });

    it('fail', () => {
      mockPrismaService.$queryRaw.mockRejectedValue('reject');

      expect(indicator.isHealthy(key)).rejects.toThrowError(HealthCheckError);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
