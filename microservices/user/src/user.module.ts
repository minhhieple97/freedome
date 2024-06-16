import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/app/config.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AppConfigService } from './config/app/config.service';
import { RabbitModule, RedisModule } from '@freedome/common/module';
import { SellerModule } from './seller/seller.module';
import { BuyerModule } from './buyer/buyer.module';
@Module({
  imports: [
    AppConfigModule,
    RedisModule,
    SellerModule,
    BuyerModule,
    RabbitModule,
    MongooseModule.forRootAsync({
      imports: [AppConfigModule],
      useFactory: async (appConfigService: AppConfigService) => ({
        uri: appConfigService.getMongoUri(),
      }),
      inject: [AppConfigService],
    }),
  ],
  controllers: [],
  providers: [],
})
export class UserModule {}
