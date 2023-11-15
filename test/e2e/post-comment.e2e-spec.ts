import { HttpStatus, INestApplication } from '@nestjs/common';
import { PostCommentEntity } from '@src/apis/post-comments/entities/post-comment.entity';
import { PostCommentsModule } from '@src/apis/post-comments/post-comments.module';
import { PostEntity } from '@src/apis/posts/entities/post.entity';
import { UserEntity } from '@src/apis/users/entities/user.entity';
import { PrismaService } from '@src/core/prisma/prisma.service';
import { createTestingApp } from '@test/util/create-testing-app';
import { testingLogin } from '@test/util/testing-login';
import request from 'supertest';

describe('PostCommentsController (e2e)', () => {
  let postId = NaN;
  let basePath = '';

  let app: INestApplication;
  let prismaService: PrismaService;

  let testingUser: UserEntity;
  let testingCookies: string[];
  let testingPost: PostEntity;
  let testingPostComment: PostCommentEntity;

  beforeAll(async () => {
    app = await createTestingApp(PostCommentsModule);

    await app.init();

    prismaService = app.get(PrismaService);

    const { user, cookies } = await testingLogin(app);

    testingUser = user;
    testingCookies = cookies;

    testingPost = await prismaService.post.create({
      data: {
        userId: testingUser.id,
        title: 'post comments testing title',
        description: 'post comments testing description',
      },
    });

    postId = testingPost.id;
    basePath = `/api/v1/posts/${postId}/post-comments`;

    testingPostComment = await prismaService.postComment.create({
      data: {
        userId: testingUser.id,
        postId: testingPost.id,
        description: 'post comment e2e testing description',
      },
    });
  });

  afterAll(async () => {
    await prismaService.postComment.deleteMany({
      where: {
        id: testingPostComment.id,
      },
    });
    await prismaService.post.deleteMany({
      where: {
        id: testingPost.id,
      },
    });
    await prismaService.user.deleteMany({
      where: {
        id: testingUser.id,
      },
    });
  });

  describe('/api/v1/posts/:postId/post-comments (GET)', () => {
    it('default options findAllAndCount', async () => {
      const result = await request(app.getHttpServer()).get(basePath);

      const { statusCode, body } = result;
      const {
        totalCount,
        pageSize,
        currentPage,
        nextPage,
        hasNext,
        lastPage,
        postComments,
      } = body;
      const postComment = postComments[0];
      const { id, userId, postId, description } = postComment;

      expect(statusCode).toBe(HttpStatus.OK);

      expect(totalCount).toBeGreaterThanOrEqual(1);
      expect(pageSize).toBeGreaterThanOrEqual(1);
      expect(currentPage).toBeGreaterThanOrEqual(1);
      expect(nextPage).toBeInteger({ nullable: true });
      expect(hasNext).toBeBoolean();
      expect(lastPage).toBeGreaterThanOrEqual(1);

      expect(postComments.length).toBeLessThanOrEqual(20);
      expect(id).toBeInteger();
      expect(userId).toBeInteger();
      expect(postId).toBeInteger();
      expect(description).toBeString();
    });
  });

  describe.skip('/api/v1/posts/:postId/post-comments (POST)', () => {
    it('create post comment', async () => {
      const result = await request(app.getHttpServer())
        .post(basePath)
        .send({
          description: 'post comment e2e testing description',
        })
        .set('Cookie', testingCookies);

      const { statusCode, body } = result;
      const { postComment } = body;
      const { id, userId, postId, description } = postComment;

      expect(statusCode).toBe(HttpStatus.CREATED);

      expect(id).toBeInteger();
      expect(userId).toBeInteger();
      expect(postId).toBeInteger();
      expect(description).toBeString();
    });
  });

  describe('/api/v1/posts/:postId/post-comments/:postCommentId (GET)', () => {
    it('find one post comment', async () => {
      const result = await request(app.getHttpServer()).get(
        basePath + '/' + testingPostComment.id,
      );

      const { statusCode, body } = result;
      const { postComment } = body;
      const { id, postId, userId, description } = postComment;

      expect(statusCode).toBe(HttpStatus.OK);

      expect(id).toBeInteger();
      expect(postId).toBeInteger();
      expect(userId).toBeInteger();
      expect(description).toBeString();
    });
  });

  describe.skip('/api/v1/posts/:postId/post-comments/:postCommentId (PUT)', () => {
    it('put update post comment', async () => {
      const updateDescription =
        'put updated post comment put update e2e testing description';
      const result = await request(app.getHttpServer())
        .put(basePath + '/' + testingPostComment.id)
        .send({
          description: updateDescription,
        })
        .set('Cookie', testingCookies);

      const { statusCode, body } = result;
      const { postComment } = body;
      const { id, postId, userId, description } = postComment;

      expect(statusCode).toBe(HttpStatus.OK);

      expect(id).toBeInteger();
      expect(postId).toBeInteger();
      expect(userId).toBeInteger();
      expect(description).toBe(updateDescription);
    });
  });

  describe.skip('/api/v1/posts/:postId/post-comments/:postCommentId (PATCH)', () => {
    it('patch update post comment', async () => {
      const updateDescription =
        'patch updated post comment patch update e2e testing description';
      const result = await request(app.getHttpServer())
        .patch(basePath + '/' + testingPostComment.id)
        .send({
          description: updateDescription,
        })
        .set('Cookie', testingCookies);

      const { statusCode, body } = result;
      const { postComment } = body;
      const { id, postId, userId, description } = postComment;

      expect(statusCode).toBe(HttpStatus.OK);

      expect(id).toBeInteger();
      expect(postId).toBeInteger();
      expect(userId).toBeInteger();
      expect(description).toBe(updateDescription);
    });
  });

  describe.skip('/api/v1/posts/:postId/post-comments/:postCommentId (DELETE)', () => {
    let newPostComment: PostCommentEntity;

    beforeAll(async () => {
      const postComment = await prismaService.postComment.create({
        data: {
          userId: testingUser.id,
          postId: testingPost.id,
          description: 'post comment delete e2e testing description',
        },
      });

      newPostComment = postComment;
    });

    it('delete post comment', async () => {
      const result = await request(app.getHttpServer())
        .delete(basePath + '/' + newPostComment.id)
        .set('Cookie', testingCookies);

      const { statusCode, body } = result;
      const { postComment } = body;
      const { count } = postComment;

      expect(statusCode).toBe(HttpStatus.OK);

      expect(count).toBeInteger();
    });

    afterAll(async () => {
      await prismaService.postComment.delete({
        where: {
          id: newPostComment.id,
        },
      });
    });
  });
});
