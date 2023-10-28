export type PrismaModel = 'user' | 'post';

export type Target = {
  model?: PrismaModel;
  field?: string;
};

export interface BaseController<Model, BaseResponse> {
  findAllAndCount(...args: unknown[]): Promise<[Model[], number]>;
  findOne(...args: unknown[]): Promise<BaseResponse>;
  create(...args: unknown[]): Promise<BaseResponse>;
  putUpdate(...args: unknown[]): Promise<BaseResponse>;
  patchUpdate(...args: unknown[]): Promise<BaseResponse>;
  remove(...args: unknown[]): Promise<number>;
}

export interface BaseService<M> {
  findAllAndCount(...args: unknown[]): Promise<[M[], number]>;
  findOneOrNotFound(...args: unknown[]): Promise<M>;
  create(...args: unknown[]): Promise<M>;
  putUpdate(...args: unknown[]): Promise<M>;
  patchUpdate(...args: unknown[]): Promise<M>;
  remove(...args: unknown[]): Promise<number>;
}
