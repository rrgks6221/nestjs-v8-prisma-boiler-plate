import {
  CACHE_MANAGER,
  ForbiddenException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { SignInDtoRequestBody } from '@src/apis/auth/dtos/sign-in-request-body.dto';
import { SignUpRequestBodyDto } from '@src/apis/auth/dtos/sign-up-request-body.dto';
import { AuthHelper } from '@src/apis/auth/helpers/auth.helper';
import { AuthService } from '@src/apis/auth/services/auth.service';
import { UserEntity } from '@src/apis/users/entities/user.entity';
import { UsersService } from '@src/apis/users/services/users.service';
import { BCRYPT_TOKEN } from '@src/constants/token.constant';
import { AppConfigService } from '@src/core/app-config/services/app-config.service';
import { PrismaService } from '@src/core/prisma/prisma.service';
import { MockAUthHelper } from '@test/mock/helper.mock';
import { MockCacheManager, MockEncryption } from '@test/mock/libs.mock';
import { mockPrismaService } from '@test/mock/prisma-service.mock';
import {
  MockAppConfigService,
  MockAuthService,
  MockJwtService,
  MockUserService,
} from '@test/mock/services.mock';

describe(AuthService.name, () => {
  let service: AuthService;
  let mockUsersService: MockUserService;
  let mockJwtService: MockJwtService;
  let mockAuthHelper: MockAuthService;
  let mockEncryption: MockEncryption;
  let mockCacheManager: MockCacheManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: AppConfigService,
          useClass: MockAppConfigService,
        },
        {
          provide: UsersService,
          useClass: MockUserService,
        },
        {
          provide: JwtService,
          useClass: MockJwtService,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: AuthHelper,
          useClass: MockAUthHelper,
        },
        {
          provide: BCRYPT_TOKEN,
          useClass: MockEncryption,
        },
        {
          provide: CACHE_MANAGER,
          useClass: MockCacheManager,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    mockUsersService = module.get(UsersService);
    mockJwtService = module.get(JwtService);
    mockAuthHelper = module.get(AuthService);
    mockEncryption = module.get(BCRYPT_TOKEN);
    mockCacheManager = module.get(CACHE_MANAGER);
    mockJwtService = module.get(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe(AuthService.prototype.signUp.name, () => {
    let signUpRequestBodyDto: SignUpRequestBodyDto;

    let newUser: UserEntity;

    beforeEach(() => {
      signUpRequestBodyDto = new SignUpRequestBodyDto();

      newUser = new UserEntity();
    });

    it('signUp 성공', async () => {
      mockUsersService.create.mockResolvedValue(newUser);

      await expect(service.signUp(signUpRequestBodyDto)).resolves.toEqual(
        newUser,
      );
    });
  });

  describe(AuthService.prototype.signIn.name, () => {
    let signInDtoRequestBody: SignInDtoRequestBody;

    let existUser: UserEntity;

    beforeEach(() => {
      signInDtoRequestBody = new SignInDtoRequestBody();
      existUser = new UserEntity();
    });

    it('유저가 존재하지 않는 경우', async () => {
      mockUsersService.findOneBy.mockResolvedValue(null);

      await expect(service.signIn(signInDtoRequestBody)).rejects.toThrowError(
        UnauthorizedException,
      );
    });

    it('패스워드가 없는 경우(현재는 이메일만 있기에 서버에러로 처리한다.', async () => {
      existUser.password = null;

      mockUsersService.findOneBy.mockResolvedValue(existUser);

      await expect(service.signIn(signInDtoRequestBody)).rejects.toThrowError(
        InternalServerErrorException,
      );
    });

    it('패스워드가 틀린 경우', async () => {
      existUser.password = 'password';

      mockUsersService.findOneBy.mockResolvedValue(existUser);
      mockEncryption.compare.mockResolvedValue(false);

      await expect(service.signIn(signInDtoRequestBody)).rejects.toThrowError(
        ForbiddenException,
      );
    });

    it('signIn 성공', async () => {
      existUser.id = 1;
      existUser.password = 'password';

      mockUsersService.findOneBy.mockResolvedValue(existUser);
      mockEncryption.compare.mockResolvedValue(true);

      await expect(service.signIn(signInDtoRequestBody)).resolves.toEqual(
        existUser,
      );
    });
  });

  describe(AuthService.prototype.generateAccessToken.name, () => {
    let id: number;

    beforeEach(() => {
      id = NaN;
    });

    it('토큰 생성', async () => {
      const accessToken = 'accessToken';
      mockJwtService.signAsync.mockResolvedValue(accessToken);

      await expect(service.generateAccessToken(id)).resolves.toBe(accessToken);

      expect(mockJwtService.signAsync).toBeCalledWith(
        { id },
        expect.anything(),
      );
    });
  });

  describe(AuthService.prototype.generateRefreshToken.name, () => {
    let id: number;

    beforeEach(() => {
      id = NaN;
    });

    it('토큰 생성', async () => {
      const refreshToken = 'refreshToken';
      mockJwtService.signAsync.mockResolvedValue(refreshToken);

      await expect(service.generateRefreshToken(id)).resolves.toBe(
        refreshToken,
      );

      expect(mockJwtService.signAsync).toBeCalledWith(
        { id },
        expect.anything(),
      );
    });
  });
});
