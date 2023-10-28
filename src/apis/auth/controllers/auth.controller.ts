import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  ApiCreateAccessTokenForDevelop,
  ApiGetProfile,
  ApiRefresh,
  ApiSignIn,
  ApiSignOut,
  ApiSignUp,
} from '@src/apis/auth/controllers/auth.swagger';
import { SignInDtoRequestBody } from '@src/apis/auth/dtos/sign-in-request-body.dto';
import { SignUpRequestBodyDto } from '@src/apis/auth/dtos/sign-up-request-body.dto';
import { JwtAuthGuard } from '@src/apis/auth/guards/jwt-auth.guard';
import { RefreshAuthGuard } from '@src/apis/auth/guards/refresh-auth-guard.guard';
import { AuthService } from '@src/apis/auth/services/auth.service';
import { CreateUserRequestBodyDto } from '@src/apis/users/dto/create-user-request-body.dto';
import { UserBaseResponseDto } from '@src/apis/users/dto/user-base-response.dto';
import { UserEntity } from '@src/apis/users/entities/user.entity';
import {
  ResponseType,
  SetResponse,
} from '@src/decorators/set-response.decorator';
import { User } from '@src/decorators/user.decorator';
import { ParsePositiveIntPipe } from '@src/pipes/parse-positive-int.pipe';
import { Response } from 'express';

@ApiTags('auth')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiGetProfile('로그인한 유저 프로필')
  @UseGuards(JwtAuthGuard)
  @SetResponse({ key: 'user', type: ResponseType.Base })
  @Get('profile')
  getProfile(@User() user: UserEntity) {
    return new UserEntity(user);
  }

  @ApiSignUp('회원가입')
  @SetResponse({ key: 'user', type: ResponseType.Base })
  @Post('sign-up')
  async signUp(
    @Res({ passthrough: true }) res: Response,
    @Body() signUpRequestBodyDto: SignUpRequestBodyDto,
  ): Promise<UserBaseResponseDto> {
    const newUser = await this.authService.signUp(signUpRequestBodyDto);
    const accessToken = await this.authService.generateAccessToken(newUser.id);
    const refreshToken = await this.authService.generateRefreshToken(
      newUser.id,
    );

    await this.authService.setAuthToken(res, newUser.id, {
      accessToken,
      refreshToken,
    });

    return new UserBaseResponseDto(newUser);
  }

  @ApiSignIn('로그인')
  @SetResponse({ key: 'user', type: ResponseType.Base })
  @Post('sign-in')
  async signIn(
    @Res({ passthrough: true }) res: Response,
    @Body() signInDtoRequestBody: SignInDtoRequestBody,
  ): Promise<UserBaseResponseDto> {
    const user = await this.authService.signIn(signInDtoRequestBody);
    const accessToken = await this.authService.generateAccessToken(user.id);
    const refreshToken = await this.authService.generateRefreshToken(user.id);

    await this.authService.setAuthToken(res, user.id, {
      accessToken,
      refreshToken,
    });

    return new UserBaseResponseDto(user);
  }

  @ApiSignOut('로그아웃')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('sign-out')
  async signOut(
    @Res({ passthrough: true }) res: Response,
    @User() user: UserEntity,
  ): Promise<void> {
    await this.authService.clearAuthToken(res, user.id);
  }

  @ApiRefresh('refresh token 을 이용한 access token 재발급')
  @UseGuards(RefreshAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('refresh')
  async refresh(
    @Res({ passthrough: true }) res: Response,
    @User() user: UserEntity,
  ): Promise<void> {
    const accessToken = await this.authService.generateAccessToken(user.id);
    const refreshToken = await this.authService.generateRefreshToken(user.id);

    await this.authService.setAuthToken(res, user.id, {
      accessToken,
      refreshToken,
    });
  }

  @ApiCreateAccessTokenForDevelop('개발용으로 생성된 access token 발급 api')
  @Post('access-token/:userId')
  createAccessTokenForDevelop(
    @Param('userId', ParsePositiveIntPipe) userId: number,
  ): Promise<string> {
    return this.authService.generateAccessToken(userId);
  }
}
