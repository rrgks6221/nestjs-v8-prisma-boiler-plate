import { transformPage, transformStringBoolean } from '@src/common/common';

describe('common.ts 단위 테스트', () => {
  describe(transformPage.name, () => {
    let obj: { value: any };

    beforeEach(() => {
      obj = {} as any;
    });

    it('number 타입으로 변환되지 않는 문자열인 경우', () => {
      obj.value = 'str';

      expect(transformPage(obj)).toBeNaN();
    });

    it('number 타입으로 변환, 0보다 작은 경우', () => {
      obj.value = 0;

      expect(transformPage(obj)).toBe(0);
    });

    it('number 타입으로 변환, 0보다 큰 경우', () => {
      obj.value = 1;

      expect(transformPage(obj)).toBe(0);
    });
  });

  describe(transformStringBoolean.name, () => {
    let obj: { value: unknown };

    beforeEach(() => {
      obj = {} as any;
    });

    it('string type 이 아닌 경우', () => {
      obj.value = 1;

      expect(transformStringBoolean(obj)).toBe(1);
    });

    it('string true', () => {
      obj.value = 'true';

      expect(transformStringBoolean(obj)).toBe(true);
    });

    it('string True', () => {
      obj.value = 'True';

      expect(transformStringBoolean(obj)).toBe(true);
    });

    it('string TRUE', () => {
      obj.value = 'TRUE';

      expect(transformStringBoolean(obj)).toBe(true);
    });

    it('string false', () => {
      obj.value = 'false';

      expect(transformStringBoolean(obj)).toBe(false);
    });

    it('string False', () => {
      obj.value = 'False';

      expect(transformStringBoolean(obj)).toBe(false);
    });

    it('string FALSE', () => {
      obj.value = 'FALSE';

      expect(transformStringBoolean(obj)).toBe(false);
    });

    it('일반 문자열인 경우', () => {
      obj.value = 'string';

      expect(transformStringBoolean(obj)).toBe(obj.value);
    });
  });
});
