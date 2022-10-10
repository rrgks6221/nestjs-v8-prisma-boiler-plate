import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';
import { SetDefaultPageSize } from '@src/decorators/set-default-page-size.decorator';
import { faker } from '@faker-js/faker';

describe('SetDefaultPageSize decorator', () => {
  const factory = getParamDecoratorFactory(SetDefaultPageSize);
  let request = {
    query: {},
  };
  let ctx = {
    switchToHttp() {
      return this;
    },
    getRequest() {
      return request;
    },
  };

  function getParamDecoratorFactory(decorator) {
    class Test {
      public test(@decorator() value) {
        return;
      }
    }

    const args = Reflect.getMetadata(ROUTE_ARGS_METADATA, Test, 'test');
    return args[Object.keys(args)[0]].factory;
  }

  beforeEach(() => {
    request = {
      query: {},
    };
    ctx = {
      switchToHttp() {
        return this;
      },
      getRequest() {
        return request;
      },
    };
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
