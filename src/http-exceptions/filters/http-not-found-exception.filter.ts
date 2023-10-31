import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { ERROR_CODE } from '@src/constants/error-response-code.constant';
import { HttpExceptionService } from '@src/http-exceptions/services/http-exception.service';
import { ExceptionError } from '@src/http-exceptions/types/exception.type';
import { Response } from 'express';

/**
 * 404 번 에러를 잡는 exception filter
 */
@Catch(NotFoundException)
export class HttpNotFoundExceptionFilter
  implements ExceptionFilter<NotFoundException>
{
  constructor(private readonly httpExceptionService: HttpExceptionService) {}

  catch(exception: NotFoundException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const method = ctx.getRequest().method;
    const path = ctx.getRequest().path;
    let exceptionError: ExceptionError;

    const err = exception.getResponse() as {
      statusCode: HttpStatus.NOT_FOUND;
      message: string;
      error: 'Not Found';
    };

    // path not found
    if (/^\bCannot (GET|POST|PATCH|PUT|DELETE)\b/.test(err.message)) {
      exceptionError = HttpExceptionService.createError({
        code: ERROR_CODE.CODE002,
        message: method + ' ' + path + ' ' + 'not found',
      });
    } else {
      exceptionError = exception.getResponse() as ExceptionError;
    }

    const responseJson = this.httpExceptionService.buildResponseJson(
      status,
      exceptionError,
    );

    response.status(status).json(responseJson);
  }
}
