import { BuyerService } from './buyer.service';
import { Controller, Get } from '@nestjs/common';

@Controller('buyer')
export class BuyerController {
  constructor(private buyerService: BuyerService) {}
  @Get()
  getBuyers() {
    return this.buyerService.getBuyers();
  }
}
