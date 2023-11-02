import { HttpStatus } from '@nestjs/common';
import { HttpException } from '@src/http-exceptions/exceptions/http.exception';
import { HttpError } from '@src/http-exceptions/types/exception.type';

interface Log {
  log: string;
}

/**
 * @todo log parameter 추가
 * customize status code 500 error exception
 */
export class HttpInternalServerErrorException extends HttpException {
  constructor(error: HttpError<HttpInternalServerErrorException>) {
    const { errorCode, message } = error;

    super({
      errorCode,
      message,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  }
}
