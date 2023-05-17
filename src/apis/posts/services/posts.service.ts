import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '@src/core/prisma/prisma.service';
import { Post } from '@prisma/client';
import { PatchUpdatePostDto } from '@src/apis/posts/dto/patch-update-post.dto';
import { PostsAuthorityHelper } from '@src/apis/posts/helpers/posts-authority.helper';
import { PutUpdatePostDto } from '@src/apis/posts/dto/put-update-post-dto';
import { QueryHelper } from '@src/helpers/query.helper';
import { PostListQueryDto } from '@src/apis/posts/dto/post-list-query-dto';
import { PostField } from '@src/apis/posts/constants/post.enum';
import { CreatePostDto } from '@src/apis/posts/dto/create-post.dto';

@Injectable()
export class PostsService {
  private readonly LIKE_SEARCH_FIELDS = [
    PostField.Title,
    PostField.Description,
  ];

  constructor(
    private readonly prismaService: PrismaService,
    private readonly postAuthorityHelper: PostsAuthorityHelper,
    private readonly queryHelper: QueryHelper,
  ) {}

  findOne(id: number): Promise<Post | null> {
    return this.prismaService.post.findUnique({
      where: {
        id,
      },
    });
  }

  create(userId: number, createPostDto: CreatePostDto): Promise<Post> {
    return this.prismaService.post.create({
      data: {
        title: createPostDto.title,
        description: createPostDto.description,
        userId: userId,
      },
    });
  }

  findAll(query: PostListQueryDto) {
    const { page, pageSize, orderBy, sortBy, ...filter } = query;

    const where = this.queryHelper.buildWherePropForFind(
      filter,
      this.LIKE_SEARCH_FIELDS,
    );

    const order = this.queryHelper.buildOrderByPropForFind<PostField>({
      orderBy: [orderBy],
      sortBy: [sortBy],
    });

    return this.prismaService.post.findMany({
      where,
      orderBy: order,
      skip: page * pageSize,
      take: pageSize,
    });
  }

  async putUpdate(
    id: number,
    authorId: number,
    putUpdatePostDto: PutUpdatePostDto,
  ): Promise<Post> {
    const postByUser: Post | null =
      await this.postAuthorityHelper.checkIdentification(id, authorId);

    if (!postByUser) {
      throw new ForbiddenException();
    }

    return this.prismaService.post.update({
      where: {
        id,
      },
      data: {
        title: putUpdatePostDto.title,
        description: putUpdatePostDto.description,
      },
    });
  }

  async patchUpdate(
    id: number,
    authorId: number,
    patchUpdatePostDto: PatchUpdatePostDto,
  ): Promise<Post> {
    const postByUser: Post | null =
      await this.postAuthorityHelper.checkIdentification(id, authorId);

    if (!postByUser) {
      throw new ForbiddenException();
    }

    return this.prismaService.post.update({
      where: {
        id,
      },
      data: {
        description: patchUpdatePostDto.description,
      },
    });
  }

  async remove(id: number, authorId: number): Promise<Post> {
    const postByUser: Post | null =
      await this.postAuthorityHelper.checkIdentification(id, authorId);

    if (!postByUser) {
      throw new ForbiddenException();
    }

    return this.prismaService.post.delete({
      where: {
        id,
      },
    });
  }
}
