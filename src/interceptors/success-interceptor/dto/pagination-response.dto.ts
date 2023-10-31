import { ApiProperty } from '@nestjs/swagger';
import { SwaggerBuilder } from '@src/interceptors/builder/swagger.builder';

export class PaginationResponseDto extends SwaggerBuilder {
  @ApiProperty({
    description: '총 페이지 수',
    minimum: 1,
    format: 'integer',
  })
  totalCount: number;

  @ApiProperty({
    description: '한 요청에 대한 data 수',
    minimum: 1,
    format: 'integer',
  })
  pageSize: number;

  @ApiProperty({
    description: '현재 페이지 번호',
    minimum: 1,
    format: 'integer',
  })
  currentPage: number;

  @ApiProperty({
    description: '다음 페이지 번호, 다음 페이지가 없다면 null 반환',
    minimum: 2,
    format: 'integer',
    nullable: true,
  })
  nextPage: number | null;

  @ApiProperty({
    description: '다음 페이지 존재 여부',
    minimum: 1,
  })
  hasNext: boolean;

  @ApiProperty({
    description: '마지막 페이지 번호',
    minimum: 1,
    format: 'integer',
  })
  lastPage: number;

  // 타입지정 불가
  // [key: string]: unknown[];

  constructor(
    res: { [key: string]: unknown[] },
    pageInfo: {
      totalCount: number;
      pageSize: number;
      currentPage: number;
      nextPage: number | null;
      hasNext: boolean;
      lastPage: number;
    },
  ) {
    super();

    Object.assign(this, Object.assign(res, pageInfo));
  }
}
