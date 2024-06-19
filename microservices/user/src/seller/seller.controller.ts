import {
  EVENTS_RMQ,
  ICreateOrderForSeller,
  IOrderMessage,
  IUpdateTotalGigsCount,
} from '@freedome/common';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { SellerService } from './seller.service';

@Controller()
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}
  @MessagePattern(EVENTS_RMQ.CREATE_ORDER)
  handleCreateOrder(data: ICreateOrderForSeller) {
    return this.sellerService.updateSellerOngoingJobsProp(data);
  }
  @MessagePattern(EVENTS_RMQ.APPROVE_ORDER)
  handleApproveOrder(data: IOrderMessage) {
    return this.sellerService.updateSellerCompletedJobsProp(data);
  }
  @MessagePattern(EVENTS_RMQ.CANCEL_ORDER)
  handleCancelOrder(sellerId: string) {
    return this.sellerService.updateSellerCancelledJobsProp(sellerId);
  }
  @MessagePattern(EVENTS_RMQ.UPDATE_GIG_COUNT)
  handleUpdateTotalGigsCount(data: IUpdateTotalGigsCount) {
    return this.sellerService.updateTotalGigsCount(data);
  }
}
