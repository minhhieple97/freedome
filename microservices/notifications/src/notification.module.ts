import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/app/config.module';
import { NotificationService } from './notification.service';
import { EmailModule } from './consumers/email/email.module';
import { ElasticsearchModule } from '@freedome/common/module/elasticsearch';
import { EXCHANGE_NAME } from '@freedome/common';
import { RabbitMQExchangeType } from '@freedome/common/enums';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { AppConfigService } from './config/app/config.service';
@Module({
  imports: [
    AppConfigModule,
    ElasticsearchModule,
    EmailModule,
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      imports: [AppConfigModule],
      useFactory: (appConfigService: AppConfigService) => ({
        exchanges: [
          {
            name: EXCHANGE_NAME.EMAIL_NOTIFICATIONS,
            type: RabbitMQExchangeType.Direct,
          },
          {
            name: EXCHANGE_NAME.SELLER_REVIEW,
            type: RabbitMQExchangeType.Topic,
          },
        ],
        uri: appConfigService.rabbitmqEndpoint,
        connectionInitOptions: { wait: false },
      }),
      inject: [AppConfigService],
    }),
    NotificationModule,
  ],
  controllers: [],
  providers: [NotificationService],
  exports: [],
})
export class NotificationModule {}
