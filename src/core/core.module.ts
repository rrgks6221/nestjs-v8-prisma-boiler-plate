import { Module } from '@nestjs/common';
import { AppConfigModule } from '@src/core/app-config/app-config.module';
import { NotificationModule } from '@src/core/notification/notification.module';
import { PrismaModule } from '@src/core/prisma/prisma.module';
import { HttpExceptionModule } from '@src/http-exceptions/http-exception.module';
import { AppCacheModule } from './app-cache/app-cache.module';

@Module({
  imports: [
    NotificationModule,
    PrismaModule,
    HttpExceptionModule,
    AppConfigModule,
    AppCacheModule,
  ],
})
export class CoreModule {}
