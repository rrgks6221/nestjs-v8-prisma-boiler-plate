import { Type } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';

export class SwaggerBuilder {
  static swaggerBuilder(
    options: Required<Pick<ApiPropertyOptions, 'name' | 'type'>> &
      ApiPropertyOptions,
  ): Type {
    class Temp extends this {
      @ApiProperty({
        ...options,
      })
      private readonly temp: string;
    }

    Object.defineProperty(Temp, 'name', {
      value: `${options.name[0].toUpperCase()}${options.name.slice(1)}${
        this.name
      }`,
    });

    return Temp;
  }
}
