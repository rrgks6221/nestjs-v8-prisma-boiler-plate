import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  InternalServerErrorException,
} from '@nestjs/common';
import { Response } from 'express';
import { HttpExceptionHelper } from '@src/core/exceptions/helpers/http-exception.helper';
import { ResponseJson } from '@src/core/exceptions/types/exception.type';
import { ConfigService } from '@nestjs/config';

/**
 * nestJS 메서드를 이용한 500번 에러 를 잡는 exception filter
 * ex) throw new InternalServerErrorException()
 */
@Catch(InternalServerErrorException)
export class HttpNestInternalServerErrorExceptionFilter
  extends HttpExceptionHelper
  implements ExceptionFilter<InternalServerErrorException>
{
  constructor(private readonly configService: ConfigService) {
    super();
  }

  catch(exception: InternalServerErrorException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const isProduction =
      this.configService.get<string>('NODE_ENV') === 'production';

    const responseJson: ResponseJson = this.buildResponseJson(status);

    responseJson.errors = [
      this.preProcessByServerError(isProduction ? undefined : exception.stack),
    ];

    response.status(status).json(responseJson);
  }
}
