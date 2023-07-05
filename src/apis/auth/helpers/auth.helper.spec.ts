import { Test, TestingModule } from '@nestjs/testing';
import { AuthHelper } from '@src/apis/auth/helpers/auth.helper';

describe('AuthHelper', () => {
  let helper: AuthHelper;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthHelper],
    }).compile();

    helper = module.get<AuthHelper>(AuthHelper);
  });

  it('should be defined', () => {
    expect(helper).toBeDefined();
  });
});
