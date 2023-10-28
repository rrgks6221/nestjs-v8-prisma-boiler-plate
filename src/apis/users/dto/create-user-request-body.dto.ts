import { ApiProperty } from '@nestjs/swagger';
import { LoginType } from '@prisma/client';
import { USER_NICKNAME_LENGTH } from '@src/apis/users/constants/user.constant';
import { UserEntity } from '@src/apis/users/entities/user.entity';
import { IsNotEmptyString } from '@src/decorators/is-not-empty-string.decorator';
import { IsEmail, IsEnum, IsString, Length } from 'class-validator';

export class CreateUserRequestBodyDto
  implements Pick<UserEntity, 'loginType' | 'password' | 'email' | 'nickname'>
{
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
    minLength: USER_NICKNAME_LENGTH.MIN,
    maxLength: USER_NICKNAME_LENGTH.MAX,
  })
  @Length(USER_NICKNAME_LENGTH.MIN, USER_NICKNAME_LENGTH.MAX)
  @IsNotEmptyString()
  nickname: string;
}
