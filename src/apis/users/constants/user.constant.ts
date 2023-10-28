import { UserEntity } from '@src/apis/users/entities/user.entity';

export const USER_ORDER_FIELD: readonly (keyof Partial<UserEntity>)[] = [
  'id',
  'loginType',
  'email',
  'nickname',
] as const;

export const USER_NICKNAME_LENGTH = {
  MIN: 2,
  MAX: 255,
};
