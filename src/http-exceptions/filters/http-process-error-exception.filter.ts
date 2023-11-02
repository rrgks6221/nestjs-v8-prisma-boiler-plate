import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { ERROR_CODE } from '@src/constants/error-response-code.constant';
import { ExceptionResponseDto } from '@src/http-exceptions/dto/exception-response.dto';
import { HttpProcessErrorException } from '@src/http-exceptions/exceptions/http-process-error.exception';
import { HttpExceptionService } from '@src/http-exceptions/services/http-exception.service';
import { Response } from 'express';

/**
 * node  process error exception
 * ex) ReferenceError, TypeError etc
 */
@Catch()
export class HttpProcessErrorExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpExceptionService: HttpExceptionService) {}

  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    const exceptionError = {
      errorCode: ERROR_CODE.CODE001,
      message: 'server error',
    } as HttpProcessErrorException;

    const exceptionResponseDto = new ExceptionResponseDto({
      statusCode: status,
      errorCode: exceptionError.errorCode,
      message: exceptionError.message,
      stack: this.httpExceptionService.getErrorStack(exception),
    });

    response.status(status).json(exceptionResponseDto);
  }
}
