import { Module } from '@nestjs/common';
import { HttpBadRequestExceptionFilter } from '@src/http-exceptions/filters/http-bad-request-exception.filter';
import { HttpForbiddenExceptionFilter } from '@src/http-exceptions/filters/http-forbidden-exception.filter';
import { HttpNestInternalServerErrorExceptionFilter } from '@src/http-exceptions/filters/http-internal-server-error-exception.filter';
import { HttpNotFoundExceptionFilter } from '@src/http-exceptions/filters/http-not-found-exception.filter';
import { HttpPathNotFoundExceptionFilter } from '@src/http-exceptions/filters/http-path-not-found-exception.filter';
import { HttpProcessErrorExceptionFilter } from '@src/http-exceptions/filters/http-process-error-exception.filter';
import { HttpRemainderExceptionFilter } from '@src/http-exceptions/filters/http-remainder-exception.filter';
import { HttpUnauthorizedExceptionFilter } from '@src/http-exceptions/filters/http-unauthorized-exception.filter';
import { HttpExceptionService } from '@src/http-exceptions/services/http-exception.service';

@Module({
  providers: [
    HttpExceptionService,
    HttpBadRequestExceptionFilter,
    HttpUnauthorizedExceptionFilter,
    HttpForbiddenExceptionFilter,
    HttpPathNotFoundExceptionFilter,
    HttpNotFoundExceptionFilter,
    HttpNestInternalServerErrorExceptionFilter,
    HttpProcessErrorExceptionFilter,
    HttpRemainderExceptionFilter,
  ],
})
export class HttpExceptionModule {}
