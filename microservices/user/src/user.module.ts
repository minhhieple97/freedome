import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/app/config.module';
import { RedisModule } from '@freedome/common/module';
import { SellerModule } from './seller/seller.module';
import { BuyerModule } from './buyer/buyer.module';
import { UserController } from './user.controller';
import { RabbitMQDynamicModule } from '@freedome/common/module/rabbitmq';
import { MongoDBModule } from './mongodb/mongodb.module';
@Module({
  imports: [
    AppConfigModule,
    RedisModule,
    SellerModule,
    BuyerModule,
    MongoDBModule.forRootAsync(),
    RabbitMQDynamicModule.forRootAsync(),
  ],
  controllers: [UserController],
  providers: [],
})
export class UserModule {}
