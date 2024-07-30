import { Module } from '@nestjs/common';
import { BuyerService } from './buyer.service';
import { BuyerController } from './buyer.controller';

@Module({
  imports: [],
  providers: [BuyerService],
  controllers: [BuyerController],
  exports: [],
})
export class BuyerModule {}
