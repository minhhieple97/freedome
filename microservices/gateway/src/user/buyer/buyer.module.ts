import { Module } from '@nestjs/common';
import { BuyerController } from './buyer.controller';
import { BuyerService } from './buyer.service';

@Module({
  providers: [BuyerService],
  controllers: [BuyerController],
})
export class BuyerModule {}
