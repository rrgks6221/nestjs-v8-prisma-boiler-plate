import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

import { HttpExceptionHelper } from '@src/core/exceptions/helpers/http-exception.helper';
import { ResponseJson } from '@src/core/exceptions/types/exception.type';
import { ConfigService } from '@nestjs/config';

/**
 * 예상하지 못한 에러 발생 시 nodeJS 레벨에서 발생하는 에러
 * ex) throw new Error()
 */
@Catch()
export class HttpNodeInternalServerErrorExceptionFilter
  extends HttpExceptionHelper
  implements ExceptionFilter
{
  constructor(private readonly configService: ConfigService) {
    super();
  }

  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    const isProduction =
      this.configService.get<string>('NODE_ENV') === 'production';

    const responseJson: ResponseJson = this.buildResponseJson(status);

    responseJson.errors = [
      this.preProcessByServerError(isProduction ? undefined : exception.stack),
    ];

    response.status(status).json(responseJson);
  }
}
