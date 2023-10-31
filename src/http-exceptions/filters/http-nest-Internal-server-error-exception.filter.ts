import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  InternalServerErrorException,
} from '@nestjs/common';
import { AppConfigService } from '@src/core/app-config/services/app-config.service';
import { HttpExceptionService } from '@src/http-exceptions/services/http-exception.service';
import { ExceptionError } from '@src/http-exceptions/types/exception.type';
import { Response } from 'express';

/**
 * nestJS 메서드를 이용한 500번 에러 를 잡는 exception filter
 * ex) throw new InternalServerErrorException()
 */
@Catch(InternalServerErrorException)
export class HttpNestInternalServerErrorExceptionFilter
  implements ExceptionFilter<InternalServerErrorException>
{
  constructor(
    private readonly appConfigService: AppConfigService,
    private readonly httpExceptionService: HttpExceptionService,
  ) {}

  catch(exception: InternalServerErrorException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionError = exception.getResponse() as ExceptionError;

    const isProduction = this.appConfigService.isProduction();

    const responseJson = this.httpExceptionService.buildResponseJson(
      status,
      exceptionError,
    );
    responseJson.stack = isProduction ? undefined : exception.stack;

    response.status(status).json(responseJson);
  }
}
