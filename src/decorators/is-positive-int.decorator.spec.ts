import { IsPositiveInt } from '@src/decorators/is-positive-int.decorator';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationOptions } from 'class-validator';

describe('IsPositiveIntDecorator', () => {
  let validationOptions: ValidationOptions;

  beforeEach(() => {
    validationOptions = {};
  });

  class Test {
    @IsPositiveInt()
    id: number;
  }

  let test: Test;

  beforeEach(() => {
    test = new Test();
  });

  describe('number type', () => {
    it('int 형 양수가 들어온 경우', async () => {
      test.id = 1;
      const transTest = plainToInstance(Test, test);

      await expect(validate(transTest)).resolves.toHaveLength(0);
    });

    it('float 형 양수가 들어온 경우', async () => {
      test.id = 1.1;
      const transTest = plainToInstance(Test, test);

      await expect(validate(transTest)).resolves.toHaveLength(1);
    });

    it('0 이 들어온 경우', async () => {
      test.id = 0;
      const transTest = plainToInstance(Test, test);

      await expect(validate(transTest)).resolves.toHaveLength(1);
    });

    it('int 형 음수가 들어온 경우', async () => {
      test.id = -1;
      const transTest = plainToInstance(Test, test);

      await expect(validate(transTest)).resolves.toHaveLength(1);
    });

    it('float 형 음수가 들어온 경우', async () => {
      test.id = -1.1;
      const transTest = plainToInstance(Test, test);

      await expect(validate(transTest)).resolves.toHaveLength(1);
    });
  });

  describe('string type', () => {
    it('int 형 양수가 들어온 경우', async () => {
      test.id = '1' as unknown as number;
      const transTest = plainToInstance(Test, test);

      console.log(transTest);

      await expect(validate(transTest)).resolves.toHaveLength(0);
    });

    it('float 형 양수가 들어온 경우', async () => {
      test.id = '1.1' as unknown as number;
      const transTest = plainToInstance(Test, test);

      await expect(validate(transTest)).resolves.toHaveLength(1);
    });

    it('0 이 들어온 경우', async () => {
      test.id = '0' as unknown as number;
      const transTest = plainToInstance(Test, test);

      await expect(validate(transTest)).resolves.toHaveLength(1);
    });

    it('int 형 음수가 들어온 경우', async () => {
      test.id = '-1' as unknown as number;
      const transTest = plainToInstance(Test, test);

      await expect(validate(transTest)).resolves.toHaveLength(1);
    });

    it('float 형 음수가 들어온 경우', async () => {
      test.id = '-1.1' as unknown as number;
      const transTest = plainToInstance(Test, test);

      await expect(validate(transTest)).resolves.toHaveLength(1);
    });

    it('string 안의 값이 numeric 이 아닌 경우', async () => {
      test.id = 'id' as unknown as number;
      const transTest = plainToInstance(Test, test);

      await expect(validate(transTest)).resolves.toHaveLength(1);
    });
  });
});
