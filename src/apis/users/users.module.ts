import { Module } from '@nestjs/common';
import { UsersController } from '@src/apis/users/controllers/users.controller';
import { UsersService } from '@src/apis/users/services/users.service';
import { PrismaModule } from '@src/core/prisma/prisma.module';
import { QueryHelper } from '@src/helpers/query.helper';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [UsersService, QueryHelper],
  exports: [UsersService],
})
export class UsersModule {}
