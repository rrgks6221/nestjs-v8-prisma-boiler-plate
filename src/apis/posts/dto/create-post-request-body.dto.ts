import { ApiProperty } from '@nestjs/swagger';
import { POST_TITLE_LENGTH } from '@src/apis/posts/constants/post.constant';
import { PostEntity } from '@src/apis/posts/entities/post.entity';
import { IsNotEmptyString } from '@src/decorators/is-not-empty-string.decorator';
import { Length } from 'class-validator';

export class CreatePostRequestBodyDto
  implements Pick<PostEntity, 'title' | 'description'>
{
  @ApiProperty({
    description: 'title',
    minLength: POST_TITLE_LENGTH.MIN,
    maxLength: POST_TITLE_LENGTH.MAX,
  })
  @Length(POST_TITLE_LENGTH.MIN, POST_TITLE_LENGTH.MAX)
  @IsNotEmptyString()
  title: string;

  @ApiProperty({
    description: 'description',
  })
  @IsNotEmptyString()
  description: string;
}
