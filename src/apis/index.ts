import { AuthModule } from '@src/apis/auth/auth.module';
import { HealthModule } from '@src/apis/health/health.module';
import { PostsModule } from '@src/apis/posts/posts.module';
import { UsersModule } from '@src/apis/users/users.module';

export const apiModules = [HealthModule, AuthModule, UsersModule, PostsModule];
