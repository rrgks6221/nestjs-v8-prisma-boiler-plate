import { Injectable, NestMiddleware } from '@nestjs/common';
import { ERROR_CODE } from '@src/constants/error-response-code.constant';
import { AppConfigService } from '@src/core/app-config/services/app-config.service';
import { HttpNotFoundException } from '@src/http-exceptions/exceptions/http-not-found.exception';
import { NextFunction, Request, Response } from 'express';

/**
 * production 환경에서 api 를 없는 path 처럼 보이게 하는 middleware
 */
@Injectable()
export class UseDevelopmentMiddleware implements NestMiddleware {
  constructor(private readonly appConfigService: AppConfigService) {}

  use(request: Request, response: Response, next: NextFunction) {
    const isProduction = this.appConfigService.isProduction();
    const { path, method } = request;

    if (isProduction) {
      throw new HttpNotFoundException({
        errorCode: ERROR_CODE.CODE002,
        message: 'Cannot' + ' ' + method + ' ' + path,
      });
    }

    next();
  }
}
