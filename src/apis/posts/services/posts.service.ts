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
import { PrismaService } from '@src/core/prisma/prisma.service';
import { QueryHelper } from '@src/helpers/query.helper';

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

  async findOne(id: number) {
    const existPost = await this.prismaService.post.findFirst({
      select: {
        id: true,
      },
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!existPost) {
      throw new NotFoundException();
    }

    return this.buildDetailResponse(existPost.id);
  }

  async create(
    userId: number,
    createPostDto: CreatePostBodyDto,
  ): Promise<Post> {
    const newPost = await this.prismaService.post.create({
      select: {
        id: true,
      },
      data: {
        title: createPostDto.title,
        description: createPostDto.description,
        userId: userId,
      },
    });

    return this.buildDetailResponse(newPost.id);
  }

  findAllAndCount(query: FindPostListQueryDto) {
    const { page, pageSize, orderBy, ...filter } = query;
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

    return this.prismaService.$transaction([postsQuery, totalCountQuery]);
  }

  async putUpdate(
    id: number,
    userId: number,
    putUpdatePostDto: PutUpdatePostBodyDto,
  ): Promise<Post> {
    await this.checkPostOwner(id, userId);

    const newPost = await this.prismaService.post.update({
      select: {
        id: true,
      },
      where: {
        id,
      },
      data: {
        title: putUpdatePostDto.title,
        description: putUpdatePostDto.description,
      },
    });

    return this.buildDetailResponse(newPost.id);
  }

  async patchUpdate(
    id: number,
    userId: number,
    patchUpdatePostDto: PatchUpdatePostBodyDto,
  ): Promise<Post> {
    await this.checkPostOwner(id, userId);

    const newPost = await this.prismaService.post.update({
      select: {
        id: true,
      },
      where: {
        id,
      },
      data: {
        description: patchUpdatePostDto.description,
      },
    });

    return this.buildDetailResponse(newPost.id);
  }

  async remove(id: number, userId: number): Promise<number> {
    await this.checkPostOwner(id, userId);

    await this.prismaService.post.update({
      data: {
        deletedAt: new Date(),
      },
      where: {
        id,
      },
    });

    return this.prismaService.post.count({
      where: {
        id,
      },
    });
  }

  private async checkPostOwner(postId: number, userId: number) {
    const post = await this.prismaService.post.findFirst({
      select: {
        id: true,
        userId: true,
      },
      where: {
        id: postId,
        deletedAt: null,
      },
    });

    if (!post) {
      throw new NotFoundException();
    }

    if (post.userId !== userId) {
      throw new ForbiddenException();
    }

    return post;
  }

  private async buildDetailResponse(postId: number) {
    return this.prismaService.post.findUniqueOrThrow({
      where: {
        id: postId,
      },
    });
  }
}
