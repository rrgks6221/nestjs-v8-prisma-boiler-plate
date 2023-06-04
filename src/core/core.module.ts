import { Module } from '@nestjs/common';
import { AuthModule } from '@src/apis/auth/auth.module';
import { ExceptionFilterModule } from '@src/core/exception/exception-filter.module';
import { NotificationModule } from '@src/core/notification/notification.module';
import { PrismaModule } from '@src/core/prisma/prisma.module';

@Module({
  imports: [
    NotificationModule,
    AuthModule,
    PrismaModule,
    ExceptionFilterModule,
  ],
  exports: [NotificationModule, AuthModule, PrismaModule],
})
export class CoreModule {}
