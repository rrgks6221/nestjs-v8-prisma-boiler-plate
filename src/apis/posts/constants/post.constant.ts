import { Post } from '@prisma/client';

export const POST_ORDER_FIELD: readonly (keyof Partial<Post>)[] = [
  'id',
  'title',
  'userId',
] as const;

export const POST_TITLE_LENGTH = {
  MIN: 1,
  MAX: 255,
} as const;
