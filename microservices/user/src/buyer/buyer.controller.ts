import { Controller } from '@nestjs/common';
import { BuyerService } from './buyer.service';

@Controller('buyer')
export class BuyerController {
  constructor(private readonly buyerService: BuyerService) {}
}
