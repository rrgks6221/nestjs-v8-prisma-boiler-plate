import { HttpStatus, INestApplication } from '@nestjs/common';
import { UsersModule } from '@src/apis/users/users.module';
import { ERROR_CODE } from '@src/constants/error-response-code.constant';
import { createTestingApp } from '@test/util/create-testing-app';
import request from 'supertest';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let basePath: string;

  beforeEach(async () => {
    app = await createTestingApp(UsersModule);

    await app.init();

    basePath = '/api/v1/users';
  });

  describe('/api/v1/users (GET)', () => {
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
        users,
      } = body;
      const user = users[0];
      const { id, loginType, email, nickname } = user;

      expect(statusCode).toBe(HttpStatus.OK);

      expect(totalCount).toBeGreaterThanOrEqual(1);
      expect(pageSize).toBeGreaterThanOrEqual(1);
      expect(currentPage).toBeGreaterThanOrEqual(1);
      expect(nextPage).toBeInteger({ nullable: true });
      expect(hasNext).toBeBoolean();
      expect(lastPage).toBeGreaterThanOrEqual(1);

      expect(users.length).toBeLessThanOrEqual(20);
      expect(id).toBeInteger();
      expect(loginType).toBeString();
      expect(email).toBeString();
      expect(nickname).toBeString();
    });
  });

  describe('/api/v1/users/:userId (GET)', () => {
    it('not found user', async () => {
      basePath += '/' + '999999999';

      const result = await request(app.getHttpServer()).get(basePath);
      const { statusCode, body } = result;
      const { errorCode } = body;

      expect(statusCode).toBe(HttpStatus.NOT_FOUND);
      expect(errorCode).toBe(ERROR_CODE.CODE005);
    });

    it('user detail response', async () => {
      const httpServer = request(app.getHttpServer());
      const listResponse = await httpServer.get(basePath).query({
        pageSize: 1,
      });

      basePath += '/' + listResponse.body.users[0].id;

      const result = await request(app.getHttpServer()).get(basePath);
      const { statusCode, body } = result;
      const { user } = body;
      const { id, loginType, email, nickname } = user;

      expect(statusCode).toBe(HttpStatus.OK);

      expect(id).toBeInteger();
      expect(loginType).toBeString();
      expect(email).toBeString();
      expect(nickname).toBeString();
    });
  });

  describe('/api/v1/users/:userId (PATCH)', () => {});

  describe('/api/v1/users/:userId (PUT)', () => {});

  describe('/api/v1/users/:userId (DELETE)', () => {});
});
