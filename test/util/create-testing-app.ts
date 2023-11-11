import { Type } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from '@src/app.service';
import { CoreModule } from '@src/core/core.module';
import { SuccessInterceptorModule } from '@src/interceptors/success-interceptor/success-interceptor.module';

export const createTestingApp = async (ApiModule: Type) => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [ApiModule, CoreModule, SuccessInterceptorModule],
    providers: [AppService],
  }).compile();

  const app = moduleFixture.createNestApplication();

  const appService = app.get<AppService>(AppService);

  appService.setHelmet(app);
  appService.setCookieParser(app);

  appService.setGlobalPipe(app);
  appService.setGlobalInterceptor(app);
  appService.setGlobalFilter(app);

  appService.setGlobalPrefix(app);

  appService.setEnableVersioning(app);

  appService.setEnableShutdownHooks(app);

  await appService.setPrisma(app);

  return app;
};
