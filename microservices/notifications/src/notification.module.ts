import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/app/config.module';
import { HealthController } from './api/health/health.controller';
import { ElasticsearchModule } from './config/elasticsearch/elasticsearch.module';
import { NotificationService } from './notification.service';
import { EmailModule } from './consumers/email/email.module';
import { NotificationController } from './notification.controller';
@Module({
  imports: [AppConfigModule, ElasticsearchModule, EmailModule],
  controllers: [HealthController, NotificationController],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
