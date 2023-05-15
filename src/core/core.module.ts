import { Module } from '@nestjs/common';
import { NotificationModule } from '@src/core/notification/notification.module';
import { AuthModule } from '@src/core/auth/auth.module';
import { PrismaModule } from '@src/core/database/prisma/prisma.module';
import { ExceptionFiltersModule } from '@src/core/exceptions/exception-filters.module';

@Module({
  imports: [
    NotificationModule,
    AuthModule,
    PrismaModule,
    ExceptionFiltersModule,
  ],
  exports: [NotificationModule, AuthModule, PrismaModule],
})
export class CoreModule {}
