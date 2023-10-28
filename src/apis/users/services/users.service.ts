import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { CreateUserRequestBodyDto } from '@src/apis/users/dto/create-user-request-body.dto';
import { FindUserListQueryDto } from '@src/apis/users/dto/find-user-list-query.dto';
import { PatchUpdateUserBodyDto } from '@src/apis/users/dto/patch-update-user.dto';
import { PutUpdateUserBodyDto } from '@src/apis/users/dto/put-update-user.dto';
import { UserEntity } from '@src/apis/users/entities/user.entity';
import { ERROR_CODE } from '@src/constants/error-response-code.constant';
import { HttpExceptionHelper } from '@src/core/http-exception-filters/helpers/http-exception.helper';
import { PrismaService } from '@src/core/prisma/prisma.service';
import { QueryHelper } from '@src/helpers/query.helper';
import { BaseService } from '@src/types/type';
import bcrypt from 'bcrypt';

@Injectable()
export class UsersService implements BaseService<UserEntity> {
  private readonly SALT = 10;
  private readonly LIKE_SEARCH_FIELDS: (keyof Partial<UserEntity>)[] = [
    'email',
    'nickname',
  ];

  constructor(
    private readonly prismaService: PrismaService,
    private readonly queryHelper: QueryHelper,
  ) {}

  async findAllAndCount(
    findUserListQueryDto: FindUserListQueryDto,
  ): Promise<[UserEntity[], number]> {
    const { page, pageSize, orderBy, ...filter } = findUserListQueryDto;

    const where = this.queryHelper.buildWherePropForFind<User>(
      filter,
      this.LIKE_SEARCH_FIELDS,
    );

    const usersQuery = this.prismaService.user.findMany({
      where: {
        ...where,
        deletedAt: null,
      },
      orderBy,
      skip: page * pageSize,
      take: pageSize,
    });

    const totalCountQuery = this.prismaService.user.count({
      where: {
        ...where,
        deletedAt: null,
      },
    });

    const [users, count] = await this.prismaService.$transaction([
      usersQuery,
      totalCountQuery,
    ]);

    return [users, count];
  }

  async findOneOrNotFound(userId: number): Promise<UserEntity> {
    const existUser = await this.prismaService.user.findFirst({
      where: {
        id: userId,
        deletedAt: null,
      },
    });

    if (!existUser) {
      throw new NotFoundException(
        HttpExceptionHelper.createError({
          code: ERROR_CODE.CODE005,
          message: `userId ${userId} doesn't exist`,
        }),
      );
    }

    return existUser;
  }

  findOneBy(where: Prisma.UserWhereInput) {
    return this.prismaService.user.findFirst({
      where: {
        ...where,
        deletedAt: null,
      },
    });
  }

  async create(createUserDto: CreateUserRequestBodyDto): Promise<UserEntity> {
    const { email, nickname } = createUserDto;

    await this.checkUniqueEmail(email);
    await this.checkUniqueNickname(nickname);

    createUserDto.password = await bcrypt.hash(
      createUserDto.password,
      this.SALT,
    );

    return this.prismaService.user.create({
      data: createUserDto,
    });
  }

  async patchUpdate(
    userId: number,
    loggedInUserId: number,
    patchUpdateUserBodyDto: PatchUpdateUserBodyDto,
  ): Promise<UserEntity> {
    await this.findOneOrNotFound(userId);

    this.checkOwn(userId, loggedInUserId);

    const { email, nickname } = patchUpdateUserBodyDto;

    if (email) {
      await this.checkUniqueEmail(email, userId);
    }

    if (nickname) {
      await this.checkUniqueNickname(nickname, userId);
    }

    return this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: patchUpdateUserBodyDto,
    });
  }

  async putUpdate(
    userId: number,
    loggedInUserId: number,
    putUpdateUserBodyDto: PutUpdateUserBodyDto,
  ): Promise<UserEntity> {
    await this.findOneOrNotFound(userId);

    this.checkOwn(userId, loggedInUserId);

    const { email, nickname } = putUpdateUserBodyDto;

    await this.checkUniqueEmail(email, userId);
    await this.checkUniqueNickname(nickname, userId);

    return this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: putUpdateUserBodyDto,
    });
  }

  async remove(userId: number, loggedInUserId: number): Promise<number> {
    await this.findOneOrNotFound(userId);

    this.checkOwn(userId, loggedInUserId);

    const removedUser = await this.prismaService.user.update({
      select: {
        id: true,
      },
      data: {
        deletedAt: new Date(),
      },
      where: {
        id: userId,
      },
    });

    return Number(!!removedUser);
  }

  async buildBaseResponse(userId: number): Promise<UserEntity> {
    return this.prismaService.user.findFirstOrThrow({
      where: {
        id: userId,
        deletedAt: null,
      },
    });
  }

  private checkOwn(userId: number, loggedInUserId: number): void {
    if (userId === loggedInUserId) return;

    throw new ForbiddenException(
      HttpExceptionHelper.createError({
        code: ERROR_CODE.CODE006,
        message: 'can only change your own information',
      }),
    );
  }

  private async checkUniqueEmail(
    email: string,
    userId?: number,
  ): Promise<void> {
    const existUser = await this.prismaService.user.findFirst({
      select: {
        id: true,
      },
      where: {
        email,
        deletedAt: null,
      },
    });

    if (!existUser) return;

    if (existUser.id === userId) return;

    throw new BadRequestException(
      HttpExceptionHelper.createError({
        code: ERROR_CODE.CODE003,
        message: 'this email is already in use.',
      }),
    );
  }

  private async checkUniqueNickname(
    nickname: string,
    userId?: number,
  ): Promise<void> {
    const existUser = await this.prismaService.user.findFirst({
      select: {
        id: true,
      },
      where: {
        nickname,
        deletedAt: null,
      },
    });

    if (!existUser) return;

    if (existUser.id === userId) return;

    throw new BadRequestException(
      HttpExceptionHelper.createError({
        code: ERROR_CODE.CODE003,
        message: 'this nickname is already in use.',
      }),
    );
  }
}
