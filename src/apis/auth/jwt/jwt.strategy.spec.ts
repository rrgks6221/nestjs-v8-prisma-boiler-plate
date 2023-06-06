import { faker } from '@faker-js/faker';
import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from '@src/apis/auth/jwt/jwt.strategy';
import { UserEntity } from '@src/apis/users/entities/user.entity';
import { AppConfigService } from '@src/core/app-config/services/app-config.service';
import { PrismaService } from '@src/core/prisma/prisma.service';
import { mockPrismaService } from '@test/mock/prisma-service.mock';

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: AppConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              return 'secret';
            }),
          },
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
  });

  it('should be defined', () => {
    expect(jwtStrategy);
  });

  describe('validate', () => {
    let payload: any;
    let userId: number;

    beforeEach(async () => {
      userId = faker.datatype.number();
      payload = {
        id: userId,
      };
    });

    it('user 가 존재하는 경우', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(new UserEntity());

      await expect(jwtStrategy.validate(payload)).resolves.toBeInstanceOf(
        UserEntity,
      );
    });

    it('user 가 존재하지 않는 경우', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(jwtStrategy.validate(payload)).rejects.toThrowError(
        UnauthorizedException,
      );
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
