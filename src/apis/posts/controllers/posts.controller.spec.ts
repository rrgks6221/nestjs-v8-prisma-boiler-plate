import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from '@src/apis/posts/controllers/posts.controller';
import { CreatePostBodyDto } from '@src/apis/posts/dto/create-post-body.dto';
import { FindPostListQueryDto } from '@src/apis/posts/dto/find-post-list-query-dto';
import { PatchUpdatePostBodyDto } from '@src/apis/posts/dto/patch-update-post-body.dto';
import { PutUpdatePostBodyDto } from '@src/apis/posts/dto/put-update-post-body-dto';
import { PostEntity } from '@src/apis/posts/entities/post.entity';
import { PostsService } from '@src/apis/posts/services/posts.service';
import { UserEntity } from '@src/apis/users/entities/user.entity';
import { MockPostsService } from '@test/mock/services.mock';

describe('PostsController', () => {
  let controller: PostsController;
  let mockPostsService: MockPostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [
        {
          provide: PostsService,
          useClass: MockPostsService,
        },
      ],
    }).compile();

    controller = module.get<PostsController>(PostsController);
    mockPostsService = module.get(PostsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAllAndCount', () => {
    let query: FindPostListQueryDto;

    let posts: PostEntity[];
    let totalCount: number;

    beforeEach(() => {
      query = new FindPostListQueryDto();

      posts = [new PostEntity()];
      totalCount = faker.datatype.number();
    });

    it('only routing and service method called', async () => {
      mockPostsService.findAllAndCount.mockResolvedValue([posts, totalCount]);

      await expect(controller.findAllAndCount(query)).resolves.toStrictEqual([
        posts,
        totalCount,
      ]);
      expect(mockPostsService.findAllAndCount).toBeCalledWith(query);
    });
  });

  describe('findOne', () => {
    let postId: number;

    let post: PostEntity;

    beforeEach(() => {
      postId = faker.datatype.number({ min: 1 });

      post = new PostEntity();
    });

    it('only routing and service method called', async () => {
      mockPostsService.findOne.mockResolvedValue(post);

      await expect(controller.findOne(postId)).resolves.toStrictEqual(post);
      expect(mockPostsService.findOne).toBeCalledWith(postId);
    });
  });

  describe('create', () => {
    let user: UserEntity;
    let body: CreatePostBodyDto;

    let post: PostEntity;

    beforeEach(() => {
      user = new UserEntity();
      body = new CreatePostBodyDto();

      post = new PostEntity();
    });

    it('only routing and service method called', async () => {
      mockPostsService.create.mockResolvedValue(post);

      await expect(controller.create(user, body)).resolves.toStrictEqual(post);
      expect(mockPostsService.create).toBeCalledWith(user.id, body);
    });
  });

  describe('putUpdate', () => {
    let postId: number;
    let user: UserEntity;
    let putUpdatePostDto: PutUpdatePostBodyDto;

    let post: PostEntity;

    beforeEach(() => {
      postId = faker.datatype.number({ min: 1 });
      user = new UserEntity();
      putUpdatePostDto = new PutUpdatePostBodyDto();

      post = new PostEntity();
    });

    it('only routing and service method called', async () => {
      mockPostsService.putUpdate.mockResolvedValue(post);

      await expect(
        controller.putUpdate(postId, user, putUpdatePostDto),
      ).resolves.toStrictEqual(post);
      expect(mockPostsService.putUpdate).toBeCalledWith(
        postId,
        user.id,
        putUpdatePostDto,
      );
    });
  });

  describe('patchUpdate', () => {
    let postId: number;
    let user: UserEntity;
    let patchUpdatePostDto: PatchUpdatePostBodyDto;

    let post: PostEntity;

    beforeEach(() => {
      postId = faker.datatype.number({ min: 1 });
      user = new UserEntity();
      patchUpdatePostDto = new PatchUpdatePostBodyDto();

      post = new PostEntity();
    });

    it('only routing and service method called', async () => {
      mockPostsService.patchUpdate.mockResolvedValue(post);

      await expect(
        controller.patchUpdate(postId, user, patchUpdatePostDto),
      ).resolves.toStrictEqual(post);
      expect(mockPostsService.patchUpdate).toBeCalledWith(
        postId,
        user.id,
        patchUpdatePostDto,
      );
    });
  });

  describe('remove', () => {
    let postId: number;
    let user: UserEntity;

    let count: number;

    beforeEach(() => {
      postId = faker.datatype.number({ min: 1 });
      user = new UserEntity();

      count = faker.datatype.number();
    });

    it('only routing and service method called', async () => {
      mockPostsService.remove.mockResolvedValue(count);

      await expect(controller.remove(postId, user)).resolves.toStrictEqual(
        count,
      );
      expect(mockPostsService.remove).toBeCalledWith(postId, user.id);
    });
  });
});
