import { Module } from '@nestjs/common';
import { HttpBadRequestExceptionFilter } from '@src/http-exceptions/filters/http-bad-request-exception.filter';
import { HttpNestInternalServerErrorExceptionFilter } from '@src/http-exceptions/filters/http-nest-Internal-server-error-exception.filter';
import { HttpNodeInternalServerErrorExceptionFilter } from '@src/http-exceptions/filters/http-node-internal-server-error-exception.filter';
import { HttpNotFoundExceptionFilter } from '@src/http-exceptions/filters/http-not-found-exception.filter';
import { HttpRemainderExceptionFilter } from '@src/http-exceptions/filters/http-remainder-exception.filter';
import { HttpExceptionService } from '@src/http-exceptions/services/http-exception.service';

@Module({
  providers: [
    HttpExceptionService,
    HttpBadRequestExceptionFilter,
    HttpNotFoundExceptionFilter,
    HttpNestInternalServerErrorExceptionFilter,
    HttpNodeInternalServerErrorExceptionFilter,
    HttpRemainderExceptionFilter,
  ],
})
export class HttpExceptionModule {}
