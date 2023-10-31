import { faker } from '@faker-js/faker';
import { User } from '@src/decorators/user.decorator';
import { getParamDecoratorFactory, mock, mockRequest } from '@test/mock/mock';

describe(User.name, () => {
  let factory: any;
  let ctx: any;
  let request: any;

  beforeEach(() => {
    factory = getParamDecoratorFactory(User);
    ctx = mock;
    request = mockRequest;
  });

  it('users 의 모든 정보 가져오기', () => {
    const id = faker.datatype.number();
    const name = faker.name.fullName();

    request.user.id = id;
    request.user.name = name;

    const user = factory(undefined, ctx);

    expect(user).toStrictEqual({
      id,
      name,
    });
  });

  it('users 의 특정 프로퍼티 가져오기', () => {
    const id = faker.datatype.number();
    const name = faker.name.fullName();

    request.user.id = id;
    request.user.name = name;

    const user = factory('id', ctx);

    expect(user).toBe(id);
  });

  it('users 의 존재하지 않는 프로퍼티 접근 시 모든 정보를 반환', () => {
    const id = faker.datatype.number();
    const name = faker.name.fullName();

    request.user.id = id;
    request.user.name = name;

    const user = factory('notExistProp', ctx);

    expect(user).toStrictEqual({
      id,
      name,
    });
  });
});
