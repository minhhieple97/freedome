import { Module } from '@nestjs/common';
import { BuyerService } from './buyer.service';

@Module({
  imports: [],
  providers: [BuyerService],
  controllers: [],
  exports: [],
})
export class BuyerModule {}
