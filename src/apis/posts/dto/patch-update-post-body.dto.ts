import { ApiPropertyOptional } from '@nestjs/swagger';
import { POST_TITLE_LENGTH } from '@src/apis/posts/constants/post.constant';
import { CreatePostRequestBodyDto } from '@src/apis/posts/dto/create-post-request-body.dto';
import { IsNotEmptyString } from '@src/decorators/is-not-empty-string.decorator';
import { IsOptional, Length } from 'class-validator';

export class PatchUpdatePostBodyDto
  implements Partial<CreatePostRequestBodyDto>
{
  @ApiPropertyOptional({
    description: 'title',
    minLength: POST_TITLE_LENGTH.MIN,
    maxLength: POST_TITLE_LENGTH.MAX,
  })
  @Length(POST_TITLE_LENGTH.MIN, POST_TITLE_LENGTH.MAX)
  @IsNotEmptyString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    description: 'description',
  })
  @IsNotEmptyString()
  @IsOptional()
  description?: string;
}
