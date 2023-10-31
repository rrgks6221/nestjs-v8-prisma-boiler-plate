import { Type } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { SwaggerBuilder } from '@src/interceptors/builder/swagger.builder';

export class DeleteResponseDto implements SwaggerBuilder {
  @ApiProperty({
    description: '삭제된 리소스 개수',
    format: 'integer',
  })
  count: number;

  constructor(count: number) {
    Object.assign(this, { count });
  }

  static swaggerBuilder(): Type<any> {
    return this;
  }
}
