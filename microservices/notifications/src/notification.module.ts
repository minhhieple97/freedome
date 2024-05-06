import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/app/config.module';
import { NotificationService } from './notification.service';
import { EmailModule } from './consumers/email/email.module';
import { NotificationController } from './notification.controller';
import { ElasticsearchModule } from '@freedome/common/elasticsearch';
@Module({
  imports: [AppConfigModule, ElasticsearchModule, EmailModule],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
