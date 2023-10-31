import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Prisma } from '@prisma/client';
import { AuthService } from '@src/apis/auth/services/auth.service';
import { CreateUserRequestBodyDto } from '@src/apis/users/dto/create-user-request-body.dto';
import { FindUserListRequestQueryDto } from '@src/apis/users/dto/find-user-list-request-query.dto';
import { PatchUpdateUserRequestBodyDto } from '@src/apis/users/dto/patch-update-user-request-body.dto';
import { PutUpdateUserRequestBodyDto } from '@src/apis/users/dto/put-update-user-request-body.dto';
import { UserEntity } from '@src/apis/users/entities/user.entity';
import { UsersService } from '@src/apis/users/services/users.service';
import { SortOrder } from '@src/constants/enum';
import { BCRYPT_TOKEN } from '@src/constants/token.constant';
import { PrismaService } from '@src/core/prisma/prisma.service';
import { QueryHelper } from '@src/helpers/query.helper';
import { MockQueryHelper } from '@test/mock/helper.mock';
import { MockEncryption } from '@test/mock/libs.mock';
import { mockPrismaService } from '@test/mock/prisma-service.mock';
import { MockAuthService } from '@test/mock/services.mock';

describe(UsersService.name, () => {
  let service: UsersService;
  let mockQueryHelper: MockQueryHelper;
  let mockEncryption: MockEncryption;

  let checkUniqueEmailSuccessMocking: () => void;
  let checkUniqueNicknameSuccessMocking: () => void;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: AuthService,
          useClass: MockAuthService,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: BCRYPT_TOKEN,
          useClass: MockEncryption,
        },
        {
          provide: QueryHelper,
          useClass: MockQueryHelper,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    mockQueryHelper = module.get(QueryHelper);
    mockEncryption = module.get(BCRYPT_TOKEN);

    checkUniqueEmailSuccessMocking = () => {
      mockPrismaService.user.findFirst.mockResolvedValueOnce(null);
    };
    checkUniqueNicknameSuccessMocking = () => {
      mockPrismaService.user.findFirst.mockResolvedValueOnce(null);
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe(UsersService.prototype.findAllAndCount.name, () => {
    let findUserListQueryDto: FindUserListRequestQueryDto;

    let users: UserEntity[];
    let count: number;

    beforeEach(() => {
      findUserListQueryDto = {
        id: 1,
        page: 1,
        pageSize: 20,
        orderBy: {
          id: SortOrder.Desc,
        },
      };

      users = [new UserEntity()];
      count = 1;
    });

    it('findAllAndCount', async () => {
      mockQueryHelper.buildWherePropForFind.mockReturnValue({
        id: 1,
      });

      mockPrismaService.$transaction.mockResolvedValue([users, count]);

      await expect(
        service.findAllAndCount(findUserListQueryDto),
      ).resolves.toEqual([users, count]);
      expect(mockPrismaService.user.findMany).toBeCalledWith({
        where: expect.anything(),
        orderBy: expect.anything(),
        skip: 20,
        take: 20,
      });
      expect(mockPrismaService.user.count).toBeCalledWith({
        where: expect.anything(),
      });
    });
  });

  describe(UsersService.prototype.findOneOrNotFound.name, () => {
    let userId: number;

    let existUser: UserEntity;

    beforeEach(() => {
      userId = NaN;

      existUser = new UserEntity();
    });

    it('not found user', async () => {
      mockPrismaService.user.findFirst.mockResolvedValue(null);

      await expect(service.findOneOrNotFound(userId)).rejects.toThrowError(
        NotFoundException,
      );
    });

    it('find user', async () => {
      mockPrismaService.user.findFirst.mockResolvedValue(existUser);

      await expect(service.findOneOrNotFound(userId)).resolves.toEqual(
        existUser,
      );
    });
  });

  describe(UsersService.prototype.findOneBy.name, () => {
    let where: Prisma.UserWhereInput;

    let existUser: UserEntity;

    beforeEach(() => {
      where = {};

      existUser = new UserEntity();
    });

    it('find user return user', async () => {
      mockPrismaService.user.findFirst.mockResolvedValue(existUser);

      await expect(service.findOneBy(where)).resolves.toEqual(existUser);
    });

    it('not found user return null', async () => {
      mockPrismaService.user.findFirst.mockResolvedValue(null);

      await expect(service.findOneBy(where)).resolves.toBeNull();
    });
  });

  describe(UsersService.prototype.create.name, () => {
    let createUserRequestBodyDto: CreateUserRequestBodyDto;

    let newUser: UserEntity;

    beforeEach(() => {
      createUserRequestBodyDto = new CreateUserRequestBodyDto();

      newUser = new UserEntity();

      checkUniqueEmailSuccessMocking();
      checkUniqueNicknameSuccessMocking();
    });

    it('create user', async () => {
      const sortedPassword = 'sortedPassword';

      createUserRequestBodyDto.password = 'password';

      mockEncryption.hash.mockResolvedValue(sortedPassword);
      mockPrismaService.user.create.mockResolvedValue(newUser);

      await expect(service.create(createUserRequestBodyDto)).resolves.toEqual(
        newUser,
      );
      expect(mockPrismaService.user.create).toBeCalledWith({
        data: {
          password: sortedPassword,
        },
      });
    });
  });

  describe(UsersService.prototype.patchUpdate.name, () => {
    let userId: number;
    let loggedInUserId: number;
    let patchUpdateUserRequestBodyDto: PatchUpdateUserRequestBodyDto;

    let newUser: UserEntity;

    beforeEach(() => {
      userId = NaN;
      loggedInUserId = NaN;
      patchUpdateUserRequestBodyDto = new PatchUpdateUserRequestBodyDto();

      newUser = new UserEntity();
    });

    it('유저가 존재하지 않는 경우', async () => {
      userId = 1;

      mockPrismaService.user.findFirst.mockResolvedValueOnce(null);

      await expect(
        service.patchUpdate(
          userId,
          loggedInUserId,
          patchUpdateUserRequestBodyDto,
        ),
      ).rejects.toThrowError(NotFoundException);
    });

    it('본인 계정이 아닌 경우', async () => {
      userId = 1;
      loggedInUserId = 2;

      mockPrismaService.user.findFirst.mockResolvedValueOnce(new UserEntity());

      await expect(
        service.patchUpdate(
          userId,
          loggedInUserId,
          patchUpdateUserRequestBodyDto,
        ),
      ).rejects.toThrowError(ForbiddenException);
    });

    it('중복된 이메일이 있는 경우', async () => {
      userId = 1;
      loggedInUserId = 1;
      patchUpdateUserRequestBodyDto.email = 'email';

      mockPrismaService.user.findFirst.mockResolvedValueOnce(new UserEntity());
      mockPrismaService.user.findFirst.mockResolvedValueOnce({
        id: 2,
      } as UserEntity);

      await expect(
        service.patchUpdate(
          userId,
          loggedInUserId,
          patchUpdateUserRequestBodyDto,
        ),
      ).rejects.toThrowError(BadRequestException);
    });

    it('중복된 닉네임이 있는 경우', async () => {
      userId = 1;
      loggedInUserId = 1;
      patchUpdateUserRequestBodyDto.email = 'email';
      patchUpdateUserRequestBodyDto.nickname = 'nickname';

      mockPrismaService.user.findFirst.mockResolvedValueOnce(new UserEntity());
      checkUniqueEmailSuccessMocking();
      mockPrismaService.user.findFirst.mockResolvedValueOnce({
        id: 2,
      } as UserEntity);

      await expect(
        service.patchUpdate(
          userId,
          loggedInUserId,
          patchUpdateUserRequestBodyDto,
        ),
      ).rejects.toThrowError(BadRequestException);
    });

    it('업데이트 성공', async () => {
      userId = 1;
      loggedInUserId = 1;
      patchUpdateUserRequestBodyDto.email = 'email';
      patchUpdateUserRequestBodyDto.nickname = 'nickname';

      mockPrismaService.user.findFirst.mockResolvedValueOnce(new UserEntity());
      checkUniqueEmailSuccessMocking();
      checkUniqueNicknameSuccessMocking();
      mockPrismaService.user.update.mockResolvedValue(newUser);

      newUser.id = userId;
      newUser.email = patchUpdateUserRequestBodyDto.email;
      newUser.nickname = patchUpdateUserRequestBodyDto.nickname;

      await expect(
        service.patchUpdate(
          userId,
          loggedInUserId,
          patchUpdateUserRequestBodyDto,
        ),
      ).resolves.toEqual(newUser);
    });
  });

  describe(UsersService.prototype.putUpdate.name, () => {
    let userId: number;
    let loggedInUserId: number;
    let putUpdateUserBodyDto: PutUpdateUserRequestBodyDto;

    let newUser: UserEntity;

    beforeEach(() => {
      userId = NaN;
      loggedInUserId = NaN;
      putUpdateUserBodyDto = new PutUpdateUserRequestBodyDto();

      newUser = new UserEntity();
    });

    it('유저가 존재하지 않는 경우', async () => {
      userId = 1;

      mockPrismaService.user.findFirst.mockResolvedValueOnce(null);

      await expect(
        service.putUpdate(userId, loggedInUserId, putUpdateUserBodyDto),
      ).rejects.toThrowError(NotFoundException);
    });

    it('본인 계정이 아닌 경우', async () => {
      userId = 1;
      loggedInUserId = 2;

      mockPrismaService.user.findFirst.mockResolvedValueOnce(new UserEntity());

      await expect(
        service.putUpdate(userId, loggedInUserId, putUpdateUserBodyDto),
      ).rejects.toThrowError(ForbiddenException);
    });

    it('중복된 이메일이 있는 경우', async () => {
      userId = 1;
      loggedInUserId = 1;
      putUpdateUserBodyDto.email = 'email';

      mockPrismaService.user.findFirst.mockResolvedValueOnce(new UserEntity());
      mockPrismaService.user.findFirst.mockResolvedValueOnce({
        id: 2,
      } as UserEntity);

      await expect(
        service.putUpdate(userId, loggedInUserId, putUpdateUserBodyDto),
      ).rejects.toThrowError(BadRequestException);
    });

    it('중복된 닉네임이 있는 경우', async () => {
      userId = 1;
      loggedInUserId = 1;
      putUpdateUserBodyDto.email = 'email';
      putUpdateUserBodyDto.nickname = 'nickname';

      mockPrismaService.user.findFirst.mockResolvedValueOnce(new UserEntity());
      checkUniqueEmailSuccessMocking();
      mockPrismaService.user.findFirst.mockResolvedValueOnce({
        id: 2,
      } as UserEntity);

      await expect(
        service.putUpdate(userId, loggedInUserId, putUpdateUserBodyDto),
      ).rejects.toThrowError(BadRequestException);
    });

    it('업데이트 성공', async () => {
      userId = 1;
      loggedInUserId = 1;
      putUpdateUserBodyDto.email = 'email';
      putUpdateUserBodyDto.nickname = 'nickname';

      mockPrismaService.user.findFirst.mockResolvedValueOnce(new UserEntity());
      checkUniqueEmailSuccessMocking();
      checkUniqueNicknameSuccessMocking();
      mockPrismaService.user.update.mockResolvedValue(newUser);

      newUser.id = userId;
      newUser.email = putUpdateUserBodyDto.email;
      newUser.nickname = putUpdateUserBodyDto.nickname;

      await expect(
        service.putUpdate(userId, loggedInUserId, putUpdateUserBodyDto),
      ).resolves.toEqual(newUser);
    });
  });

  describe(UsersService.prototype.remove.name, () => {
    let userId: number;
    let loggedInUserId: number;

    let removedUser: UserEntity;

    beforeEach(() => {
      userId = NaN;
      loggedInUserId = NaN;
      removedUser = new UserEntity();
    });

    it('유저가 존재하지 않는 경우', async () => {
      userId = 1;

      mockPrismaService.user.findFirst.mockResolvedValueOnce(null);

      await expect(service.remove(userId, loggedInUserId)).rejects.toThrowError(
        NotFoundException,
      );
    });

    it('본인 계정이 아닌 경우', async () => {
      userId = 1;
      loggedInUserId = 2;

      mockPrismaService.user.findFirst.mockResolvedValueOnce(new UserEntity());

      await expect(service.remove(userId, loggedInUserId)).rejects.toThrowError(
        ForbiddenException,
      );
    });

    it('삭제 성공', async () => {
      userId = 1;
      loggedInUserId = 1;

      removedUser.id = userId;

      mockPrismaService.user.findFirst.mockResolvedValueOnce(new UserEntity());
      mockPrismaService.user.update.mockResolvedValueOnce(removedUser);

      await expect(service.remove(userId, loggedInUserId)).resolves.toBe(1);
    });
  });

  describe(UsersService.prototype.buildDetailResponse.name, () => {
    let userId: number;

    let user: UserEntity;

    beforeEach(() => {
      userId = NaN;

      user = new UserEntity();
    });

    it('build response', async () => {
      userId = 1;

      user.id = userId;

      mockPrismaService.user.findFirstOrThrow.mockResolvedValueOnce(user);

      await expect(service.buildDetailResponse(userId)).resolves.toEqual(user);
    });
  });
});
