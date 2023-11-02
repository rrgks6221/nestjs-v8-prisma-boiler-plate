import { Test, TestingModule } from '@nestjs/testing';
import { PageDto } from '@src/dtos/page.dto';
import { HttpInternalServerErrorException } from '@src/http-exceptions/exceptions/http-internal-server-error.exception';
import { ResponseBuilder } from '@src/interceptors/success-interceptor/builder/response.builder';
import { DeleteResponseDto } from '@src/interceptors/success-interceptor/dto/delete-response.dto';
import { DetailResponseDto } from '@src/interceptors/success-interceptor/dto/detail-response.dto';
import { PaginationResponseDto } from '@src/interceptors/success-interceptor/dto/pagination-response.dto';

describe(ResponseBuilder.name, () => {
  let builder: ResponseBuilder;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResponseBuilder],
    }).compile();

    builder = module.get<ResponseBuilder>(ResponseBuilder);
  });

  describe(ResponseBuilder.prototype.detail.name, () => {
    let res: { key: string; data: any };

    beforeEach(() => {
      res = {} as any;
    });

    it('detail response object build', () => {
      (res.key = 'key'), (res.data = {});

      expect(builder.detail(res)).toBeInstanceOf(DetailResponseDto);
    });
  });

  describe(ResponseBuilder.prototype.delete.name, () => {
    let res: { data: any };

    beforeEach(() => {
      res = {} as any;
    });

    it('data is not number type', () => {
      res.data = 'data';

      expect(() => builder.delete(res)).toThrowError(
        HttpInternalServerErrorException,
      );
    });

    it('data is not integer format', () => {
      res.data = 1.1;

      expect(() => builder.delete(res)).toThrowError(
        HttpInternalServerErrorException,
      );
    });

    it('delete response object build', () => {
      res.data = 1;

      expect(builder.delete(res)).toBeInstanceOf(DeleteResponseDto);
    });
  });

  describe(ResponseBuilder.prototype.pagination.name, () => {
    let res: { key: string; data: any };
    let pageDto: PageDto;

    beforeEach(() => {
      res = {} as any;
      pageDto = new PageDto();
    });

    it('data is not array type', () => {
      res.key = 'key';
      res.data = 'data';

      expect(() => builder.pagination(res, pageDto)).toThrowError(
        HttpInternalServerErrorException,
      );
    });

    it('array object is not array type', () => {
      res.key = 'key';
      res.data = ['arrayObject'];

      expect(() => builder.pagination(res, pageDto)).toThrowError(
        HttpInternalServerErrorException,
      );
    });

    it('totalCount is not number type', () => {
      res.key = 'key';
      res.data = [[], 'totalCount'];

      expect(() => builder.pagination(res, pageDto)).toThrowError(
        HttpInternalServerErrorException,
      );
    });

    it('totalCount is not integer format', () => {
      res.key = 'key';
      res.data = [[], 1.1];

      expect(() => builder.pagination(res, pageDto)).toThrowError(
        HttpInternalServerErrorException,
      );
    });

    it('pagination response object build', () => {
      res.key = 'key';
      res.data = [[], 1];

      pageDto.page = 1;
      pageDto.pageSize = 20;

      expect(builder.pagination(res, pageDto)).toBeInstanceOf(
        PaginationResponseDto,
      );
    });
  });
});
