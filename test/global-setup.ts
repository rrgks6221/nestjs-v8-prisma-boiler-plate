import { TypeMatcher } from './matchers/type-matcher';

expect.extend({
  ...TypeMatcher.entryMatcher(),
});
