import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreatePostDto } from '../dto/create-post.dto';
import { PrismaService } from '@src/core/database/prisma/prisma.service';
import { Post } from '@prisma/client';
import { PostEntity } from '@src/apis/post/entities/post.entity';
import { PatchUpdatePostDto } from '@src/apis/post/dto/patch-update-post.dto';
import { PostAuthorityHelper } from '@src/apis/post/helpers/post-authority.helper';
import { PutUpdatePostDto } from '@src/apis/post/dto/put-update-post-dto';
import { QueryHelper } from '@src/helpers/query.helper';
import { PostListQueryDto } from '@src/apis/post/dto/post-list-query-dto';
import { PostField } from '@src/apis/post/constants/enum';

@Injectable()
export class PostService {
  private readonly LIKE_SEARCH_FIELDS = [
    PostField.Title,
    PostField.Description,
  ];

  constructor(
    private readonly prismaService: PrismaService,
    private readonly postAuthorityHelper: PostAuthorityHelper,
    private readonly queryHelper: QueryHelper,
  ) {}

  create(userId: number, createPostDto: CreatePostDto): Promise<Post> {
    return this.prismaService.post.create({
      data: {
        title: createPostDto.title,
        description: createPostDto.description,
        authorId: userId,
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

  findOne(id: number): Promise<Post | null> {
    return this.prismaService.post.findUnique({
      where: {
        id,
      },
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
        published: patchUpdatePostDto.published,
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
