import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { AppConfigService } from '@src/core/app-config/services/app-config.service';

@Module({
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule implements OnApplicationBootstrap {
  constructor(private readonly appConfigService: AppConfigService) {}

  onApplicationBootstrap() {
    console.log(this.appConfigService.getAllMap());
  }
}
