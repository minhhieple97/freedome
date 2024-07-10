import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/app/config.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AppConfigService } from './config/app/config.service';
import { RedisModule } from '@freedome/common/module';
import { SellerModule } from './seller/seller.module';
import { BuyerModule } from './buyer/buyer.module';
import { UserController } from './user.controller';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { EXCHANGE_NAME } from '@freedome/common';
import { RabbitMQExchangeType } from '@freedome/common/enums';
@Module({
  imports: [
    AppConfigModule,
    RedisModule,
    SellerModule,
    BuyerModule,
    MongooseModule.forRootAsync({
      imports: [AppConfigModule],
      useFactory: async (appConfigService: AppConfigService) => ({
        uri: appConfigService.getMongoUri(),
      }),
      inject: [AppConfigService],
    }),
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      imports: [AppConfigModule],
      useFactory: (appConfigService: AppConfigService) => ({
        // queues: [],
        exchanges: [
          {
            name: EXCHANGE_NAME.USER_BUYER,
            type: RabbitMQExchangeType.Direct,
          },
          {
            name: EXCHANGE_NAME.USER_SELLER,
            type: RabbitMQExchangeType.Direct,
          },
          {
            name: EXCHANGE_NAME.SELLER_REVIEW,
            type: RabbitMQExchangeType.Topic,
          },
          {
            name: 'aumo.topic',
            type: 'topic',
          },
        ],
        uri: appConfigService.rabbitmqEndpoint,
        connectionInitOptions: { wait: false },
      }),
      inject: [AppConfigService],
    }),
  ],
  controllers: [UserController],
  providers: [],
})
export class UserModule {}
