import { TypeMatcher } from '@test/matchers/type.matcher';

describe(TypeMatcher, () => {
  let typeMatcher: TypeMatcher;

  beforeEach(() => {
    typeMatcher = new TypeMatcher();
  });

  describe(TypeMatcher.prototype.toBeNumber.name, () => {
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

  describe(TypeMatcher.prototype.toBeString.name, () => {
    describe('nullable', () => {
      const options = { nullable: true };

      it('number type', () => {
        const { pass } = typeMatcher.toBeString(1, options);

        expect(pass).toBe(false);
      });

      it('string type number', () => {
        const { pass } = typeMatcher.toBeString('1', options);

        expect(pass).toBe(true);
      });

      it('null', () => {
        const { pass } = typeMatcher.toBeString(null, options);

        expect(pass).toBe(true);
      });
    });

    describe('non nullable', () => {
      const options = { nullable: false };

      it('number type', () => {
        const { pass } = typeMatcher.toBeString(1, options);

        expect(pass).toBe(false);
      });

      it('string type number', () => {
        const { pass } = typeMatcher.toBeString('1', options);

        expect(pass).toBe(true);
      });

      it('null', () => {
        const { pass } = typeMatcher.toBeString(null, options);

        expect(pass).toBe(false);
      });
    });
  });

  describe(TypeMatcher.prototype.toBeBoolean.name, () => {
    it('boolean type true', () => {
      const { pass } = typeMatcher.toBeBoolean(true);

      expect(pass).toBe(true);
    });

    it('string type true', () => {
      const { pass } = typeMatcher.toBeBoolean('true');

      expect(pass).toBe(false);
    });
  });
});
