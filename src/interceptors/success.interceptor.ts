import {
  CallHandler,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DEFAULT_PAGE_SIZE } from '@src/constants/constant';
import {
  Args,
  ResponseType,
  SET_RESPONSE,
} from '@src/decorators/set-response.decorator';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class SuccessInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: unknown) => {
        const args = this.reflector.get<Args | undefined>(
          SET_RESPONSE,
          context.getHandler(),
        );

        // args 가 없으면 해당 인터셉터를 사용하지 않는다고 판별한다.
        if (!args) return data;

        const { type, key } = args;

        // 단일 action api 에 대한 response
        if (type === ResponseType.Base) {
          return this.buildBaseResponse(data, key);
        }

        // pagination api response
        if (type === ResponseType.Pagination) {
          const request = context.switchToHttp().getRequest();
          const { query } = request;

          return this.buildPaginationResponse(data, query, key);
        }

        // delete 관련된 api response
        if (type === ResponseType.Delete) {
          return this.buildDeleteResponse(data);
        }
      }),
    );
  }

  private buildBaseResponse(data: unknown, key?: string) {
    if (!key) {
      throw new InternalServerErrorException();
    }

    return {
      [key]: data,
    };
  }

  private buildPaginationResponse(
    data: unknown,
    query: Record<string, string>,
    key?: string,
  ) {
    if (!Array.isArray(data)) {
      throw new InternalServerErrorException();
    }
    if (!key) {
      throw new InternalServerErrorException();
    }

    const page = Number(query.page) || 1;
    const pageSize = Number(query.pageSize) || DEFAULT_PAGE_SIZE;

    const [array, totalCount] = data;

    return {
      [key]: array,
      totalCount,
      currentPage: page,
      nextPage: pageSize * page < totalCount ? page + 1 : null,
      pageSize,
      hasNext: pageSize * page < totalCount,
      lastPage: Math.ceil(totalCount / pageSize),
    };
  }

  private buildDeleteResponse(data: unknown) {
    if (!Number.isInteger(data)) {
      throw new InternalServerErrorException();
    }

    return {
      count: data,
    };
  }
}
