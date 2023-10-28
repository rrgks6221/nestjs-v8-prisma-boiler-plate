import { ApiProperty } from '@nestjs/swagger';
import { LoginType } from '@prisma/client';
import { CreateUserRequestBodyDto } from '@src/apis/users/dto/create-user-request-body.dto';
import { IsNotEmptyString } from '@src/decorators/is-not-empty-string.decorator';
import { IsEnum, IsString, IsEmail } from 'class-validator';

export class SignUpRequestBodyDto implements CreateUserRequestBodyDto {
  @ApiProperty({
    description: '로그인 타입',
    enum: LoginType,
  })
  @IsEnum(LoginType)
  loginType: LoginType;

  @ApiProperty({
    example: 'password',
    description: 'user password',
  })
  @IsString()
  password: string;

  @ApiProperty({
    example: 'example@example.com',
    description: 'user email',
    format: 'email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '홍길동',
    description: 'user 닉네임',
  })
  @IsNotEmptyString()
  nickname: string;
}
