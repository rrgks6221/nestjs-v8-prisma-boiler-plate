import { SwaggerBuilder } from '@src/interceptors/builder/swagger.builder';

export class BaseResponseDto extends SwaggerBuilder {
  constructor(res: { [key: string]: unknown }) {
    super();

    Object.assign(this, res);
  }

  [key: string]: unknown;
}
