import { applyDecorators } from '@nestjs/common';
import { ErrorHttpStatusCode } from '@nestjs/common/utils/http-error-by-code.util';
import { ApiResponse } from '@nestjs/swagger';
import { ERROR_CODE } from '@src/constants/error-response-code.constant';
import { ERROR_REASON } from '@src/constants/error-response-reason.constant';

/**
 * @todo swagger 랑 실제랑 다름
 */
export const ApiFailureResponse = (
  status: ErrorHttpStatusCode,
  errorCodes: typeof ERROR_CODE[keyof typeof ERROR_CODE][],
) => {
  return applyDecorators(
    ApiResponse({
      status,
      schema: {
        properties: {
          timestamp: {
            type: 'string',
            format: 'date-time',
            description: '에러 발생 시각',
          },
          statusCode: {
            type: 'number',
            format: 'integer',
            description: 'http status code',
            minimum: 400,
            example: status,
          },
          errorCode: {
            type: 'string',
            description: 'error code',
            example: errorCodes[0],
            enum: errorCodes,
          },
          reason: {
            type: 'string',
            description: 'error reason',
            example: ERROR_REASON[ERROR_CODE[errorCodes[0]]],
            enum: errorCodes.map(
              (errorCode) => ERROR_REASON[ERROR_CODE[errorCode]],
            ),
          },
          message: {
            type: 'string',
            description: 'detail error message',
            example: 'detail error message',
          },
        },
      },
    }),
  );
};
