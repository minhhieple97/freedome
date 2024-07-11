import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/app/config.module';
import { NotificationService } from './notification.service';
import { EmailModule } from './consumers/email/email.module';
import { ElasticsearchModule } from '@freedome/common/module/elasticsearch';
import { RabbitMQDynamicModule } from '@freedome/common/module/rabbitmq';
@Module({
  imports: [
    AppConfigModule,
    ElasticsearchModule,
    EmailModule,
    RabbitMQDynamicModule.forRootAsync(),
    NotificationModule,
  ],
  controllers: [],
  providers: [NotificationService],
  exports: [],
})
export class NotificationModule {}
