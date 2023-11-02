import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from '@src/app.module';
import { ERROR_CODE } from '@src/constants/error-response-code.constant';
import { ENV_KEY } from '@src/core/app-config/constants/app-config.constant';
import { AppConfigService } from '@src/core/app-config/services/app-config.service';
import { PrismaService } from '@src/core/prisma/prisma.service';
import { HttpBadRequestException } from '@src/http-exceptions/exceptions/http-bad-request.exception';
import { HttpBadRequestExceptionFilter } from '@src/http-exceptions/filters/http-bad-request-exception.filter';
import { HttpForbiddenExceptionFilter } from '@src/http-exceptions/filters/http-forbidden-exception.filter';
import { HttpNestInternalServerErrorExceptionFilter } from '@src/http-exceptions/filters/http-internal-server-error-exception.filter';
import { HttpNotFoundExceptionFilter } from '@src/http-exceptions/filters/http-not-found-exception.filter';
import { HttpPathNotFoundExceptionFilter } from '@src/http-exceptions/filters/http-path-not-found-exception.filter';
import { HttpProcessErrorExceptionFilter } from '@src/http-exceptions/filters/http-process-error-exception.filter';
import { HttpRemainderExceptionFilter } from '@src/http-exceptions/filters/http-remainder-exception.filter';
import { HttpUnauthorizedExceptionFilter } from '@src/http-exceptions/filters/http-unauthorized-exception.filter';
import { SuccessInterceptor } from '@src/interceptors/success-interceptor/success.interceptor';
import { useContainer, ValidationError } from 'class-validator';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const appConfigService = app.get<AppConfigService>(AppConfigService);
  const isProduction = appConfigService.isProduction();

  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  app.use(helmet());
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      stopAtFirstError: true,
      whitelist: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const messages = errors.flatMap((error) => {
          return Object.values(error.constraints || {});
        });

        throw new HttpBadRequestException({
          errorCode: ERROR_CODE.CODE003,
          message: messages[0],
        });
      },
    }),
  );
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
    app.get(SuccessInterceptor),
  );

  app.useGlobalFilters(
    app.get(HttpProcessErrorExceptionFilter),
    app.get(HttpRemainderExceptionFilter),
    app.get(HttpNestInternalServerErrorExceptionFilter),
    app.get(HttpNotFoundExceptionFilter),
    app.get(HttpPathNotFoundExceptionFilter),
    app.get(HttpForbiddenExceptionFilter),
    app.get(HttpUnauthorizedExceptionFilter),
    app.get(HttpBadRequestExceptionFilter),
  );

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  // Starts listening for shutdown hooks
  if (isProduction) {
    app.enableShutdownHooks();

    app.enableCors({ origin: ['domain'], credentials: true });
  } else {
    app.enableCors({ origin: true, credentials: true });

    const config = new DocumentBuilder()
      .setTitle('nestjs boiler plate')
      .setDescription('nestjs boiler plate')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('api-docs', app, document);
  }

  const PORT = appConfigService.get<number>(ENV_KEY.PORT);

  await app.listen(PORT);

  console.info(`server listening on port ${PORT}`);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

bootstrap();
