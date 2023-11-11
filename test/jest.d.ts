export {};
type OwnMatcher<Params extends unknown[]> = (
  this: jest.MatcherContext,
  actual: unknown,
  ...params: Params
) => jest.CustomMatcherResult;
declare global {
  namespace jest {
    interface Matchers<R, T> {
      /**
       * Used to check that a variable type is number.
       */
      toBeNumber: (options?: { nullable: boolean }) => R;
    }
  }
}
