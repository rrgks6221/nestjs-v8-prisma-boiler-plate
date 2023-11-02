import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { ExceptionResponseDto } from '@src/http-exceptions/dto/exception-response.dto';
import { HttpBadRequestException as HttpForbiddenException } from '@src/http-exceptions/exceptions/http-bad-request.exception';
import { Response } from 'express';

/**
 * 403 번 에러를 잡는 exception filter
 */
@Catch(HttpForbiddenException)
export class HttpForbiddenExceptionFilter
  implements ExceptionFilter<HttpForbiddenException>
{
  catch(exception: HttpForbiddenException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionError = exception.getResponse() as HttpForbiddenException;

    const exceptionResponseDto = new ExceptionResponseDto({
      statusCode: status,
      errorCode: exceptionError.errorCode,
      message: exceptionError.message,
    });

    response.status(status).json(exceptionResponseDto);
  }
}
