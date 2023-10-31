import { HttpStatus } from '@nestjs/common';
import { ErrorHttpStatusCode } from '@nestjs/common/utils/http-error-by-code.util';
import { ApiProperty, ApiResponse } from '@nestjs/swagger';
import { SwaggerBuilder } from '@src/interceptors/success-interceptor/builder/swagger.builder';

export class DeleteResponseDto implements SwaggerBuilder {
  @ApiProperty({
    description: '삭제된 리소스 개수',
    format: 'integer',
  })
  count: number;

  constructor(count: number) {
    Object.assign(this, { count });
  }

  static swaggerBuilder(
    status: Exclude<HttpStatus, ErrorHttpStatusCode>,
    key: string,
  ) {
    class Temp extends this {}

    Object.defineProperty(Temp, 'name', {
      value: `${key[0].toUpperCase()}${key.slice(1)}${this.name}`,
    });

    return ApiResponse({ status, type: Temp });
  }
}
