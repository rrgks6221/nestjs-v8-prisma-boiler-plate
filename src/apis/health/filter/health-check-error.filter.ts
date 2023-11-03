import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  ServiceUnavailableException,
} from '@nestjs/common';
import { Response } from 'express';

/**
 * for health check api exception filter
 * @nestjs/terminus 의 HealthCheckError 가 내부적으로 ServiceUnavailableException 을 사용
 */
@Catch()
export class HealthCheckErrorFilter
  implements ExceptionFilter<ServiceUnavailableException>
{
  catch(exception: ServiceUnavailableException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = exception.getStatus();
    const responseJson = exception.getResponse();

    response.status(status).json(responseJson);
  }
}
