import { ApiPropertyOptional } from '@nestjs/swagger';
import { Post } from '@prisma/client';
import {
  POST_ORDER_FIELD,
  POST_TITLE_LENGTH,
} from '@src/apis/posts/constants/post.constant';
import { SortOrder } from '@src/constants/enum';
import { ApiPropertyOrderBy } from '@src/decorators/api-property-order-by.decorator';
import {
  CsvToOrderBy,
  OrderBy,
} from '@src/decorators/csv-to-order-by.decorator';
import { IsPositiveInt } from '@src/decorators/is-positive-int.decorator';
import { PageDto } from '@src/dtos/page.dto';
import { IsOptional, MaxLength } from 'class-validator';

export class FindPostListQueryDto extends PageDto implements Partial<Post> {
  @ApiPropertyOptional({
    description: 'posts 고유 Id',
    format: 'integer',
  })
  @IsOptional()
  @IsPositiveInt()
  id?: number;

  @ApiPropertyOptional({
    description: '게시한 유저 고유 id',
    format: 'integer',
  })
  @IsOptional()
  @IsPositiveInt()
  userId?: number;

  @ApiPropertyOptional({
    description: 'title',
    maxLength: POST_TITLE_LENGTH.MAX,
  })
  @IsOptional()
  @MaxLength(POST_TITLE_LENGTH.MAX)
  title?: string;

  @ApiPropertyOptional({
    description: 'description',
  })
  @IsOptional()
  description?: string;

  @ApiPropertyOrderBy(POST_ORDER_FIELD)
  @CsvToOrderBy<typeof POST_ORDER_FIELD>([...POST_ORDER_FIELD])
  @IsOptional()
  orderBy: OrderBy<typeof POST_ORDER_FIELD> = { id: SortOrder.Desc };
}
