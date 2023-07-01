import { faker } from '@faker-js/faker';
import { SetDefaultPageSize } from '@src/decorators/set-default-page-size.decorator';
import { getParamDecoratorFactory, mock, mockRequest } from '@test/mock/mock';

describe('SetDefaultPageSize decorator', () => {
  let factory: any;
  let ctx: any;
  let request: any;

  beforeEach(() => {
    factory = getParamDecoratorFactory(SetDefaultPageSize);
    ctx = mock;
    request = mockRequest;
  });

  it('클라이언트에게 들어온 size 기 있을 경우 설정되면 안됨', () => {
    const randomNumber = faker.datatype.number();

    request.query['pageSize'] = faker.datatype.number();

    expect(typeof request.query['pageSize']).toBe('number');

    factory(randomNumber, ctx);

    expect(request.query['pageSize']).toBe(request.query['pageSize']);
    expect(request.query['pageSize']).not.toBe(randomNumber);
  });

  it('클라이언트에게 들어온 size 기 undefined 일 경우 정상 설정', () => {
    const randomNumber = faker.datatype.number();

    request.query['pageSize'] = undefined;

    expect(request.query['pageSize']).toBeUndefined();

    factory(randomNumber, ctx);

    expect(request.query['pageSize']).toBe(randomNumber);
  });

  it('클라이언트에게 들어온 size 기 null 일 경우 정상 설정', () => {
    const randomNumber = faker.datatype.number();

    request.query['pageSize'] = null;

    expect(request.query['pageSize']).toBeNull();

    factory(randomNumber, ctx);

    expect(request.query['pageSize']).toBe(randomNumber);
  });
});
