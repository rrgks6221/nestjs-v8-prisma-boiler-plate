import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { ExceptionResponseDto } from '@src/http-exceptions/dto/exception-response.dto';
import { HttpInternalServerErrorException } from '@src/http-exceptions/exceptions/http-internal-server-error.exception';
import { HttpExceptionService } from '@src/http-exceptions/services/http-exception.service';
import { Response } from 'express';

/**
 * nestJS 메서드를 이용한 500번 에러 를 잡는 exception filter
 * ex) throw new InternalServerErrorException()
 */
@Catch(HttpInternalServerErrorException)
export class HttpNestInternalServerErrorExceptionFilter
  implements ExceptionFilter<HttpInternalServerErrorException>
{
  constructor(private readonly httpExceptionService: HttpExceptionService) {}

  catch(
    exception: HttpInternalServerErrorException,
    host: ArgumentsHost,
  ): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionError =
      exception.getResponse() as HttpInternalServerErrorException;

    const exceptionResponseDto = new ExceptionResponseDto({
      statusCode: status,
      errorCode: exceptionError.errorCode,
      message: exceptionError.message,
      stack: this.httpExceptionService.getErrorStack(exception),
    });

    response.status(status).json(exceptionResponseDto);
  }
}
