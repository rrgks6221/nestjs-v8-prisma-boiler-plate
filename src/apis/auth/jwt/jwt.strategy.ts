import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@prisma/client';
import { UserEntity } from '@src/apis/users/entities/user.entity';
import { ERROR_CODE } from '@src/constants/error-response-code.constant';
import { ENV_KEY } from '@src/core/app-config/constants/api-config.constant';
import { AppConfigService } from '@src/core/app-config/services/app-config.service';
import { HttpExceptionHelper } from '@src/core/exception/helpers/http-exception.helper';
import { PrismaService } from '@src/core/prisma/prisma.service';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly appConfigService: AppConfigService,
    private readonly prismaService: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: appConfigService.get<string>(ENV_KEY.JWT_ACCESS_KEY),
    });
  }

  async validate(payload: any) {
    const existUser: User | null = await this.prismaService.user.findUnique({
      where: {
        id: payload.id,
      },
    });

    if (!existUser) {
      throw new UnauthorizedException(
        HttpExceptionHelper.createError({
          code: ERROR_CODE.CODE004,
          message: 'this token is invalid',
        }),
      );
    }

    return new UserEntity(existUser);
  }
}
