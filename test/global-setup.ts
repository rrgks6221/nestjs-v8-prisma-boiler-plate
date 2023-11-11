import { FormatMatcher } from '@test/matchers/format-matcher';
import { TypeMatcher } from './matchers/type.matcher';

expect.extend({
  ...TypeMatcher.entryMatcher(),
  ...FormatMatcher.entryMatcher(),
});
