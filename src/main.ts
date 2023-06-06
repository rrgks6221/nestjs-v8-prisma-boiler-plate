import {
  BadRequestException,
  ClassSerializerInterceptor,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from '@src/app.module';
import { ERROR_CODE } from '@src/constants/error-response-code.constant';
import { ENV_KEY } from '@src/core/app-config/constants/api-config.constant';
import { AppConfigService } from '@src/core/app-config/services/app-config.service';
import { HttpBadRequestExceptionFilter } from '@src/core/exception/filters/http-bad-request-exception.filter';
import { HttpNestInternalServerErrorExceptionFilter } from '@src/core/exception/filters/http-nest-Internal-server-error-exception.filter';
import { HttpNodeInternalServerErrorExceptionFilter } from '@src/core/exception/filters/http-node-internal-server-error-exception.filter';
import { HttpNotFoundExceptionFilter } from '@src/core/exception/filters/http-not-found-exception.filter';
import { HttpRemainderExceptionFilter } from '@src/core/exception/filters/http-remainder-exception.filter';
import { HttpExceptionHelper } from '@src/core/exception/helpers/http-exception.helper';
import { PrismaService } from '@src/core/prisma/prisma.service';
import { SuccessInterceptor } from '@src/interceptors/success.interceptor';
import { useContainer, ValidationError } from 'class-validator';
import helmet from 'helmet';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const appConfigService = app.get<AppConfigService>(AppConfigService);
  const isProduction = appConfigService.isProduction();

  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  app.use(helmet());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      stopAtFirstError: true,
      whitelist: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const messages = errors.flatMap((error) => {
          return Object.values(error.constraints || {});
        });

        throw new BadRequestException(
          HttpExceptionHelper.createError({
            code: ERROR_CODE.CODE003,
            messages,
          }),
        );
      },
    }),
  );
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
    new SuccessInterceptor(app.get(Reflector)),
  );

  app.useGlobalFilters(
    app.get(HttpNodeInternalServerErrorExceptionFilter),
    app.get(HttpRemainderExceptionFilter),
    app.get(HttpNestInternalServerErrorExceptionFilter),
    app.get(HttpNotFoundExceptionFilter),
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
      .setTitle('title example')
      .setDescription('description example')
      .setVersion('1.0')
      .addTag('tag example')
      .addBearerAuth()
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
