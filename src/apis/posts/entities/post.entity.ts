import { ApiProperty } from '@nestjs/swagger';
import { Post as PostModel } from '@prisma/client';
import { BaseEntity } from '@src/entities/base.entity';

export class PostEntity extends BaseEntity implements PostModel {
  @ApiProperty({
    description: 'user 고유 ID',
    type: 'integer',
    minimum: 1,
  })
  userId: number;

  @ApiProperty({
    description: 'title',
    minimum: 1,
    maximum: 255,
  })
  title: string;

  @ApiProperty({
    description: 'description',
  })
  description: string;
}
