import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { HttpExceptionService } from '@src/http-exceptions/services/http-exception.service';
import { ExceptionError } from '@src/http-exceptions/types/exception.type';
import { Response } from 'express';

/**
 * 다른 exception filter 가 잡지않는 exception 을 잡는 필터
 */
@Catch(HttpException)
export class HttpRemainderExceptionFilter
  implements ExceptionFilter<HttpException>
{
  constructor(private readonly httpExceptionService: HttpExceptionService) {}

  catch(exception: HttpException, host: ArgumentsHost): void {
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
