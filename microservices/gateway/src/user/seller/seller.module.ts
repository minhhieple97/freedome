import { Module } from '@nestjs/common';
import { SellerService } from './seller.service';
import { SellerControler } from './seller.controller';

@Module({
  controllers: [SellerControler],
  providers: [SellerService],
  imports: [],
})
export class SellerModule {}
