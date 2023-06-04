import { Module } from '@nestjs/common';
import { PrismaModule } from '@src/core/prisma/prisma.module';
import { QueryHelper } from '@src/helpers/query.helper';
import { PostsController } from './controllers/posts.controller';
import { PostsService } from './services/posts.service';

@Module({
  imports: [PrismaModule],
  controllers: [PostsController],
  providers: [PostsService, QueryHelper],
})
export class PostsModule {}
