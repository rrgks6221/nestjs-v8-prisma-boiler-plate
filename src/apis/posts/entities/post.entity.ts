import { Post } from '@prisma/client';
import { BaseEntity } from '@src/entities/base.entity';

export class PostEntity extends BaseEntity implements Post {
  userId: number;

  title: string;

  description: string;

  constructor(post: Partial<PostEntity> = {}) {
    super();

    Object.assign(this, post);
  }
}
