import { Injectable } from '@nestjs/common';
import { ERROR_CODE } from '@src/constants/error-response-code.constant';
import { ERROR_REASON } from '@src/constants/error-response-reason.constant';
import { AppConfigService } from '@src/core/app-config/services/app-config.service';
import {
  ExceptionError,
  ResponseJson,
} from '@src/http-exceptions/types/exception.type';

@Injectable()
export class HttpExceptionService {
  constructor(private readonly appConfigService: AppConfigService) {}

  getErrorStack(exception: any) {
    const isProduction = this.appConfigService.isProduction();

    return isProduction ? undefined : exception.stack;
  }

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
    errorCode: typeof ERROR_CODE[keyof typeof ERROR_CODE];
    message: string;
  }): ExceptionError;

  static createError(error: {
    errorCode: typeof ERROR_CODE[keyof typeof ERROR_CODE];
    messages: string[];
  }): ExceptionError;

  static createError(error: {
    errorCode: typeof ERROR_CODE[keyof typeof ERROR_CODE];
    message: string;
    messages: string[];
  }): ExceptionError {
    const { errorCode, message, messages } = error;

    return {
      code: errorCode,
      reason: ERROR_REASON[errorCode],
      messages: messages || [message],
    };
  }
}
