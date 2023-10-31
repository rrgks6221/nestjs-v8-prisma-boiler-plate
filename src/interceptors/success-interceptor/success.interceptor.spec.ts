import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { Args, ResponseType } from '@src/decorators/set-response.decorator';
import { ResponseBuilder } from '@src/interceptors/builder/response.builder';
import { SuccessInterceptor } from '@src/interceptors/success-interceptor/success.interceptor';
import { mockContext, mockReflector, mockRequest } from '@test/mock/mock';
import { MockClass } from '@test/mock/type';
import { lastValueFrom, of } from 'rxjs';

class MockResponseBuilder implements MockClass<ResponseBuilder> {
  base = jest.fn();
  delete = jest.fn();
  pagination = jest.fn();
}

describe('SuccessInterceptor', () => {
  let interceptor: SuccessInterceptor;
  let mockResponseBuilder: MockResponseBuilder;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SuccessInterceptor,
        {
          provide: Reflector,
          useValue: mockReflector,
        },
        {
          provide: ResponseBuilder,
          useClass: MockResponseBuilder,
        },
      ],
    }).compile();

    interceptor = module.get<SuccessInterceptor>(SuccessInterceptor);
    mockResponseBuilder = module.get(ResponseBuilder);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  describe('intercept', () => {
    let args: Args;

    it('args가 없는 경우', async () => {
      const data = {};
      const next = {
        handle: () => of(data),
      };

      await expect(
        lastValueFrom(interceptor.intercept(mockContext, next)),
      ).resolves.toEqual(data);
    });

    it('delete api type interceptor', async () => {
      const data = 1;
      const next = {
        handle: () => of(data),
      };

      args = {
        type: ResponseType.Delete,
      };
      mockReflector.get.mockReturnValue(args);
      mockResponseBuilder.delete.mockReturnValue(data);

      await expect(
        lastValueFrom(interceptor.intercept(mockContext, next)),
      ).resolves.toEqual(1);
      expect(mockResponseBuilder.delete).toBeCalled();
    });

    it('single action api type interceptor', async () => {
      const data = {};
      const next = {
        handle: () => of(data),
      };

      args = {
        type: ResponseType.Base,
        key: 'key',
      };
      mockReflector.get.mockReturnValue(args);
      mockResponseBuilder.base.mockReturnValue({ key: data });

      await expect(
        lastValueFrom(interceptor.intercept(mockContext, next)),
      ).resolves.toEqual({ key: {} });
      expect(mockResponseBuilder.base).toBeCalled();
    });

    it('pagination api type interceptor', async () => {
      const data: any[] = [];
      const next = {
        handle: () => of(data),
      };

      args = {
        type: ResponseType.Pagination,
        key: 'keys',
      };
      mockReflector.get.mockReturnValue(args);
      mockRequest.query = {
        page: 1,
        pageSize: 20,
      };
      mockResponseBuilder.pagination.mockReturnValue({
        keys: data,
        totalCount: 1,
      });

      await expect(
        lastValueFrom(interceptor.intercept(mockContext, next)),
      ).resolves.toEqual({
        keys: data,
        totalCount: 1,
      });
      expect(mockResponseBuilder.pagination).toBeCalled();
    });

    it('no type', async () => {
      const data = {};
      const next = {
        handle: () => of(data),
      };

      args = {} as any;
      mockReflector.get.mockReturnValue(args);
      mockResponseBuilder.pagination.mockReturnValue({});

      await expect(
        lastValueFrom(interceptor.intercept(mockContext, next)),
      ).resolves.toEqual({});
    });
  });
});
