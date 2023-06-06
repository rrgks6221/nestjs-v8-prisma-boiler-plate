import { applyDecorators } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsInt, Min, ValidationOptions } from 'class-validator';

/**
 * 1 이상의 정수만 허용 및 number 타입 변환 데코레이터
 */
export const IsPositiveInt = (
  validationOptions?: ValidationOptions,
): PropertyDecorator => {
  return applyDecorators(
    Type(() => Number),
    IsInt(validationOptions),
    Min(1, validationOptions),
  );
};
