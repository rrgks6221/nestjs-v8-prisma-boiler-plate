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
}
