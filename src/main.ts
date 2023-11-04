import { NestFactory } from '@nestjs/core';
import { AppModule } from '@src/app.module';
import { AppService } from '@src/app.service';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const appService = app.get<AppService>(AppService);

  appService.setCors(app);
  appService.setHelmet(app);
  appService.setCookieParser(app);

  appService.setGlobalPipe(app);
  appService.setGlobalInterceptor(app);
  appService.setGlobalFilter(app);

  appService.setGlobalPrefix(app);

  appService.setEnableVersioning(app);

  appService.setEnableShutdownHooks(app);

  appService.setSwagger(app);

  await appService.setPrisma(app);

  await appService.startingServer(app);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

bootstrap();
