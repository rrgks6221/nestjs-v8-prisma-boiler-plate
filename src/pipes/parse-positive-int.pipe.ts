import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { ERROR_CODE } from '@src/constants/error-response-code.constant';
import { HttpBadRequestException } from '@src/http-exceptions/exceptions/http-bad-request.exception';

@Injectable()
export class ParsePositiveIntPipe implements PipeTransform<string> {
  transform(value: string, metadata: ArgumentMetadata): number {
    if (!this.isPositiveNumeric(value)) {
      throw new HttpBadRequestException({
        errorCode: ERROR_CODE.CODE003,
        message: 'Validation failed (positive numeric string is expected)',
      });
    }

    return parseInt(value, 10);
  }

  private isPositiveNumeric(value: string): boolean {
    return (
      ['string', 'number'].includes(typeof value) &&
      /^-?\d+$/.test(value) &&
      isFinite(value as any) &&
      Number(value) >= 1
    );
  }
}
