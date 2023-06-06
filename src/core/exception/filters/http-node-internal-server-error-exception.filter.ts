import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

import { ERROR_CODE } from '@src/constants/error-response-code.constant';
import { AppConfigService } from '@src/core/app-config/services/app-config.service';
import { HttpExceptionHelper } from '@src/core/exception/helpers/http-exception.helper';
import { ResponseJson } from '@src/core/exception/types/exception.type';

/**
 * 예상하지 못한 에러 발생 시 nodeJS 레벨에서 발생하는 에러
 * ex) throw new Error()
 */
@Catch()
export class HttpNodeInternalServerErrorExceptionFilter
  extends HttpExceptionHelper
  implements ExceptionFilter
{
  constructor(private readonly appConfigService: AppConfigService) {
    super();
  }

  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = HttpStatus.INTERNAL_SERVER_ERROR;

    const isProduction = this.appConfigService.isProduction();

    const exceptionError = HttpExceptionHelper.createError({
      code: ERROR_CODE.CODE001,
      message: 'server error',
    });

    const responseJson: ResponseJson = this.buildResponseJson(
      status,
      exceptionError,
    );
    responseJson.stack = isProduction ? undefined : exception.stack;

    response.status(status).json(responseJson);
  }
}
