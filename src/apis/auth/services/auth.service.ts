import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginType } from '@prisma/client';
import {
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
} from '@src/apis/auth/constants/auth.constant';
import { SignInDtoRequestBody } from '@src/apis/auth/dtos/sign-in-request-body.dto';
import { SignUpRequestBodyDto } from '@src/apis/auth/dtos/sign-up-request-body.dto';
import { AuthHelper } from '@src/apis/auth/helpers/auth.helper';
import { AuthToken } from '@src/apis/auth/types/auth.type';
import { UserEntity } from '@src/apis/users/entities/user.entity';
import { UsersService } from '@src/apis/users/services/users.service';
import { ERROR_CODE } from '@src/constants/error-response-code.constant';
import { BCRYPT_TOKEN } from '@src/constants/token.constant';
import { ENV_KEY } from '@src/core/app-config/constants/app-config.constant';
import { AppConfigService } from '@src/core/app-config/services/app-config.service';
import { HttpForbiddenException } from '@src/http-exceptions/exceptions/http-forbidden.exception';
import { HttpInternalServerErrorException } from '@src/http-exceptions/exceptions/http-internal-server-error.exception';
import { HttpUnauthorizedException } from '@src/http-exceptions/exceptions/http-unauthorized.exception';
import bcrypt from 'bcrypt';
import { Cache } from 'cache-manager';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly appConfigService: AppConfigService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly authHelper: AuthHelper,
    @Inject(BCRYPT_TOKEN)
    private readonly encryption: typeof bcrypt,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async signUp(
    signUpRequestBodyDto: SignUpRequestBodyDto,
  ): Promise<UserEntity> {
    const newUser = await this.usersService.create(signUpRequestBodyDto);

    return newUser;
  }

  async signIn(
    signInDtoRequestBody: SignInDtoRequestBody,
  ): Promise<UserEntity> {
    const existUser = await this.usersService.findOneBy({
      email: signInDtoRequestBody.email,
      loginType: LoginType.EMAIL,
    });

    if (!existUser) {
      throw new HttpUnauthorizedException({
        errorCode: ERROR_CODE.CODE004,
        message: 'Different account information',
      });
    }

    if (!existUser.password) {
      throw new HttpInternalServerErrorException({
        errorCode: ERROR_CODE.CODE001,
        message: 'server error',
      });
    }

    const isComparePassword = await this.encryption.compare(
      signInDtoRequestBody.password,
      existUser.password,
    );

    if (!isComparePassword) {
      throw new HttpForbiddenException({
        errorCode: ERROR_CODE.CODE006,
        message: 'Different account information',
      });
    }

    return existUser;
  }

  generateAccessToken(id: number): Promise<string> {
    return this.jwtService.signAsync(
      {
        id,
      },
      {
        secret: this.appConfigService.get<string>(
          ENV_KEY.JWT_ACCESS_TOKEN_SECRET,
        ),
        expiresIn: Math.floor(
          this.appConfigService.get<number>(
            ENV_KEY.JWT_ACCESS_TOKEN_EXPIRATION_MS,
          ) / 1000,
        ),
      },
    );
  }

  generateRefreshToken(id: number): Promise<string> {
    return this.jwtService.signAsync(
      {
        id,
      },
      {
        secret: this.appConfigService.get<string>(
          ENV_KEY.JWT_REFRESH_TOKEN_SECRET,
        ),
        expiresIn:
          this.appConfigService.get<number>(
            ENV_KEY.JWT_REFRESH_TOKEN_EXPIRATION_MS,
          ) / 1000,
      },
    );
  }

  async setAuthToken(
    res: Response,
    userId: number,
    authToken: AuthToken,
  ): Promise<void> {
    const { accessToken, refreshToken } = authToken;

    res.cookie(
      ACCESS_TOKEN_COOKIE_NAME,
      this.authHelper.getBearerToken(accessToken),
      {
        httpOnly: true,
        secure: !this.appConfigService.isLocal(),
        expires: new Date(
          new Date().getTime() +
            this.appConfigService.get<number>(
              ENV_KEY.JWT_ACCESS_TOKEN_EXPIRATION_MS,
            ),
        ),
      },
    );
    res.cookie(
      REFRESH_TOKEN_COOKIE_NAME,
      this.authHelper.getBearerToken(refreshToken),
      {
        httpOnly: true,
        secure: !this.appConfigService.isLocal(),
        expires: new Date(
          new Date().getTime() +
            this.appConfigService.get<number>(
              ENV_KEY.JWT_REFRESH_TOKEN_EXPIRATION_MS,
            ),
        ),
      },
    );

    await this.cacheManager.set(
      this.authHelper.getRefreshKeyInStore(userId),
      refreshToken,
      {
        ttl:
          this.appConfigService.get<number>(
            ENV_KEY.JWT_REFRESH_TOKEN_EXPIRATION_MS,
          ) / 1000,
      },
    );
  }

  async clearAuthToken(res: Response, userId: number): Promise<void> {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');

    await this.cacheManager.del(this.authHelper.getRefreshKeyInStore(userId));
  }
}
