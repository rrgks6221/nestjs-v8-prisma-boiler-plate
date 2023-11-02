import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { ExceptionResponseDto } from '@src/http-exceptions/dto/exception-response.dto';
import { HttpBadRequestException as HttpUnauthorizedException } from '@src/http-exceptions/exceptions/http-bad-request.exception';
import { Response } from 'express';

/**
 * 401 번 에러를 잡는 exception filter
 */
@Catch(HttpUnauthorizedException)
export class HttpUnauthorizedExceptionFilter
  implements ExceptionFilter<HttpUnauthorizedException>
{
  catch(exception: HttpUnauthorizedException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionError = exception.getResponse() as HttpUnauthorizedException;

    const exceptionResponseDto = new ExceptionResponseDto({
      statusCode: status,
      errorCode: exceptionError.errorCode,
      message: exceptionError.message,
    });

    response.status(status).json(exceptionResponseDto);
  }
}
