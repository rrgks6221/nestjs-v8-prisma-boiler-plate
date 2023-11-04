import {
  ClassSerializerInterceptor,
  INestApplication,
  Injectable,
  RequestMethod,
  ValidationError,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ERROR_CODE } from '@src/constants/error-response-code.constant';
import { ENV_KEY } from '@src/core/app-config/constants/app-config.constant';
import { AppConfigService } from '@src/core/app-config/services/app-config.service';
import { PrismaService } from '@src/core/prisma/prisma.service';
import { HttpBadRequestException } from '@src/http-exceptions/exceptions/http-bad-request.exception';
import { HttpBadRequestExceptionFilter } from '@src/http-exceptions/filters/http-bad-request-exception.filter';
import { HttpForbiddenExceptionFilter } from '@src/http-exceptions/filters/http-forbidden-exception.filter';
import { HttpInternalServerErrorExceptionFilter } from '@src/http-exceptions/filters/http-internal-server-error-exception.filter';
import { HttpNotFoundExceptionFilter } from '@src/http-exceptions/filters/http-not-found-exception.filter';
import { HttpPathNotFoundExceptionFilter } from '@src/http-exceptions/filters/http-path-not-found-exception.filter';
import { HttpProcessErrorExceptionFilter } from '@src/http-exceptions/filters/http-process-error-exception.filter';
import { HttpRemainderExceptionFilter } from '@src/http-exceptions/filters/http-remainder-exception.filter';
import { HttpUnauthorizedExceptionFilter } from '@src/http-exceptions/filters/http-unauthorized-exception.filter';
import { SuccessInterceptor } from '@src/interceptors/success-interceptor/success.interceptor';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

@Injectable()
export class AppService {
  setCors(app: INestApplication): void {
    const appConfigService = app.get<AppConfigService>(AppConfigService);

    if (!appConfigService.isProduction()) {
      return;
    }

    app.enableCors({ origin: ['domain'], credentials: true });
  }

  setHelmet(app: INestApplication): void {
    app.use(helmet());
  }

  setCookieParser(app: INestApplication): void {
    app.use(cookieParser());
  }

  setGlobalPipe(app: INestApplication): void {
    const exceptionFactory = (errors: ValidationError[]): void => {
      const messages = errors.flatMap((error) => {
        return Object.values(error.constraints || {});
      });

      throw new HttpBadRequestException({
        errorCode: ERROR_CODE.CODE003,
        message: messages[0],
      });
    };

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        stopAtFirstError: true,
        whitelist: true,
        exceptionFactory,
      }),
    );
  }

  setGlobalInterceptor(app: INestApplication): void {
    app.useGlobalInterceptors(
      new ClassSerializerInterceptor(app.get(Reflector)),
      app.get(SuccessInterceptor),
    );
  }

  setGlobalFilter(app: INestApplication): void {
    app.useGlobalFilters(
      app.get(HttpProcessErrorExceptionFilter),
      app.get(HttpRemainderExceptionFilter),
      app.get(HttpInternalServerErrorExceptionFilter),
      app.get(HttpNotFoundExceptionFilter),
      app.get(HttpPathNotFoundExceptionFilter),
      app.get(HttpForbiddenExceptionFilter),
      app.get(HttpUnauthorizedExceptionFilter),
      app.get(HttpBadRequestExceptionFilter),
    );
  }

  setGlobalPrefix(app: INestApplication): void {
    app.setGlobalPrefix('api', {
      exclude: [
        {
          path: 'health',
          method: RequestMethod.ALL,
        },
      ],
    });
  }

  setEnableVersioning(app: INestApplication): void {
    app.enableVersioning({
      type: VersioningType.URI,
    });
  }

  async setEnableShutdownHooks(app: INestApplication): Promise<void> {
    const appConfigService = app.get<AppConfigService>(AppConfigService);

    if (!appConfigService.isProduction()) {
      return;
    }

    app.enableShutdownHooks();
  }

  setSwagger(app: INestApplication): void {
    const appConfigService = app.get<AppConfigService>(AppConfigService);

    if (appConfigService.isProduction()) {
      return;
    }

    const config = new DocumentBuilder()
      .setTitle('nestjs boiler plate')
      .setDescription('nestjs boiler plate')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('api-docs', app, document);
  }

  async setPrisma(app: INestApplication): Promise<void> {
    const prismaService = app.get<PrismaService>(PrismaService);

    await prismaService.enableShutdownHooks(app);
  }

  async startingServer(app: INestApplication): Promise<void> {
    const appConfigService = app.get<AppConfigService>(AppConfigService);

    const PORT = appConfigService.get<number>(ENV_KEY.PORT);

    await app.listen(PORT);

    console.info(`server listening on port ${PORT}`);
  }
}
