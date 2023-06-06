import { ApiProperty } from '@nestjs/swagger';
import { PostEntity } from '@src/apis/posts/entities/post.entity';
import { IsNotEmptyString } from '@src/decorators/is-not-empty-string.decorator';
import { Length } from 'class-validator';

export class CreatePostBodyDto
  implements Pick<PostEntity, 'title' | 'description'>
{
  @ApiProperty({
    description: 'title',
    minLength: 1,
    maxLength: 255,
  })
  @Length(1, 255)
  @IsNotEmptyString()
  title: string;

  @ApiProperty({
    description: 'description',
  })
  @IsNotEmptyString()
  description: string;
}
