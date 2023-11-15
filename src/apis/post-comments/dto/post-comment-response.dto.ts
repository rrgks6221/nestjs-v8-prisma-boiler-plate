import { ApiProperty } from '@nestjs/swagger';
import { PostCommentEntity } from '@src/apis/post-comments/entities/post-comment.entity';
import { BaseResponseDto } from '@src/dtos/base-response.dto';

export class PostCommentResponseDto
  extends BaseResponseDto
  implements PostCommentEntity
{
  @ApiProperty({
    description: 'post 고유 ID',
    type: 'integer',
    minimum: 1,
  })
  postId: number;

  @ApiProperty({
    description: 'user 고유 ID',
    type: 'integer',
    minimum: 1,
  })
  userId: number;

  @ApiProperty({
    description: '내용',
  })
  description: string;

  constructor(postComment: Partial<PostCommentResponseDto> = {}) {
    super();

    Object.assign(this, postComment);
  }
}
