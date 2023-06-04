import { Module } from '@nestjs/common';
import { AuthModule } from '@src/apis/auth/auth.module';
import { PrismaModule } from '@src/core/prisma/prisma.module';
import { IsRecordConstraint } from '@src/decorators/is-record.decorator';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [UsersController],
  providers: [UsersService, IsRecordConstraint],
})
export class UsersModule {}
