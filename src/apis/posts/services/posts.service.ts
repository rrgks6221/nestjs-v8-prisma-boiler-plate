import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Post } from '@prisma/client';
import { CreatePostBodyDto } from '@src/apis/posts/dto/create-post-body.dto';
import { FindPostListQueryDto } from '@src/apis/posts/dto/find-post-list-query-dto';
import { PatchUpdatePostBodyDto } from '@src/apis/posts/dto/patch-update-post-body.dto';
import { PutUpdatePostBodyDto } from '@src/apis/posts/dto/put-update-post-body-dto';
import { PostEntity } from '@src/apis/posts/entities/post.entity';
import { ERROR_CODE } from '@src/constants/error-response-code.constant';
import { HttpExceptionHelper } from '@src/core/exception/helpers/http-exception.helper';
import { PrismaService } from '@src/core/prisma/prisma.service';
import { QueryHelper } from '@src/helpers/query.helper';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class PostsService {
  private readonly LIKE_SEARCH_FIELDS: (keyof Partial<Post>)[] = [
    'title',
    'description',
  ];

  constructor(
    private readonly prismaService: PrismaService,
    private readonly queryHelper: QueryHelper,
  ) {}

  async findAllAndCount(
    findPostListQueryDto: FindPostListQueryDto,
  ): Promise<[PostEntity[], number]> {
    const { page, pageSize, orderBy, ...filter } = findPostListQueryDto;

    const where = this.queryHelper.buildWherePropForFind(
      filter,
      this.LIKE_SEARCH_FIELDS,
    );

    const postsQuery = this.prismaService.post.findMany({
      where,
      orderBy,
      skip: page * pageSize,
      take: pageSize,
    });

    const totalCountQuery = this.prismaService.post.count({
      where,
    });

    const [posts, count] = await this.prismaService.$transaction([
      postsQuery,
      totalCountQuery,
    ]);

    return [plainToInstance(PostEntity, posts), count];
  }

  async findOne(postId: number): Promise<PostEntity> {
    const existPost = await this.prismaService.post.findFirst({
      select: {
        id: true,
      },
      where: {
        id: postId,
        deletedAt: null,
      },
    });

    if (!existPost) {
      throw new NotFoundException(
        HttpExceptionHelper.createError({
          code: ERROR_CODE.CODE005,
          message: `postId ${postId} doesn't exist`,
        }),
      );
    }

    return this.buildBaseResponse(existPost.id);
  }

  async create(
    userId: number,
    createPostBodyDto: CreatePostBodyDto,
  ): Promise<PostEntity> {
    const newPost = await this.prismaService.post.create({
      select: {
        id: true,
      },
      data: {
        title: createPostBodyDto.title,
        description: createPostBodyDto.description,
        userId: userId,
      },
    });

    return this.buildBaseResponse(newPost.id);
  }

  async putUpdate(
    postId: number,
    userId: number,
    putUpdatePostDto: PutUpdatePostBodyDto,
  ): Promise<PostEntity> {
    await this.checkOwner(postId, userId);

    const newPost = await this.prismaService.post.update({
      select: {
        id: true,
      },
      where: {
        id: postId,
      },
      data: {
        title: putUpdatePostDto.title,
        description: putUpdatePostDto.description,
      },
    });

    return this.buildBaseResponse(newPost.id);
  }

  async patchUpdate(
    postId: number,
    userId: number,
    patchUpdatePostDto: PatchUpdatePostBodyDto,
  ): Promise<PostEntity> {
    await this.checkOwner(postId, userId);

    const newPost = await this.prismaService.post.update({
      select: {
        id: true,
      },
      where: {
        id: postId,
      },
      data: {
        description: patchUpdatePostDto.description,
      },
    });

    return this.buildBaseResponse(newPost.id);
  }

  async remove(postId: number, userId: number): Promise<number> {
    await this.checkOwner(postId, userId);

    const removedPost = await this.prismaService.post.update({
      data: {
        deletedAt: new Date(),
      },
      where: {
        id: postId,
      },
    });

    return Number(!!removedPost);
  }

  private async checkOwner(postId: number, userId: number) {
    const existPost = await this.prismaService.post.findFirst({
      select: {
        id: true,
        userId: true,
      },
      where: {
        id: postId,
        deletedAt: null,
      },
    });

    if (!existPost) {
      throw new NotFoundException(
        HttpExceptionHelper.createError({
          code: ERROR_CODE.CODE005,
          message: `postId ${postId} doesn't exist`,
        }),
      );
    }

    if (existPost.userId !== userId) {
      throw new ForbiddenException(
        HttpExceptionHelper.createError({
          code: ERROR_CODE.CODE005,
          message: `post ${postId} is not owned by user ${userId}`,
        }),
      );
    }

    return existPost;
  }

  private async buildBaseResponse(postId: number) {
    const post = await this.prismaService.post.findUniqueOrThrow({
      where: {
        id: postId,
      },
    });

    return new PostEntity(post);
  }
}
