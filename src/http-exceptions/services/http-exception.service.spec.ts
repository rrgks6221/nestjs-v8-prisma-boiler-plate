import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppConfigService } from '@src/core/app-config/services/app-config.service';
import { ExceptionResponseDto } from '@src/http-exceptions/dto/exception-response.dto';
import { HttpExceptionService } from '@src/http-exceptions/services/http-exception.service';
import { MockAppConfigService } from '@test/mock/services.mock';

describe(HttpExceptionService.name, () => {
  let service: HttpExceptionService;
  let mockAppConfigService: MockAppConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HttpExceptionService,
        {
          provide: AppConfigService,
          useClass: MockAppConfigService,
        },
      ],
    }).compile();

    service = module.get<HttpExceptionService>(HttpExceptionService);
    mockAppConfigService = module.get(AppConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe(HttpExceptionService.prototype.buildResponseJson.name, () => {
    let statusCode: number;
    let exceptionError: any;

    beforeEach(() => {
      statusCode = NaN;
      exceptionError = {
        stack: undefined,
      };
    });

    it('when the status code less than 500', () => {
      statusCode = HttpStatus.I_AM_A_TEAPOT;
      exceptionError = {
        stack: 'error stack',
      };

      mockAppConfigService.isProduction.mockReturnValue(true);

      const responseJson = service.buildResponseJson(
        statusCode,
        exceptionError,
      );

      expect(responseJson).toBeInstanceOf(ExceptionResponseDto);
      expect(responseJson.stack).toBeUndefined();
    });

    it('when the not production environment', () => {
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      exceptionError = {
        stack: 'error stack',
      };

      mockAppConfigService.isProduction.mockReturnValue(false);

      const responseJson = service.buildResponseJson(
        statusCode,
        exceptionError,
      );

      expect(responseJson).toBeInstanceOf(ExceptionResponseDto);
      expect(responseJson.stack).toBeUndefined();
    });

    it('when the production environment and status code grater than or equal 500', () => {
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      exceptionError = {
        stack: 'error stack',
      };

      mockAppConfigService.isProduction.mockReturnValue(true);

      const responseJson = service.buildResponseJson(
        statusCode,
        exceptionError,
      );

      expect(responseJson).toBeInstanceOf(ExceptionResponseDto);
      expect(responseJson.stack).toBe(exceptionError.stack);
    });
  });
});
