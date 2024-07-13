import { Module, DynamicModule, Global } from '@nestjs/common';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { EXCHANGE_NAME } from '@freedome/common';
import { RabbitMQExchangeType } from '@freedome/common/enums';

@Global()
@Module({})
export class RabbitMQDynamicModule {
  static forRootAsync(): DynamicModule {
    return {
      module: RabbitMQDynamicModule,
      imports: [
        RabbitMQModule.forRootAsync(RabbitMQModule, {
          imports: [],
          useFactory: () => ({
            exchanges: [
              {
                name: EXCHANGE_NAME.EMAIL_NOTIFICATIONS,
                type: RabbitMQExchangeType.Direct,
              },
              {
                name: EXCHANGE_NAME.USER_BUYER,
                type: RabbitMQExchangeType.Direct,
              },
              {
                name: EXCHANGE_NAME.SELLER_REVIEW,
                type: RabbitMQExchangeType.Topic,
              },
              {
                name: EXCHANGE_NAME.GIG,
                type: RabbitMQExchangeType.Direct,
              },
              {
                name: EXCHANGE_NAME.USER_SELLER,
                type: RabbitMQExchangeType.Direct,
              },
            ],
            uri: process.env.RABBITMQ_ENDPOINT,
            connectionInitOptions: { wait: false },
          }),
          inject: [],
        }),
      ],
      exports: [RabbitMQModule],
    };
  }
}
