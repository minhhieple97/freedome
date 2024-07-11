import { Module } from '@nestjs/common';
import { SellerService } from './seller.service';
import { BuyerService } from '../buyer/buyer.service';

@Module({
  imports: [],
  providers: [SellerService, BuyerService],
  controllers: [],
  exports: [],
})
export class SellerModule {}
