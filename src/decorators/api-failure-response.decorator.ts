import { applyDecorators } from '@nestjs/common';
import { ErrorHttpStatusCode } from '@nestjs/common/utils/http-error-by-code.util';
import { ApiResponse } from '@nestjs/swagger';
import { ERROR_CODE } from '@src/constants/error-response-code.constant';
import { ERROR_REASON } from '@src/constants/error-response-reason.constant';

export const ApiFailureResponse = (
  status: ErrorHttpStatusCode,
  codes: typeof ERROR_CODE[keyof typeof ERROR_CODE][],
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
          reason: {
            type: 'string',
            description: '에러 사유',
            example: ERROR_REASON[ERROR_CODE[codes[0]]],
            examples: codes.map((code) => ERROR_REASON[ERROR_CODE[code]]),
          },
          code: {
            type: 'string',
            description: '에러 코드',
            example: codes[0],
            examples: codes.map((code) => ERROR_CODE[code]),
          },
          messages: {
            type: 'array',
            description: '디테일한 메시지',
            example: ['디테일한 메시지'],
            items: {
              type: 'string',
            },
          },
        },
      },
    }),
  );
};
