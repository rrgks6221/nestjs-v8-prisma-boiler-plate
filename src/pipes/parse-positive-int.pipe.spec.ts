import { ArgumentMetadata } from '@nestjs/common';
import { HttpBadRequestException } from '@src/http-exceptions/exceptions/http-bad-request.exception';
import { ParsePositiveIntPipe } from '@src/pipes/parse-positive-int.pipe';

describe(ParsePositiveIntPipe.name, () => {
  let target: ParsePositiveIntPipe;

  beforeEach(() => {
    target = new ParsePositiveIntPipe();
  });

  describe(ParsePositiveIntPipe.prototype.transform.name, () => {
    describe('when validation passes', () => {
      it('should return positive number', async () => {
        const num = '3';

        expect(target.transform(num, {} as ArgumentMetadata)).toBe(
          parseInt(num, 10),
        );
      });
    });

    describe('when validation fails', () => {
      it('should throw an error', async () => {
        expect(() =>
          target.transform('123abc', {} as ArgumentMetadata),
        ).toThrowError(HttpBadRequestException);
      });

      it('should throw an error when number has wrong number encoding', async () => {
        expect(() =>
          target.transform('0xFF', {} as ArgumentMetadata),
        ).toThrowError(HttpBadRequestException);
      });

      it('should throw an error when negative number', async () => {
        expect(() =>
          target.transform('-3', {} as ArgumentMetadata),
        ).toThrowError(HttpBadRequestException);
      });

      it('should throw an error when negative float', async () => {
        expect(() =>
          target.transform('-3.1', {} as ArgumentMetadata),
        ).toThrowError(HttpBadRequestException);
      });

      it('should throw an error when positive float', async () => {
        expect(() =>
          target.transform('3.1', {} as ArgumentMetadata),
        ).toThrowError(HttpBadRequestException);
      });
    });
  });
});
