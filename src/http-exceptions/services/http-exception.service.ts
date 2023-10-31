import { Injectable } from '@nestjs/common';
import { ERROR_CODE } from '@src/constants/error-response-code.constant';
import { ERROR_REASON } from '@src/constants/error-response-reason.constant';
import {
  ExceptionError,
  ResponseJson,
} from '@src/http-exceptions/types/exception.type';

/**
 * exception filter 들이 사용하는 메서드 및 멤버변수를 모아놓은 class
 * 각 exception filter 들은 이 클레스를 상속받아 사용함
 */
@Injectable()
export class HttpExceptionService {
  buildResponseJson(
    statusCode: number,
    exception: ExceptionError,
  ): ResponseJson {
    const { code, reason, messages } = exception;

    return {
      timestamp: new Date(),
      statusCode,
      reason,
      code,
      messages,
    };
  }

  static createError(error: {
    code: typeof ERROR_CODE[keyof typeof ERROR_CODE];
    message: string;
  }): ExceptionError;

  static createError(error: {
    code: typeof ERROR_CODE[keyof typeof ERROR_CODE];
    messages: string[];
  }): ExceptionError;

  static createError(error: {
    code: typeof ERROR_CODE[keyof typeof ERROR_CODE];
    message: string;
    messages: string[];
  }): ExceptionError {
    const { code, message, messages } = error;

    return {
      code,
      reason: ERROR_REASON[code],
      messages: messages || [message],
    };
  }
}
