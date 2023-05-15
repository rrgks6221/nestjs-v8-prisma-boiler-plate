import { ApiProperty } from '@nestjs/swagger';
import { LoginType, Role, User } from '@prisma/client';
import { BaseEntity } from '@src/entities/base.entity';

export class UserEntity extends BaseEntity implements User {
  password: string | null;

  @ApiProperty({
    description: 'user login type',
    enum: LoginType,
  })
  loginType: LoginType;

  @ApiProperty({
    description: 'email',
    format: 'email',
  })
  email: string;

  @ApiProperty({
    description: 'nickname',
  })
  nickname: string;

  @ApiProperty({
    description: 'role',
    enum: Role,
  })
  role: Role;
}
