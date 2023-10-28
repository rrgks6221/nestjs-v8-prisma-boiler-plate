import { JwtService } from '@nestjs/jwt';
import { AuthService } from '@src/apis/auth/services/auth.service';
import { PostsService } from '@src/apis/posts/services/posts.service';
import { UsersService } from '@src/apis/users/services/users.service';
import { AppConfigService } from '@src/core/app-config/services/app-config.service';
import { MockClass } from '@test/mock/type';

export class MockJwtService implements MockClass<JwtService> {
  sign = jest.fn();
  signAsync = jest.fn();
  verify = jest.fn();
  verifyAsync = jest.fn();
  decode = jest.fn();
}

export class MockHealthCheckService
  implements MockClass<MockHealthCheckService>
{
  check = jest.fn();
}

export class MockUserService implements MockClass<UsersService> {
  findAllAndCount = jest.fn();
  findOne = jest.fn();
  findOneBy = jest.fn();
  patchUpdate = jest.fn();
  putUpdate = jest.fn();
  remove = jest.fn();
  buildBaseResponse = jest.fn();
  create = jest.fn();
  findOneOrNotFound = jest.fn();
}

export class MockPostsService implements MockClass<PostsService> {
  findAllAndCount = jest.fn();
  create = jest.fn();
  findOneOrNotFound = jest.fn();
  putUpdate = jest.fn();
  patchUpdate = jest.fn();
  remove = jest.fn();
  buildBaseResponse = jest.fn();
}

export class MockAuthService implements MockClass<AuthService> {
  signUp = jest.fn();
  signIn = jest.fn();
  generateAccessToken = jest.fn();
  generateRefreshToken = jest.fn();
  setAuthToken = jest.fn();
  clearAuthToken = jest.fn();
  createAccessToken = jest.fn();
  login = jest.fn();
}

export class MockAppConfigService implements MockClass<AppConfigService> {
  get = jest.fn();
  getList = jest.fn();
  getAll = jest.fn();
  getAllMap = jest.fn();
  isLocal = jest.fn();
  isDevelopment = jest.fn();
  isProduction = jest.fn();
}
