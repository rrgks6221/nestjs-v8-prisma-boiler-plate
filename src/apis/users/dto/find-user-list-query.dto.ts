import { ApiPropertyOptional } from '@nestjs/swagger';
import { LoginType, User } from '@prisma/client';
import { POST_ORDER_FIELD } from '@src/apis/posts/constants/post.constant';
import { ApiPropertyOrderBy } from '@src/decorators/api-property-order-by.decorator';
import {
  CsvToOrderBy,
  OrderBy,
} from '@src/decorators/csv-to-order-by.decorator';
import { IsPositiveInt } from '@src/decorators/is-positive-int.decorator';
import { PageDto } from '@src/dtos/page.dto';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';

export class FindUserListQueryDto extends PageDto implements Partial<User> {
  @ApiPropertyOptional({
    description: 'user 고유 Id',
    format: 'integer',
  })
  @IsOptional()
  @IsPositiveInt()
  id?: number;

  @ApiPropertyOptional({
    description: '로그인 타입',
    enum: LoginType,
  })
  @IsEnum(LoginType)
  @IsOptional()
  loginType?: LoginType;

  @ApiPropertyOptional({
    description: '이메일',
    format: 'email',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'nickname',
  })
  @IsString()
  @IsOptional()
  nickname?: string;

  @ApiPropertyOrderBy(POST_ORDER_FIELD)
  @CsvToOrderBy<typeof POST_ORDER_FIELD>([...POST_ORDER_FIELD])
  orderBy: OrderBy<typeof POST_ORDER_FIELD>;
}
