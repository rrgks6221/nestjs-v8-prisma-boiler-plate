import { ApiProperty } from '@nestjs/swagger';
import { LoginType } from '@prisma/client';
import { USER_NICKNAME_LENGTH } from '@src/apis/users/constants/user.constant';
import { UserEntity } from '@src/apis/users/entities/user.entity';
import { BaseEntity } from '@src/entities/base.entity';
import { Exclude } from 'class-transformer';

export class UserBaseResponseDto extends BaseEntity implements UserEntity {
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

  constructor(user: Partial<UserBaseResponseDto> = {}) {
    super();

    Object.assign(this, user);
  }
}
