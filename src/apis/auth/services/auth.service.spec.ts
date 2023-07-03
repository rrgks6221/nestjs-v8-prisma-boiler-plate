import { faker } from '@faker-js/faker';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '@src/apis/auth/services/auth.service';
import { MockJwtService } from '@test/mock/services.mock';

describe('AuthService', () => {
  let service: AuthService;
  let mockJwtService: MockJwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useClass: MockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    mockJwtService = module.get(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createAccessToken', () => {
    let id: number;
    let randomValue: string;

    beforeEach(() => {
      id = faker.datatype.number();
      randomValue = faker.datatype.string();
    });

    it('토큰 생성 성공', () => {
      mockJwtService.signAsync.mockResolvedValue(randomValue);

      expect(service.generateAccessToken(id)).resolves.toBe(randomValue);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
