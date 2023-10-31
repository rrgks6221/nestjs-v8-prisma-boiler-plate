import { InternalServerErrorException } from '@nestjs/common';
import { SortOrder } from '@src/constants/enum';
import { CsvToOrderBy } from '@src/decorators/transformer/csv-to-order-by.decorator';
import { plainToInstance } from 'class-transformer';

describe(CsvToOrderBy.name, () => {
  const allowFields: string[] = ['id', 'createdAt'];

  class Test {
    @CsvToOrderBy(allowFields)
    orderBy: unknown;
  }

  it('string 타입이 들어오지 않은 경우', () => {
    expect(() => {
      plainToInstance(Test, { orderBy: 1 });
    }).toThrowError(new InternalServerErrorException());
  });

  it('empty string 이 들어온경우 기본값 안줌', () => {
    const test = plainToInstance(Test, { orderBy: '' });

    expect(test.orderBy).toStrictEqual([{ id: 'desc' }]);
  });

  it('허용하지 않은 필드만 들어온 경우 기본값 줌', () => {
    class Test {
      @CsvToOrderBy(allowFields, [{ createdAt: SortOrder.Asc }])
      orderBy: unknown;
    }
    const test = plainToInstance(Test, { orderBy: 'deletedAt,updatedAt' });

    expect(test.orderBy).toStrictEqual([{ createdAt: 'asc' }]);
  });

  it('모두 오름차순', () => {
    const test = plainToInstance(Test, { orderBy: 'id,createdAt' });

    expect(test.orderBy).toStrictEqual([
      {
        id: 'desc',
      },
      {
        createdAt: 'desc',
      },
    ]);
  });

  it('모두 내림차순', () => {
    const test = plainToInstance(Test, { orderBy: '-id,-createdAt' });

    expect(test.orderBy).toStrictEqual([
      {
        id: 'asc',
      },
      {
        createdAt: 'asc',
      },
    ]);
  });

  it('오름차순 내림차순 조합', () => {
    const test = plainToInstance(Test, { orderBy: '-id,createdAt' });

    expect(test.orderBy).toStrictEqual([
      {
        id: 'asc',
      },
      {
        createdAt: 'desc',
      },
    ]);
  });

  it('허용하지 않은 필드가 들어온 경우', () => {
    const test = plainToInstance(Test, { orderBy: 'id,deletedAt' });

    expect(test.orderBy).toStrictEqual([
      {
        id: 'desc',
      },
    ]);
  });
});
