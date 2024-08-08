import { Module } from '@nestjs/common';
import { BuyerService } from './buyer.service';
import { BuyerController } from './buyer.controller';
import { BuyerConsumerService } from './buyer-consumer.service';

@Module({
  imports: [],
  providers: [BuyerService, BuyerConsumerService],
  controllers: [BuyerController],
  exports: [],
})
export class BuyerModule {}
