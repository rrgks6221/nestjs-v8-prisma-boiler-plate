import { HttpStatus, INestApplication } from '@nestjs/common';
import { LoginType } from '@prisma/client';
import { AuthModule } from '@src/apis/auth/auth.module';
import { UserEntity } from '@src/apis/users/entities/user.entity';
import { ERROR_CODE } from '@src/constants/error-response-code.constant';
import { PrismaService } from '@src/core/prisma/prisma.service';
import { createTestingApp } from '@test/util/create-testing-app';
import { testingLogin } from '@test/util/get-cookie';
import request from 'supertest';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let basePath: string;

  let testingUser: UserEntity;

  let testingCookies: string[];

  beforeAll(async () => {
    app = await createTestingApp(AuthModule);

    await app.init();

    basePath = '/api/v1/auth';

    prismaService = app.get(PrismaService);
  });

  describe('/api/v1/auth/profile (GET)', () => {
    it('get logged in user profile', async () => {
      const path = basePath + '/' + 'profile';
      const { cookies } = await testingLogin(app);

      const result = await request(app.getHttpServer())
        .get(path)
        .set('Cookie', cookies);

      const { statusCode, body } = result;
      const { user } = body;
      const { id, loginType, email, nickname } = user;

      expect(statusCode).toBe(HttpStatus.OK);

      expect(id).toBeInteger();
      expect(loginType).toBeString();
      expect(email).toBeString();
      expect(nickname).toBeString();

      await prismaService.user.delete({
        where: {
          id,
        },
      });
    });
  });

  describe('/api/v1/auth/sign-up (POST)', () => {
    it('sign up', async () => {
      const path = basePath + '/' + 'sign-up';

      const result = await request(app.getHttpServer()).post(path).send({
        loginType: LoginType.EMAIL,
        password: 'password',
        email: 'authee2esignup@test.com',
        nickname: 'authe2esignuptest',
      });

      const { statusCode, body, headers } = result;
      const { user } = body;
      const { id, loginType, email, nickname } = user;

      expect(statusCode).toBe(HttpStatus.CREATED);

      expect(id).toBeInteger();
      expect(loginType).toBeString();
      expect(email).toBeString();
      expect(nickname).toBeString();

      const [accessToken, refreshToken] = headers['set-cookie'];

      expect(accessToken).toContain('access_token');
      expect(refreshToken).toContain('refresh_token');

      await prismaService.user.delete({
        where: {
          id,
        },
      });
    });
  });

  describe('/api/v1/auth/sign-in (POST)', () => {
    it('not exist email', async () => {
      const path = basePath + '/' + 'sign-in';

      const result = await request(app.getHttpServer()).post(path).send({
        email: 'notexisteamil@email.com',
        password: 'password',
      });

      const { statusCode, body } = result;

      const { errorCode } = body;

      expect(statusCode).toBe(HttpStatus.UNAUTHORIZED);
      expect(errorCode).toBe(ERROR_CODE.CODE004);
    });

    it('not matching password', async () => {
      await request(app.getHttpServer())
        .post(basePath + '/' + 'sign-up')
        .send({
          loginType: LoginType.EMAIL,
          password: 'password',
          email: 'authee2esignin@test.com',
          nickname: 'authe2esignintest',
        });

      const path = basePath + '/' + 'sign-in';

      const result = await request(app.getHttpServer()).post(path).send({
        email: 'authee2esignin@test.com',
        password: 'wrongPassword',
      });

      const { statusCode, body } = result;

      const { errorCode } = body;

      expect(statusCode).toBe(HttpStatus.FORBIDDEN);
      expect(errorCode).toBe(ERROR_CODE.CODE006);
    });

    it('login', async () => {
      const path = basePath + '/' + 'sign-in';

      await request(app.getHttpServer())
        .post(basePath + '/' + 'sign-up')
        .send({
          loginType: LoginType.EMAIL,
          password: 'password',
          email: 'authee2esignin@test.com',
          nickname: 'authe2esignintest',
        });

      const result = await request(app.getHttpServer()).post(path).send({
        password: 'password',
        email: 'authee2esignin@test.com',
      });

      const { statusCode, body, headers } = result;
      const { user } = body;
      const { id, loginType, email, nickname } = user;

      expect(statusCode).toBe(HttpStatus.CREATED);

      expect(id).toBeInteger();
      expect(loginType).toBeString();
      expect(email).toBeString();
      expect(nickname).toBeString();

      const [accessToken, refreshToken] = headers['set-cookie'];

      expect(accessToken).toContain('access_token');
      expect(refreshToken).toContain('refresh_token');

      await prismaService.user.delete({
        where: {
          id,
        },
      });
    });
  });

  describe('/api/v1/auth/sign-out (POST)', () => {
    it('not logged in', async () => {
      const path = basePath + '/' + 'sign-out';

      const result = await request(app.getHttpServer()).post(path);

      const { statusCode, body } = result;
      const { errorCode } = body;

      expect(statusCode).toBe(HttpStatus.UNAUTHORIZED);
      expect(errorCode).toBe(ERROR_CODE.CODE004);
    });

    it('sign out', async () => {
      const { cookies } = await testingLogin(app);

      const path = basePath + '/' + 'sign-out';

      const result = await request(app.getHttpServer())
        .post(path)
        .set('Cookie', cookies);

      const { statusCode } = result;

      expect(statusCode).toBe(HttpStatus.NO_CONTENT);
    });
  });

  describe('/api/v1/auth/refresh (POST)', () => {
    it('generate new access token', async () => {
      const oldCookies = (await testingLogin(app)).cookies;
      const oldAccessToken = oldCookies.find((el) => {
        return el.startsWith('access_token');
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const path = basePath + '/' + 'refresh';

      const result = await request(app.getHttpServer())
        .post(path)
        .set('Cookie', oldCookies);

      const { statusCode, headers } = result;
      const newCookies = headers['set-cookie'];
      const newAccessToken = newCookies.find((el: string) => {
        return el.startsWith('access_token');
      });

      expect(statusCode).toBe(HttpStatus.NO_CONTENT);
      expect(oldAccessToken).not.toBe(newAccessToken);
    });
  });
});
