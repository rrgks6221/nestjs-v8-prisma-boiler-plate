export type PrismaModel = 'user' | 'post';

export type Target = {
  model?: PrismaModel;
  field?: string;
};

export interface BaseController<M, R> {
  findAllAndCount?(...args: unknown[]): Promise<[M[], number]>;
  findOne?(...args: unknown[]): Promise<R>;
  create?(...args: unknown[]): Promise<R>;
  putUpdate?(...args: unknown[]): Promise<R>;
  patchUpdate?(...args: unknown[]): Promise<R>;
  remove?(...args: unknown[]): Promise<number>;
}

export interface BaseService<M, R> {
  findAllAndCount?(...args: unknown[]): Promise<[M[], number]>;
  findOne?(...args: unknown[]): Promise<R>;
  create?(...args: unknown[]): Promise<R>;
  putUpdate?(...args: unknown[]): Promise<R>;
  patchUpdate?(...args: unknown[]): Promise<R>;
  remove?(...args: unknown[]): Promise<number>;
}
