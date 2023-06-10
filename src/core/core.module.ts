import { Module } from '@nestjs/common';
import { AppConfigModule } from '@src/core/app-config/app-config.module';
import { ExceptionFilterModule } from '@src/core/exception/exception-filter.module';
import { NotificationModule } from '@src/core/notification/notification.module';
import { PrismaModule } from '@src/core/prisma/prisma.module';

@Module({
  imports: [
    NotificationModule,
    PrismaModule,
    ExceptionFilterModule,
    AppConfigModule,
  ],
  exports: [NotificationModule, PrismaModule, AppConfigModule],
})
export class CoreModule {}
