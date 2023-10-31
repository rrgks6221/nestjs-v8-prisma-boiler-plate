import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '@src/entities/base.entity';
import { Exclude } from 'class-transformer';

export class BaseResponseDto
  implements Pick<BaseEntity, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
{
  @ApiProperty({
    description: '고유 ID',
    type: 'integer',
    minimum: 1,
  })
  id: number;

  @ApiProperty({
    description: '생성일자',
  })
  createdAt: Date;

  @ApiProperty({
    description: '수정일자',
  })
  updatedAt: Date;

  @Exclude()
  deletedAt: Date | null;
}
