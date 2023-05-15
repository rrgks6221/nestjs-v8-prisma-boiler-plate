import { Module } from '@nestjs/common';
import { HttpBadRequestExceptionFilter } from '@src/core/exceptions/filters/http-bad-request-exception.filter';
import { HttpNotFoundExceptionFilter } from '@src/core/exceptions/filters/http-not-found-exception.filter';
import { HttpNodeInternalServerErrorExceptionFilter } from '@src/core/exceptions/filters/http-node-internal-server-error-exception.filter';
import { HttpNestInternalServerErrorExceptionFilter } from '@src/core/exceptions/filters/http-nest-Internal-server-error-exception.filter';
import { HttpRemainderExceptionFilter } from '@src/core/exceptions/filters/http-remainder-exception.filter';

@Module({
  providers: [
    HttpBadRequestExceptionFilter,
    HttpNotFoundExceptionFilter,
    HttpNestInternalServerErrorExceptionFilter,
    HttpNodeInternalServerErrorExceptionFilter,
    HttpRemainderExceptionFilter,
  ],
})
export class ExceptionFiltersModule {}
