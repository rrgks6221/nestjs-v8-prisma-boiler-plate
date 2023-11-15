import { ApiOperationOptions } from '@nestjs/swagger';

export type PrismaModel = 'user' | 'post';

export type Target = {
  model?: PrismaModel;
  field?: string;
};

export type ApiOperator<M extends string> = {
  [key in Capitalize<M>]: (
    apiOperationOptions: ApiOperationOptions,
  ) => PropertyDecorator;
};

export interface RestController<BaseResponse> {
  findAllAndCount(...args: unknown[]): Promise<[BaseResponse[], number]>;
  findOne(...args: unknown[]): Promise<BaseResponse>;
  create(...args: unknown[]): Promise<BaseResponse>;
  putUpdate(...args: unknown[]): Promise<BaseResponse>;
  patchUpdate(...args: unknown[]): Promise<BaseResponse>;
  remove(...args: unknown[]): Promise<number>;
}

export interface RestService<M> {
  findAllAndCount(...args: unknown[]): Promise<[M[], number]>;
  findOneOrNotFound(...args: unknown[]): Promise<M>;
  create(...args: unknown[]): Promise<M>;
  putUpdate(...args: unknown[]): Promise<M>;
  patchUpdate(...args: unknown[]): Promise<M>;
  remove(...args: unknown[]): Promise<number>;
}
