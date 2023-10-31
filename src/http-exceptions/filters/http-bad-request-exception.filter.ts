import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
} from '@nestjs/common';
import { HttpExceptionService } from '@src/http-exceptions/services/http-exception.service';
import { ExceptionError } from '@src/http-exceptions/types/exception.type';
import { Response } from 'express';

/**
 * 400 번 에러를 잡는 exception filter
 */
@Catch(BadRequestException)
export class HttpBadRequestExceptionFilter
  implements ExceptionFilter<BadRequestException>
{
  constructor(private readonly httpExceptionService: HttpExceptionService) {}

  catch(exception: BadRequestException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionError = exception.getResponse() as ExceptionError;

    const responseJson = this.httpExceptionService.buildResponseJson(
      status,
      exceptionError,
    );

    response.status(status).json(responseJson);
  }
}
