import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/app/config.module';
import { HealthController } from './api/health/health.controller';

@Module({
  imports: [AppConfigModule],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
