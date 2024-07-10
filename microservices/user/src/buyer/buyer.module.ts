import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Buyer, BuyerSchema } from './buyer.schema';
import { BuyerService } from './buyer.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Buyer.name, schema: BuyerSchema }]),
  ],
  providers: [BuyerService],
  controllers: [],
  exports: [MongooseModule],
})
export class BuyerModule {}
