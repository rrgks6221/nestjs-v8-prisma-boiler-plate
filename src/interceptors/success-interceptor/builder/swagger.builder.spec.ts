import { ApiPropertyOptions } from '@nestjs/swagger';
import { SwaggerBuilder } from '@src/interceptors/success-interceptor/builder/swagger.builder';

describe(SwaggerBuilder.name, () => {
  class TestBuilder extends SwaggerBuilder {}

  describe(SwaggerBuilder.swaggerBuilder, () => {
    let options: Required<Pick<ApiPropertyOptions, 'name' | 'type'>> &
      ApiPropertyOptions;

    beforeEach(() => {
      options = {} as any;
    });

    it('build swagger class', () => {
      class TestResponse extends SwaggerBuilder {}

      options = {
        name: 'testName',
        type: TestResponse,
      };

      expect(TestBuilder.swaggerBuilder(options).name).toBe(
        'TestNameTestBuilder',
      );
    });
  });
});
