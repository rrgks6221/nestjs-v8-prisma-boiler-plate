import { faker } from '@faker-js/faker';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreatePostBodyDto } from '@src/apis/posts/dto/create-post-body.dto';
import { FindPostListQueryDto } from '@src/apis/posts/dto/find-post-list-query-dto';
import { PatchUpdatePostBodyDto } from '@src/apis/posts/dto/patch-update-post-body.dto';
import { PutUpdatePostBodyDto } from '@src/apis/posts/dto/put-update-post-body-dto';
import { PostEntity } from '@src/apis/posts/entities/post.entity';
import { PostsService } from '@src/apis/posts/services/posts.service';
import { SortOrder } from '@src/constants/enum';
import { PrismaService } from '@src/core/prisma/prisma.service';
import { QueryHelper } from '@src/helpers/query.helper';
import { MockQueryHelper } from '@test/mock/helper.mock';
import { mockPrismaService } from '@test/mock/prisma-service.mock';

describe('PostsService', () => {
  let service: PostsService;
  let mockQueryHelper: MockQueryHelper;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: QueryHelper,
          useClass: MockQueryHelper,
        },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
    mockQueryHelper = module.get(QueryHelper);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllAndCount', () => {
    let findPostListQueryDto: FindPostListQueryDto;

    let posts: PostEntity[];
    let count: number;

    beforeEach(() => {
      findPostListQueryDto = {
        title: 'title',
        page: 1,
        pageSize: 20,
        orderBy: {
          id: SortOrder.Desc,
        },
      };

      posts = [new PostEntity()];
      count = 1;
    });

    it('find post all and count', async () => {
      mockQueryHelper.buildWherePropForFind.mockReturnValue({
        title: 'title',
      });

      mockPrismaService.$transaction.mockResolvedValue([posts, count]);

      await expect(
        service.findAllAndCount(findPostListQueryDto),
      ).resolves.toStrictEqual([posts, count]);
      expect(mockQueryHelper.buildWherePropForFind).toBeCalledWith(
        { title: 'title' },
        expect.anything(),
      );
      expect(mockPrismaService.post.findMany).toBeCalledWith({
        where: expect.anything(),
        orderBy: expect.anything(),
        skip: 20,
        take: 20,
      });
      expect(mockPrismaService.post.count).toBeCalledWith({
        where: expect.anything(),
      });
    });
  });

  describe('findOne', () => {
    let postId: number;
    let existPost: PostEntity;

    let postEntity: PostEntity;

    beforeEach(() => {
      postId = faker.datatype.number({ min: 1 });
      existPost = new PostEntity();

      postEntity = new PostEntity();

      mockPrismaService.post.findUniqueOrThrow.mockResolvedValue(postEntity);
    });

    it('post is not found', async () => {
      mockPrismaService.post.findFirst.mockResolvedValue(null);

      await expect(service.findOne(postId)).rejects.toThrowError(
        NotFoundException,
      );
    });

    it('find one post', async () => {
      mockPrismaService.post.findFirst.mockResolvedValue(existPost);

      await expect(service.findOne(postId)).resolves.toStrictEqual(postEntity);
    });
  });

  describe('create', () => {
    let userId: number;
    let createPostBodyDto: CreatePostBodyDto;

    let newPost: PostEntity;

    let postEntity: PostEntity;

    beforeEach(() => {
      userId = faker.datatype.number({ min: 1 });
      createPostBodyDto = new CreatePostBodyDto();

      newPost = new PostEntity();

      postEntity = new PostEntity();

      mockPrismaService.post.findUniqueOrThrow.mockResolvedValue(postEntity);
    });

    it('create new post', async () => {
      mockPrismaService.post.create.mockResolvedValue(newPost);

      await expect(
        service.create(userId, createPostBodyDto),
      ).resolves.toStrictEqual(postEntity);
    });
  });

  describe('putUpdate', () => {
    let postId: number;
    let userId: number;
    let putUpdatePostDto: PutUpdatePostBodyDto;

    let newPost: PostEntity;

    let postEntity: PostEntity;

    beforeEach(() => {
      postId = faker.datatype.number({ min: 1 });
      userId = faker.datatype.number({ min: 1 });
      putUpdatePostDto = new PutUpdatePostBodyDto();

      newPost = new PostEntity({});

      postEntity = new PostEntity({
        userId,
        id: postId,
      });

      mockPrismaService.post.findFirst.mockResolvedValue(postEntity);
      mockPrismaService.post.findUniqueOrThrow.mockResolvedValue(postEntity);
    });

    it('put update post', async () => {
      mockPrismaService.post.update.mockResolvedValue(newPost);

      await expect(
        service.putUpdate(postId, userId, putUpdatePostDto),
      ).resolves.toStrictEqual(postEntity);
    });
  });

  describe('patchUpdate', () => {
    let postId: number;
    let userId: number;
    let patchUpdatePostDto: PatchUpdatePostBodyDto;

    let newPost: PostEntity;

    let postEntity: PostEntity;

    beforeEach(() => {
      postId = faker.datatype.number({ min: 1 });
      userId = faker.datatype.number({ min: 1 });
      patchUpdatePostDto = new PatchUpdatePostBodyDto();

      newPost = new PostEntity({});

      postEntity = new PostEntity({
        userId,
        id: postId,
      });

      mockPrismaService.post.findFirst.mockResolvedValue(postEntity);
      mockPrismaService.post.findUniqueOrThrow.mockResolvedValue(postEntity);
    });

    it('patch update post', async () => {
      mockPrismaService.post.update.mockResolvedValue(newPost);

      await expect(
        service.patchUpdate(postId, userId, patchUpdatePostDto),
      ).resolves.toStrictEqual(postEntity);
    });
  });

  describe('remove', () => {
    let postId: number;
    let userId: number;

    let existPost: PostEntity;

    let deletedPost: PostEntity;

    beforeEach(() => {
      postId = faker.datatype.number({ min: 1 });
      userId = faker.datatype.number({ min: 1 });

      existPost = new PostEntity({
        userId,
        id: postId,
      });

      deletedPost = new PostEntity({
        deletedAt: new Date(),
      });

      mockPrismaService.post.findFirst.mockResolvedValue(existPost);
    });

    it('soft delete post', async () => {
      mockPrismaService.post.update.mockResolvedValue(deletedPost);

      await expect(service.remove(postId, userId)).resolves.toBe(1);
    });
  });

  describe('private method test with public method', () => {
    describe('checkOwner with remove', () => {
      let postId: number;
      let userId: number;

      let existPost: PostEntity;

      let removedPost: PostEntity;

      beforeEach(() => {
        postId = faker.datatype.number({ min: 1 });
        userId = faker.datatype.number({ min: 1 });

        removedPost = new PostEntity();

        mockPrismaService.post.update.mockResolvedValue(removedPost);
      });

      it('not found post', async () => {
        mockPrismaService.post.findFirst.mockResolvedValue(existPost);

        await expect(service.remove(postId, userId)).rejects.toThrowError(
          NotFoundException,
        );
      });

      it('not owner post', async () => {
        existPost = new PostEntity({
          id: postId,
          userId: userId + 1,
        });

        mockPrismaService.post.findFirst.mockResolvedValue(existPost);

        await expect(service.remove(postId, userId)).rejects.toThrowError(
          ForbiddenException,
        );
      });

      it('owner post', async () => {
        existPost = new PostEntity({
          userId,
          id: postId,
        });

        mockPrismaService.post.findFirst.mockResolvedValue(existPost);

        await expect(service.remove(postId, userId)).resolves.toBe(1);
      });
    });

    describe('buildBaseResponse with findOne', () => {
      let postId: number;

      let existPost: PostEntity;

      let postEntity: PostEntity;

      beforeEach(() => {
        postId = faker.datatype.number({ min: 1 });

        existPost = new PostEntity();

        mockPrismaService.post.findFirst.mockResolvedValueOnce(existPost);

        postEntity = new PostEntity();
      });

      it('not found post throw error', async () => {
        mockPrismaService.post.findUniqueOrThrow.mockRejectedValue(new Error());

        await expect(service.findOne(postId)).rejects.toThrow();
      });

      it('return post', async () => {
        mockPrismaService.post.findUniqueOrThrow.mockResolvedValue(postEntity);

        await expect(service.findOne(postId)).resolves.toStrictEqual(
          postEntity,
        );
      });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
