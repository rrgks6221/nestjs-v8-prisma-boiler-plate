import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { apiModules } from '@src/apis';
import { CoreModule } from '@src/core/core.module';
import { SuccessInterceptorModule } from '@src/interceptors/success-interceptor/success-interceptor.module';
import { LoggerMiddleware } from '@src/middlewares/logger.middleware';

@Module({
  imports: [CoreModule, ...apiModules, SuccessInterceptorModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
