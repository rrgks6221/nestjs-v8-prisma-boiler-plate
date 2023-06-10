import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@src/apis/auth/guards/jwt-auth.guard';
import { AuthService } from '@src/apis/auth/services/auth.service';
import { UserEntity } from '@src/apis/users/entities/user.entity';
import { User } from '@src/decorators/user.decorator';
import { ParsePositiveIntPipe } from '@src/pipes/parse-positive-int.pipe';

@ApiTags('auth')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: '로그인한 유저 프로필 조회' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('profile')
  getProfile(@User() user: UserEntity) {
    return new UserEntity(user);
  }

  @ApiOperation({ summary: '개발용으로 생성된 엑세스 토큰 생성 api' })
  @Post('access-token/:userId')
  createAccessTokenForDevelop(
    @Param('userId', ParsePositiveIntPipe) userId: number,
  ) {
    return this.authService.createAccessToken(userId);
  }
}
