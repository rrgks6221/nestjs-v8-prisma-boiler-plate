import { ApiProperty } from '@nestjs/swagger';
import { LoginType } from '@prisma/client';
import { USER_NICKNAME_LENGTH } from '@src/apis/users/constants/user.constant';
import { UserEntity } from '@src/apis/users/entities/user.entity';
import { BaseResponseDto } from '@src/dtos/base-response.dto';
import { Exclude } from 'class-transformer';

export class UserResponseDto extends BaseResponseDto implements UserEntity {
  @Exclude()
  password: string | null;

  @ApiProperty({
    description: '로그인 타입',
    enum: LoginType,
  })
  loginType: LoginType;

  @ApiProperty({
    description: '이메일',
    format: 'email',
  })
  email: string;

  @ApiProperty({
    description: '닉네임',
    minLength: USER_NICKNAME_LENGTH.MIN,
    maxLength: USER_NICKNAME_LENGTH.MAX,
  })
  nickname: string;

  constructor(user: Partial<UserResponseDto> = {}) {
    super();

    Object.assign(this, user);
  }
}
