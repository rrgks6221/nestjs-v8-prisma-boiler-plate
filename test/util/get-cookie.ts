import { faker } from '@faker-js/faker';
import { INestApplication } from '@nestjs/common';
import { LoginType } from '@prisma/client';
import { UserResponseDto } from '@src/apis/users/dto/user-response.dto';
import request from 'supertest';

export const testingLogin = async (app: INestApplication) => {
  const userResponse = await request(app.getHttpServer())
    .post('/api/v1/auth/sign-up')
    .send({
      loginType: LoginType.EMAIL,
      password: 'password',
      email: faker.name.firstName() + 'e2etesting@email.com',
      nickname: faker.name.firstName() + 'e2testing',
    });

  return {
    user: userResponse.body.user as UserResponseDto,
    cookies: userResponse.headers['set-cookie'] as string[],
  };
};
