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
      where,
      orderBy,
      skip: page * pageSize,
      take: pageSize,
    });

    const totalCountQuery = this.prismaService.user.count({
      where,
    });

    const [users, count] = await this.prismaService.$transaction([
      usersQuery,
      totalCountQuery,
    ]);

    return [users, count];
  }

  async findOne(userId: number) {
    const existUser = await this.prismaService.user.findFirst({
      where: {
        id: userId,
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
      where,
    });
  }

  async create(
    userId: number,
    createUserDto: CreateUserRequestBodyDto,
  ): Promise<UserEntity> {
    const { email, nickname } = createUserDto;

    await this.checkUniqueEmail(userId, email);
    await this.checkUniqueNickname(userId, nickname);

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
    await this.findOne(userId);

    this.checkOwn(userId, loggedInUserId);

    const { email, nickname } = patchUpdateUserBodyDto;

    if (email) {
      await this.checkUniqueEmail(userId, email);
    }

    if (nickname) {
      await this.checkUniqueNickname(userId, nickname);
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
    await this.findOne(userId);

    this.checkOwn(userId, loggedInUserId);

    const { email, nickname } = putUpdateUserBodyDto;

    await this.checkUniqueEmail(userId, email);
    await this.checkUniqueNickname(userId, nickname);

    return this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: putUpdateUserBodyDto,
    });
  }

  async remove(userId: number, loggedInUserId: number): Promise<number> {
    await this.findOne(userId);

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
    return this.prismaService.user.findUniqueOrThrow({
      where: {
        id: userId,
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

  private async checkUniqueEmail(userId: number, email: string): Promise<void> {
    const existUser = await this.prismaService.user.findUnique({
      select: {
        id: true,
      },
      where: {
        email,
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
    userId: number,
    nickname: string,
  ): Promise<void> {
    const existUser = await this.prismaService.user.findUnique({
      select: {
        id: true,
      },
      where: {
        nickname,
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
