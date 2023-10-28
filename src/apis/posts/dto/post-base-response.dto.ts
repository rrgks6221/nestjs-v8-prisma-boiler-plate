import { ApiProperty } from '@nestjs/swagger';
import { POST_TITLE_LENGTH } from '@src/apis/posts/constants/post.constant';
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
    minLength: POST_TITLE_LENGTH.MIN,
    maxLength: POST_TITLE_LENGTH.MAX,
  })
  title: string;

  @ApiProperty({
    description: 'description',
  })
  description: string;

  constructor(post: Partial<PostBaseResponseDto> = {}) {
    super();

    Object.assign(this, post);
  }
}
