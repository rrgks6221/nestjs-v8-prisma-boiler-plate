import { faker } from '@faker-js/faker';
import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from '@src/apis/auth/jwt/jwt.strategy';
import { UserEntity } from '@src/apis/users/entities/user.entity';
import { UsersService } from '@src/apis/users/services/users.service';
import { AppConfigService } from '@src/core/app-config/services/app-config.service';
import { MockUserService } from '@test/mock/services.mock';

describe(JwtStrategy.name, () => {
  let jwtStrategy: JwtStrategy;
  let mockUserService: MockUserService;

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
          provide: UsersService,
          useClass: MockUserService,
        },
      ],
    }).compile();

    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
    mockUserService = module.get(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(jwtStrategy);
  });

  describe(JwtStrategy.prototype.validate.name, () => {
    let payload: any;
    let userId: number;

    beforeEach(async () => {
      userId = faker.datatype.number();
      payload = {
        id: userId,
      };
    });

    it('user 가 존재하는 경우', async () => {
      mockUserService.findOneBy.mockResolvedValue(new UserEntity());

      await expect(jwtStrategy.validate(payload)).resolves.toBeInstanceOf(
        UserEntity,
      );
    });

    it('user 가 존재하지 않는 경우', async () => {
      mockUserService.findOneBy.mockResolvedValue(null);

      await expect(jwtStrategy.validate(payload)).rejects.toThrowError(
        UnauthorizedException,
      );
    });
  });
});
