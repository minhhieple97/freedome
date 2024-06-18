import { SERVICE_NAME } from './../../../../common/src/constants/index';
import { Controller } from '@nestjs/common';
import { BuyerService } from './buyer.service';
import { MessagePattern } from '@nestjs/microservices';
import { EVENTS_RMQ, IAuthBuyerMessageDetails } from '@freedome/common';

@Controller()
export class BuyerController {
  constructor(private readonly buyerService: BuyerService) {}

  @MessagePattern(EVENTS_RMQ.USER_BUYER)
  handleCreateUserBuyer(data: IAuthBuyerMessageDetails) {
    if (data.type === SERVICE_NAME.AUTH) {
      return this.buyerService.createBuyer(data);
    }
  }
}
