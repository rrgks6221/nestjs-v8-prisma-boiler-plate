import { Module } from '@nestjs/common';
import { PostsController } from '@src/apis/posts/controllers/posts.controller';
import { PostsService } from '@src/apis/posts/services/posts.service';
import { PrismaModule } from '@src/core/prisma/prisma.module';
import { QueryHelper } from '@src/helpers/query.helper';

@Module({
  imports: [PrismaModule],
  controllers: [PostsController],
  providers: [PostsService, QueryHelper],
})
export class PostsModule {}
