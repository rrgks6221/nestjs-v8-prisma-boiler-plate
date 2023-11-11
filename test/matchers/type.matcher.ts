import { EntryMatcher } from '@test/matchers/entry-matcher';

interface Options {
  nullable: boolean;
}

export class TypeMatcher extends EntryMatcher {
  toBeNumber(
    receive: unknown,
    options: Options = { nullable: false },
  ): jest.CustomMatcherResult {
    const { nullable } = options;
    let pass = false;

    if (receive === null) {
      pass = nullable;
    } else {
      pass = typeof receive === 'number';
    }

    return {
      pass,
      message: () => `expected ${receive}${pass ? ' ' : ' not '}number type`,
    };
  }

  toBeString(
    receive: unknown,
    options: Options = { nullable: false },
  ): jest.CustomMatcherResult {
    const { nullable } = options;
    let pass = false;

    if (receive === null) {
      pass = nullable;
    } else {
      pass = typeof receive === 'string';
    }

    return {
      pass,
      message: () => `expected ${receive}${pass ? ' ' : ' not '}string type`,
    };
  }

  toBeBoolean(receive: unknown): jest.CustomMatcherResult {
    const pass = typeof receive === 'boolean';

    return {
      pass,
      message: () => `expected ${receive}${pass ? ' ' : ' not '}boolean type`,
    };
  }
}
