import { Module } from '@nestjs/common';
import { SellerService } from './seller.service';
import { BuyerService } from '../buyer/buyer.service';
import { SellerRepository } from './seller.repository';
import { SellerController } from './seller.controller';

@Module({
  imports: [],
  providers: [SellerService, BuyerService, SellerRepository],
  controllers: [SellerController],
  exports: [],
})
export class SellerModule {}
