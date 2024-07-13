import { Module } from '@nestjs/common';
import { AppConfigModule } from '@gateway/config/app/config.module';
import { BuyerModule } from './buyer/buyer.module';
import { SellerModule } from './seller/seller.module';

@Module({
  imports: [AppConfigModule, BuyerModule, SellerModule],
  providers: [],
  controllers: [],
})
export class UserModule {}
