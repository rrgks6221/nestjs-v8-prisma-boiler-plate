import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '@src/apis/users/controllers/users.controller';
import { UsersService } from '@src/apis/users/services/users.service';
import { MockUserService } from '@test/mock/services.mock';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useClass: MockUserService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAllAndCount', () => {});

  describe('findOne', () => {});

  describe('patchUpdate', () => {});

  describe('putUpdate', () => {});

  describe('remove', () => {});
});
