import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtRefreshStrategy } from '@src/apis/auth/jwt/jwt-refresh.strategy';
import { Payload } from '@src/apis/auth/types/auth.type';
import { UserEntity } from '@src/apis/users/entities/user.entity';
import { UsersService } from '@src/apis/users/services/users.service';
import { AppConfigService } from '@src/core/app-config/services/app-config.service';
import { MockUserService } from '@test/mock/services.mock';

describe(JwtRefreshStrategy.name, () => {
  let strategy: JwtRefreshStrategy;
  let mockUserService: MockUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtRefreshStrategy,
        {
          provide: AppConfigService,
          useValue: {
            get: () => 'string',
          },
        },
        {
          provide: UsersService,
          useClass: MockUserService,
        },
      ],
    }).compile();

    strategy = module.get<JwtRefreshStrategy>(JwtRefreshStrategy);
    mockUserService = module.get(UsersService);
  });

  describe(JwtRefreshStrategy.prototype.validate.name, () => {
    let payload: Payload;

    let existUser: UserEntity;

    beforeEach(() => {
      payload = { id: 0 };

      existUser = new UserEntity();
    });

    it('유저가 존재하지 않는 경우', async () => {
      mockUserService.findOneBy.mockResolvedValue(null);

      await expect(strategy.validate(payload)).rejects.toThrowError(
        UnauthorizedException,
      );
    });

    it('유저가 존재하는 경우', async () => {
      payload.id = 1;
      existUser.id = 1;

      mockUserService.findOneBy.mockResolvedValue(existUser);

      await expect(strategy.validate(payload)).resolves.toEqual(existUser);
    });
  });
});
