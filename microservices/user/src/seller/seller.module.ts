import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Seller, SellerSchema } from './seller.schema';
import { SellerService } from './seller.service';
import { BuyerService } from '../buyer/buyer.service';
import { Buyer, BuyerSchema } from '../buyer/buyer.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Seller.name, schema: SellerSchema },
      { name: Buyer.name, schema: BuyerSchema },
    ]),
  ],
  providers: [SellerService, BuyerService],
  controllers: [],
  exports: [MongooseModule],
})
export class SellerModule {}
