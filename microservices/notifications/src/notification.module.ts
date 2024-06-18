import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/app/config.module';
import { NotificationService } from './notification.service';
import { EmailModule } from './consumers/email/email.module';
import { NotificationController } from './notification.controller';
import { ElasticsearchModule } from '@freedome/common/module/elasticsearch';
import { RabbitModule } from '@freedome/common/module';
@Module({
  imports: [AppConfigModule, ElasticsearchModule, EmailModule, RabbitModule],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
