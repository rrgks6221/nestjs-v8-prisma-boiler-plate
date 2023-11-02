import { HttpStatus } from '@nestjs/common';
import { HttpException } from '@src/http-exceptions/exceptions/http.exception';
import { HttpError } from '@src/http-exceptions/types/exception.type';

/**
 * status code 403 error exception
 */
export class HttpForbiddenException extends HttpException {
  constructor(error: HttpError<HttpForbiddenException>) {
    const { errorCode, message } = error;

    super({
      errorCode,
      message,
      statusCode: HttpStatus.FORBIDDEN,
    });
  }
}
