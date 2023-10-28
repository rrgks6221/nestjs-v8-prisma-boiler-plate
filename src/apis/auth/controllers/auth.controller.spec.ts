import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '@src/apis/auth/controllers/auth.controller';
import { SignInDtoRequestBody } from '@src/apis/auth/dtos/sign-in-request-body.dto';
import { SignUpRequestBodyDto } from '@src/apis/auth/dtos/sign-up-request-body.dto';
import { AuthService } from '@src/apis/auth/services/auth.service';
import { UserBaseResponseDto } from '@src/apis/users/dto/user-base-response.dto';
import { UserEntity } from '@src/apis/users/entities/user.entity';
import { MockAuthService } from '@test/mock/services.mock';

describe('AuthController', () => {
  let controller: AuthController;
  let mockAuthService: MockAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useClass: MockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    mockAuthService = module.get(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signUp', () => {
    let newUser: UserEntity;
    let signUpRequestBodyDto: SignUpRequestBodyDto;
    let mockResponse: any;

    beforeEach(() => {
      newUser = new UserEntity({ id: 1 });
      signUpRequestBodyDto = new SignUpRequestBodyDto();
      mockResponse = {};
    });

    it('회원가입 성공', async () => {
      mockAuthService.signUp.mockResolvedValue(newUser);
      mockAuthService.generateAccessToken.mockResolvedValue(
        faker.datatype.string(),
      );
      mockAuthService.generateRefreshToken.mockResolvedValue(
        faker.datatype.string(),
      );
      mockAuthService.setAuthToken.mockResolvedValue(undefined);

      await expect(
        controller.signUp(mockResponse, signUpRequestBodyDto),
      ).resolves.toBeInstanceOf(UserBaseResponseDto);
    });
  });

  describe('signIn', () => {
    let user: UserEntity;
    let signInDtoRequestBody: SignInDtoRequestBody;
    let mockResponse: any;

    beforeEach(() => {
      user = new UserEntity({ id: 1 });
      signInDtoRequestBody = new SignInDtoRequestBody();
      mockResponse = {};
    });

    it('회원가입 성공', async () => {
      mockAuthService.signIn.mockResolvedValue(user);
      mockAuthService.generateAccessToken.mockResolvedValue(
        faker.datatype.string(),
      );
      mockAuthService.generateRefreshToken.mockResolvedValue(
        faker.datatype.string(),
      );
      mockAuthService.setAuthToken.mockResolvedValue(undefined);

      await expect(
        controller.signIn(mockResponse, signInDtoRequestBody),
      ).resolves.toBeInstanceOf(UserBaseResponseDto);
    });
  });

  describe('signOut', () => {
    let mockResponse: any;
    let user: UserEntity;

    beforeEach(() => {
      mockResponse = {};
      user = new UserEntity();
    });

    it('로그아웃', async () => {
      mockAuthService.clearAuthToken.mockResolvedValue(undefined);

      await expect(
        controller.signOut(mockResponse, user),
      ).resolves.toBeUndefined();
    });
  });

  describe('refresh', () => {
    let mockRes: any;
    let user: UserEntity;

    beforeEach(() => {
      mockRes = {};
      user = new UserEntity();
    });

    it('리프래시', async () => {
      mockAuthService.generateAccessToken.mockResolvedValue(
        faker.datatype.string(),
      );
      mockAuthService.generateRefreshToken.mockResolvedValue(
        faker.datatype.string(),
      );
      mockAuthService.setAuthToken.mockResolvedValue(undefined);

      await expect(controller.refresh(mockRes, user)).resolves.toBeUndefined();
    });
  });
});
