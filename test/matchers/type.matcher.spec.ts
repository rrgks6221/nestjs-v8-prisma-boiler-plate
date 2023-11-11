import { TypeMatcher } from '@test/matchers/type.matcher';

describe(TypeMatcher, () => {
  describe(TypeMatcher.prototype.toBeNumber.name, () => {
    let typeMatcher: TypeMatcher;

    beforeEach(() => {
      typeMatcher = new TypeMatcher();
    });

    describe('nullable', () => {
      const options = { nullable: true };

      it('number type', () => {
        const { pass } = typeMatcher.toBeNumber(1, options);

        expect(pass).toBe(true);
      });

      it('string type number', () => {
        const { pass } = typeMatcher.toBeNumber('1', options);

        expect(pass).toBe(false);
      });

      it('null', () => {
        const { pass } = typeMatcher.toBeNumber(null, options);

        expect(pass).toBe(true);
      });
    });

    describe('non nullable', () => {
      const options = { nullable: false };

      it('number type', () => {
        const { pass } = typeMatcher.toBeNumber(1, options);

        expect(pass).toBe(true);
      });

      it('string type number', () => {
        const { pass } = typeMatcher.toBeNumber('1', options);

        expect(pass).toBe(false);
      });

      it('null', () => {
        const { pass } = typeMatcher.toBeNumber(null, options);

        expect(pass).toBe(false);
      });
    });
  });
});
