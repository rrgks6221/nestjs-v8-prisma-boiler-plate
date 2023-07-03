import { ApiProperty } from '@nestjs/swagger';
import { LoginType } from '@prisma/client';
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
    maxLength: 255,
  })
  email: string;

  @ApiProperty({
    description: '닉네임',
    minLength: 1,
    maxLength: 255,
  })
  nickname: string;

  constructor(user: Partial<UserBaseResponseDto> = {}) {
    super();

    Object.assign(this, user);
  }
}
