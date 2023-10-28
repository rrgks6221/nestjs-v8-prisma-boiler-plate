import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '@src/apis/users/controllers/users.controller';
import { FindUserListQueryDto } from '@src/apis/users/dto/find-user-list-query.dto';
import { PatchUpdateUserBodyDto } from '@src/apis/users/dto/patch-update-user.dto';
import { PutUpdateUserBodyDto } from '@src/apis/users/dto/put-update-user.dto';
import { UserBaseResponseDto } from '@src/apis/users/dto/user-base-response.dto';
import { UserEntity } from '@src/apis/users/entities/user.entity';
import { UsersService } from '@src/apis/users/services/users.service';
import { MockUserService } from '@test/mock/services.mock';

describe('UsersController', () => {
  let controller: UsersController;
  let mockUserService: MockUserService;

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
    mockUserService = module.get(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAllAndCount', () => {
    let findUserListQueryDto: FindUserListQueryDto;

    let users: UserEntity[];
    let count: number;

    beforeEach(() => {
      findUserListQueryDto = new FindUserListQueryDto();

      users = [];
      count = NaN;
    });

    it('findAllAndCount', async () => {
      users = [new UserEntity()];
      count = faker.datatype.number();

      mockUserService.findAllAndCount.mockResolvedValue([users, count]);

      await expect(
        controller.findAllAndCount(findUserListQueryDto),
      ).resolves.toEqual([users, count]);
    });
  });

  describe('findOne', () => {
    let userId: number;

    let userEntity: UserEntity;

    beforeEach(() => {
      userId = NaN;

      userEntity = new UserEntity();
    });

    it('findOne', async () => {
      mockUserService.findOneOrNotFound.mockResolvedValue({ id: 1 });
      mockUserService.buildBaseResponse.mockResolvedValue(userEntity);

      await expect(controller.findOne(userId)).resolves.toBeInstanceOf(
        UserBaseResponseDto,
      );
    });
  });

  describe('patchUpdate', () => {
    let userId: number;
    let patchUpdateUserBodyDto: PatchUpdateUserBodyDto;
    let user: UserEntity;

    let userEntity: UserEntity;

    beforeEach(() => {
      userId = NaN;
      patchUpdateUserBodyDto = new PatchUpdateUserBodyDto();
      user = new UserEntity();

      userEntity = new UserEntity();
    });

    it('patch update', async () => {
      mockUserService.patchUpdate.mockResolvedValue({ id: 1 });
      mockUserService.buildBaseResponse.mockResolvedValue(userEntity);

      await expect(
        controller.patchUpdate(userId, patchUpdateUserBodyDto, user),
      ).resolves.toBeInstanceOf(UserBaseResponseDto);
    });
  });

  describe('putUpdate', () => {
    let userId: number;
    let putUpdateUserBodyDto: PutUpdateUserBodyDto;
    let user: UserEntity;

    let userEntity: UserEntity;

    beforeEach(() => {
      userId = NaN;
      putUpdateUserBodyDto = new PutUpdateUserBodyDto();
      user = new UserEntity();

      userEntity = new UserEntity();
    });

    it('patch update', async () => {
      mockUserService.putUpdate.mockResolvedValue({ id: 1 });
      mockUserService.buildBaseResponse.mockResolvedValue(userEntity);

      await expect(
        controller.putUpdate(userId, putUpdateUserBodyDto, user),
      ).resolves.toBeInstanceOf(UserBaseResponseDto);
    });
  });

  describe('remove', () => {
    let userId: number;
    let user: UserEntity;

    beforeEach(() => {
      userId = NaN;
      user = new UserEntity();
    });

    it('findOne', async () => {
      mockUserService.remove.mockResolvedValue(1);

      await expect(controller.remove(userId, user)).resolves.toBe(1);
    });
  });
});
