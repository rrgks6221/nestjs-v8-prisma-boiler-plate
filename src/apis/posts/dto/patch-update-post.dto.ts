import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreatePostDto } from '@src/apis/posts/dto/create-post.dto';
import { IsNotEmptyString } from '@src/decorators/is-not-empty-string.decorator';
import { IsOptional, Length } from 'class-validator';

export class PatchUpdatePostDto implements Partial<CreatePostDto> {
  @ApiPropertyOptional({
    description: 'title',
  })
  @Length(1, 255)
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
