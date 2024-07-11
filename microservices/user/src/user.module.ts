import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/app/config.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AppConfigService } from './config/app/config.service';
import { RedisModule } from '@freedome/common/module';
import { SellerModule } from './seller/seller.module';
import { BuyerModule } from './buyer/buyer.module';
import { UserController } from './user.controller';
import { RabbitMQDynamicModule } from '@freedome/common/module/rabbitmq';
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
    RabbitMQDynamicModule.forRootAsync(),
  ],
  controllers: [UserController],
  providers: [],
})
export class UserModule {}
