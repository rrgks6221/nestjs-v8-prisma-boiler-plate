import {
  getParamDecoratorFactory,
  mock,
  mockRequest,
} from '../../test/mock/mock';
import { faker } from '@faker-js/faker';
import { SetModelNameToParam } from '@src/decorators/set-model-name-to-param.decorator';

describe('SetModelNameToParam decorator', () => {
  let factory;
  let ctx;
  let request;

  beforeEach(() => {
    factory = getParamDecoratorFactory(SetModelNameToParam);
    ctx = mock;
    request = mockRequest;
  });

  it('model name 정상 설정', () => {
    const randomStr = faker.datatype.string();

    expect(request.params['model']).toBeUndefined();

    factory(randomStr, ctx);

    expect(request.params['model']).toBe(randomStr);
  });
});
