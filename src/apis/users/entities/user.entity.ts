import { LoginType, User } from '@prisma/client';
import { BaseEntity } from '@src/entities/base.entity';

export class UserEntity extends BaseEntity implements User {
  password: string | null;

  loginType: LoginType;

  email: string;

  nickname: string;

  constructor(userEntity: Partial<UserEntity> = {}) {
    super();

    Object.assign(this, userEntity);
  }
}
