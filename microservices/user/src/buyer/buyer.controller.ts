import { Controller } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { BuyerService } from './buyer.service';
import {
  GetUserBuyerWithEmailRequest,
  GetUserBuyerWithUsernameRequest,
  USER_SERVICE_NAME,
} from 'proto/types/user';
import { dateToTimestamp } from '@freedome/common';
import * as grpc from '@grpc/grpc-js';
@Controller()
export class BuyerController {
  constructor(private readonly buyerService: BuyerService) {}

  @GrpcMethod(USER_SERVICE_NAME, 'getUserBuyerWithEmail')
  async getUserBuyerWithEmail(data: GetUserBuyerWithEmailRequest) {
    const buyer = await this.buyerService.getUserBuyerWithEmail(data.email);
    return buyer;
  }

  @GrpcMethod(USER_SERVICE_NAME, 'getUserBuyerWithUsername')
  async getUserBuyerWithUsername(data: GetUserBuyerWithUsernameRequest) {
    const buyer = await this.buyerService.getUserBuyerWithUsername(
      data.username,
    );
    if (!buyer) {
      throw new RpcException({
        code: grpc.status.NOT_FOUND,
        message: 'user_not_found',
      });
    }
    const buyerData = {
      ...buyer,
      createdAt: dateToTimestamp(buyer.createdAt),
      updatedAt: dateToTimestamp(buyer.updatedAt),
    };
    return buyerData;
  }
}
