import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/app/config.module';
import { RedisModule } from '@freedome/common/module';
import { SellerModule } from './seller/seller.module';
import { BuyerModule } from './buyer/buyer.module';
import { RabbitMQDynamicModule } from '@freedome/common/module/rabbitmq';
import { MongoDBModule } from './mongodb/mongodb.module';
import { UserService } from './user/user.service';
@Module({
  imports: [
    AppConfigModule,
    RedisModule,
    SellerModule,
    BuyerModule,
    MongoDBModule.forRootAsync(),
    RabbitMQDynamicModule.forRootAsync(),
  ],
  controllers: [],
  providers: [UserService],
})
export class UserModule {}
