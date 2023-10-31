import { Module } from '@nestjs/common';
import { ResponseBuilder } from '@src/interceptors/success-interceptor/builder/response.builder';
import { SuccessInterceptor } from '@src/interceptors/success-interceptor/success.interceptor';

@Module({
  providers: [SuccessInterceptor, ResponseBuilder],
})
export class SuccessInterceptorModule {}
