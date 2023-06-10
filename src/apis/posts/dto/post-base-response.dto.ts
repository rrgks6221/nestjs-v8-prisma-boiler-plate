import { ApiProperty } from '@nestjs/swagger';
import { PostEntity } from '@src/apis/posts/entities/post.entity';
import { BaseEntity } from '@src/entities/base.entity';

export class PostBaseResponseDto extends BaseEntity implements PostEntity {
  @ApiProperty({
    description: 'user 고유 ID',
    type: 'integer',
    minimum: 1,
  })
  userId: number;

  @ApiProperty({
    description: 'title',
    minLength: 1,
    maxLength: 255,
  })
  title: string;

  @ApiProperty({
    description: 'description',
    minLength: 1,
  })
  description: string;

  constructor(post: Partial<PostBaseResponseDto> = {}) {
    super();

    Object.assign(this, post);
  }
}