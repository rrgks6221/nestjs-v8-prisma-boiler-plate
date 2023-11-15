import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiNoContentResponse,
  ApiOperation,
  ApiOperationOptions,
} from '@nestjs/swagger';
import { AuthController } from '@src/apis/auth/controllers/auth.controller';
import { UserResponseDto } from '@src/apis/users/dto/user-response.dto';
import { ERROR_CODE } from '@src/constants/error-response-code.constant';
import { ApiFailureResponse } from '@src/decorators/swagger/api-failure-response.decorator';
import { DetailResponseDto } from '@src/interceptors/success-interceptor/dto/detail-response.dto';
import { ApiOperator } from '@src/types/type';

export const ApiAuth: ApiOperator<keyof AuthController> = {
  GetProfile: (apiOperationOptions: ApiOperationOptions) => {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      DetailResponseDto.swaggerBuilder(HttpStatus.OK, 'user', UserResponseDto),
      ApiFailureResponse(HttpStatus.UNAUTHORIZED, [ERROR_CODE.CODE004]),
      ApiFailureResponse(HttpStatus.INTERNAL_SERVER_ERROR, [
        ERROR_CODE.CODE001,
      ]),
    );
  },

  SignIn: (apiOperationOptions: ApiOperationOptions) => {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      DetailResponseDto.swaggerBuilder(
        HttpStatus.CREATED,
        'user',
        UserResponseDto,
      ),
      ApiFailureResponse(HttpStatus.BAD_REQUEST, [ERROR_CODE.CODE003]),
      ApiFailureResponse(HttpStatus.UNAUTHORIZED, [ERROR_CODE.CODE004]),
      ApiFailureResponse(HttpStatus.FORBIDDEN, [ERROR_CODE.CODE006]),
      ApiFailureResponse(HttpStatus.INTERNAL_SERVER_ERROR, [
        ERROR_CODE.CODE001,
      ]),
    );
  },

  SignOut: (apiOperationOptions: ApiOperationOptions) => {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      ApiNoContentResponse(),
      ApiFailureResponse(HttpStatus.UNAUTHORIZED, [ERROR_CODE.CODE004]),
      ApiFailureResponse(HttpStatus.INTERNAL_SERVER_ERROR, [
        ERROR_CODE.CODE001,
      ]),
    );
  },

  Refresh: (apiOperationOptions: ApiOperationOptions) => {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      ApiNoContentResponse(),
      ApiFailureResponse(HttpStatus.UNAUTHORIZED, [ERROR_CODE.CODE004]),
      ApiFailureResponse(HttpStatus.INTERNAL_SERVER_ERROR, [
        ERROR_CODE.CODE001,
      ]),
    );
  },

  SetAccessTokenForDevelop: (apiOperationOptions: ApiOperationOptions) => {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      ApiNoContentResponse(),
      ApiFailureResponse(HttpStatus.BAD_REQUEST, [ERROR_CODE.CODE003]),
      ApiFailureResponse(HttpStatus.INTERNAL_SERVER_ERROR, [
        ERROR_CODE.CODE001,
      ]),
    );
  },
};
