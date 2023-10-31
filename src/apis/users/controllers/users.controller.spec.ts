import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '@src/apis/users/controllers/users.controller';
import { FindUserListRequestQueryDto } from '@src/apis/users/dto/find-user-list-request-query.dto';
import { PatchUpdateUserRequestBodyDto } from '@src/apis/users/dto/patch-update-user-request-body.dto';
import { PutUpdateUserRequestBodyDto } from '@src/apis/users/dto/put-update-user-request-body.dto';
import { UserResponseDto } from '@src/apis/users/dto/user-response.dto';
import { UserEntity } from '@src/apis/users/entities/user.entity';
import { UsersService } from '@src/apis/users/services/users.service';
import { MockUserService } from '@test/mock/services.mock';

describe(UsersController.name, () => {
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

  describe(UsersController.prototype.findAllAndCount.name, () => {
    let findUserListQueryDto: FindUserListRequestQueryDto;

    let users: UserEntity[];
    let count: number;

    beforeEach(() => {
      findUserListQueryDto = new FindUserListRequestQueryDto();

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

  describe(UsersController.prototype.findOne.name, () => {
    let userId: number;

    let userEntity: UserEntity;

    beforeEach(() => {
      userId = NaN;

      userEntity = new UserEntity();
    });

    it('findOne', async () => {
      mockUserService.findOneOrNotFound.mockResolvedValue({ id: 1 });
      mockUserService.buildDetailResponse.mockResolvedValue(userEntity);

      await expect(controller.findOne(userId)).resolves.toBeInstanceOf(
        UserResponseDto,
      );
    });
  });

  describe(UsersController.prototype.patchUpdate.name, () => {
    let userId: number;
    let patchUpdateUserBodyDto: PatchUpdateUserRequestBodyDto;
    let user: UserEntity;

    let userEntity: UserEntity;

    beforeEach(() => {
      userId = NaN;
      patchUpdateUserBodyDto = new PatchUpdateUserRequestBodyDto();
      user = new UserEntity();

      userEntity = new UserEntity();
    });

    it('patch update', async () => {
      mockUserService.patchUpdate.mockResolvedValue({ id: 1 });
      mockUserService.buildDetailResponse.mockResolvedValue(userEntity);

      await expect(
        controller.patchUpdate(userId, patchUpdateUserBodyDto, user),
      ).resolves.toBeInstanceOf(UserResponseDto);
    });
  });

  describe(UsersController.prototype.putUpdate.name, () => {
    let userId: number;
    let putUpdateUserBodyDto: PutUpdateUserRequestBodyDto;
    let user: UserEntity;

    let userEntity: UserEntity;

    beforeEach(() => {
      userId = NaN;
      putUpdateUserBodyDto = new PutUpdateUserRequestBodyDto();
      user = new UserEntity();

      userEntity = new UserEntity();
    });

    it('patch update', async () => {
      mockUserService.putUpdate.mockResolvedValue({ id: 1 });
      mockUserService.buildDetailResponse.mockResolvedValue(userEntity);

      await expect(
        controller.putUpdate(userId, putUpdateUserBodyDto, user),
      ).resolves.toBeInstanceOf(UserResponseDto);
    });
  });

  describe(UsersController.prototype.remove.name, () => {
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
