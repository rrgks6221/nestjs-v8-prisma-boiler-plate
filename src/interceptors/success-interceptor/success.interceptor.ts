import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  Args,
  ResponseType,
  SET_RESPONSE,
} from '@src/decorators/set-response.decorator';
import { PageDto } from '@src/dtos/page.dto';
import { ResponseBuilder } from '@src/interceptors/builder/response.builder';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class SuccessInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly responseBuilder: ResponseBuilder,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: unknown) => {
        const args = this.reflector.get<Args | undefined>(
          SET_RESPONSE,
          context.getHandler(),
        );

        // args 가 없으면 해당 인터셉터를 사용하지 않는다고 판별한다.
        if (!args) return data;

        // delete 관련된 api response
        if (args.type === ResponseType.Delete) {
          return this.responseBuilder.delete({ data });
        }

        const { type, key } = args;

        // 단일 action api 에 대한 response
        if (type === ResponseType.Base) {
          return this.responseBuilder.base({ data, key });
        }

        // pagination api response
        if (type === ResponseType.Pagination) {
          const request = context.switchToHttp().getRequest();
          const { query } = request;
          const { page, pageSize }: PageDto = query;

          return this.responseBuilder.pagination(
            { data, key },
            { page, pageSize },
          );
        }

        return data;
      }),
    );
  }
}
