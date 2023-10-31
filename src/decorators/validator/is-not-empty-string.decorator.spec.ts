import { faker } from '@faker-js/faker';
import { IsNotEmptyString } from '@src/decorators/validator/is-not-empty-string.decorator';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

describe(IsNotEmptyString.name, () => {
  let randomString;

  class TestClass {
    @IsNotEmptyString()
    test: unknown;
  }

  it('비어있지 않은 string 이 들어왔을 경우', async () => {
    randomString = faker.datatype.string();

    const validation = plainToInstance(TestClass, { test: randomString });

    const errors = await validate(validation);

    expect(errors).toHaveLength(0);
    expect(randomString).not.toHaveLength(0);
  });

  it('공백을 포함한 비어있지 않은 string 이 들어왔을 경우', async () => {
    randomString = faker.datatype.string();
    randomString = ' ' + randomString + ' ';

    const validation = plainToInstance(TestClass, { test: randomString });

    const errors = await validate(validation);

    expect(errors).toHaveLength(0);
    expect(randomString).not.toHaveLength(0);
  });

  it('빈 string 이 들어왔을 경우', async () => {
    randomString = '';

    const validation = plainToInstance(TestClass, { test: randomString });

    const errors = await validate(validation);

    expect(errors).toHaveLength(1);
    expect(randomString).toHaveLength(0);
  });

  it('공백만 존재하는 string 이 들어왔을 경우', async () => {
    randomString = '     ';

    const trimRandomString = randomString.trim();

    const validation = plainToInstance(TestClass, { test: randomString });

    const errors = await validate(validation);

    expect(errors).toHaveLength(1);
    expect(randomString).not.toHaveLength(0);
    expect(trimRandomString).toHaveLength(0);
  });

  it('string 타입이 아닌 다른 타입이 들어왔을 경우 이 들어왔을 경우', async () => {
    const NotStringType = faker.datatype.number();

    const validation = plainToInstance(TestClass, { test: NotStringType });

    const errors = await validate(validation);

    expect(errors).toHaveLength(0);
    expect(typeof NotStringType).not.toBe('string');
  });
});
