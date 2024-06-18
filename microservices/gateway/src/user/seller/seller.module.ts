import { Controller, Get } from '@nestjs/common';
import { SellerService } from './seller.service';

@Controller('seller')
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}

  @Get()
  getSellers() {
    return this.sellerService.getSellers();
  }
}
