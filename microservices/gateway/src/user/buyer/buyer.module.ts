import { Module } from '@nestjs/common';
import { BuyerController } from './buyer.controller';

@Module({
  controllers: [BuyerController],
})
export class BuyerModule {}
