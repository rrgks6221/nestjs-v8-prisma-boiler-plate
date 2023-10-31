import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DEFAULT_PAGE_SIZE } from '@src/constants/constant';
import { ERROR_CODE } from '@src/constants/error-response-code.constant';
import { HttpExceptionHelper } from '@src/core/http-exception-filters/helpers/http-exception.helper';
import { PageDto } from '@src/dtos/page.dto';
import { DeleteResponseDto } from '@src/interceptors/success-interceptor/dto/delete-response.dto';
import { DetailResponseDto } from '@src/interceptors/success-interceptor/dto/detail-response.dto';
import { PaginationResponseDto } from '@src/interceptors/success-interceptor/dto/pagination-response.dto';

interface Res {
  data: unknown;
  key: string;
}

@Injectable()
export class ResponseBuilder {
  detail(res: Res) {
    const { key, data } = res;

    return new DetailResponseDto({
      [key]: data,
    });
  }

  delete(res: Pick<Res, 'data'>) {
    const { data } = res;

    if (typeof data !== 'number' || !Number.isInteger(data)) {
      throw new InternalServerErrorException(
        HttpExceptionHelper.createError({
          code: ERROR_CODE.CODE001,
          message: '서버 에러',
        }),
      );
    }

    return new DeleteResponseDto(data);
  }

  pagination(res: Res, pageDto: PageDto) {
    const { key, data } = res;

    if (!Array.isArray(data)) {
      throw new InternalServerErrorException(
        HttpExceptionHelper.createError({
          code: ERROR_CODE.CODE001,
          message: '서버 에러',
        }),
      );
    }

    const [array, totalCount] = data;

    if (!Array.isArray(array) || typeof totalCount !== 'number') {
      throw new InternalServerErrorException(
        HttpExceptionHelper.createError({
          code: ERROR_CODE.CODE001,
          message: '서버 에러',
        }),
      );
    }

    const currentPage = Number(pageDto.page) || 1;
    const pageSize = Number(pageDto.pageSize) || DEFAULT_PAGE_SIZE;
    const nextPage = pageSize * currentPage < totalCount ? pageSize + 1 : null;
    const hasNext = pageSize * currentPage < totalCount;
    const lastPage = Math.ceil(totalCount / pageSize);

    return new PaginationResponseDto(
      { [key]: array },
      {
        totalCount,
        currentPage,
        pageSize,
        nextPage,
        hasNext,
        lastPage,
      },
    );
  }
}
