import {
  CacheModule,
  CacheStore,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from '@src/apis/auth/controllers/auth.controller';
import { AuthHelper } from '@src/apis/auth/helpers/auth.helper';
import { JwtRefreshStrategy } from '@src/apis/auth/jwt/jwt-refresh.strategy';
import { JwtStrategy } from '@src/apis/auth/jwt/jwt.strategy';
import { AuthService } from '@src/apis/auth/services/auth.service';
import { UsersModule } from '@src/apis/users/users.module';
import { BCRYPT_TOKEN } from '@src/constants/token.constant';
import { ENV_KEY } from '@src/core/app-config/constants/api-config.constant';
import { AppConfigService } from '@src/core/app-config/services/app-config.service';
import { PrismaService } from '@src/core/prisma/prisma.service';
import { UseDevelopmentMiddleware } from '@src/middlewares/use-development.middleware';
import bcrypt from 'bcrypt';
import redisStore from 'cache-manager-redis-store';
import { RedisClientOptions } from 'redis';

@Module({
  imports: [
    PassportModule,
    UsersModule,
    CacheModule.register<RedisClientOptions>({
      store: redisStore as unknown as CacheStore,
      url: 'redis://localhost:6379',
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      useFactory: (appConfigService: AppConfigService) => {
        return {
          secret: appConfigService.get<string>(ENV_KEY.JWT_ACCESS_TOKEN_SECRET),
        };
      },
      inject: [AppConfigService],
    }),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    JwtRefreshStrategy,
    PrismaService,
    AuthHelper,
    {
      provide: BCRYPT_TOKEN,
      useValue: bcrypt,
    },
  ],
  controllers: [AuthController],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UseDevelopmentMiddleware).forRoutes({
      path: 'api/auth/access-token/:id',
      method: RequestMethod.POST,
    });
  }
}
