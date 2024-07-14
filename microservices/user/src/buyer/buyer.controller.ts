import { Controller } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { BuyerService } from './buyer.service';
import {
  BuyerData,
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
  async getUserBuyerWithEmail(
    data: GetUserBuyerWithEmailRequest,
  ): Promise<BuyerData> {
    const buyer = await this.buyerService.getUserBuyerWithEmail(data.email);

    if (!buyer) {
      throw new RpcException({
        code: grpc.status.NOT_FOUND,
        message: 'user_not_found',
      });
    }
    console.log({ buyer });
    const buyerData: BuyerData = {
      id: buyer._id.toString(),
      username: buyer.username,
      email: buyer.email,
      profilePublicId: buyer.profilePublicId,
      country: buyer.country,
      isSeller: buyer.isSeller,
      purchasedGigs: buyer.purchasedGigs.map((el) => el.toString()),
      createdAt: dateToTimestamp(buyer.createdAt),
      updatedAt: dateToTimestamp(buyer.updatedAt),
    };

    return buyerData;
  }

  @GrpcMethod(USER_SERVICE_NAME, 'getUserBuyerWithUsername')
  async getUserBuyerWithUsername(
    data: GetUserBuyerWithUsernameRequest,
  ): Promise<BuyerData> {
    const buyer = await this.buyerService.getUserBuyerWithUsername(
      data.username,
    );
    console.log({ buyer });
    if (!buyer) {
      throw new RpcException({
        code: grpc.status.NOT_FOUND,
        message: 'user_not_found',
      });
    }

    const buyerData: BuyerData = {
      id: buyer._id.toString(),
      username: buyer.username,
      email: buyer.email,
      profilePublicId: buyer.profilePublicId,
      country: buyer.country,
      isSeller: buyer.isSeller,
      purchasedGigs: buyer.purchasedGigs.map((el) => el.toString()),
      createdAt: dateToTimestamp(buyer.createdAt),
      updatedAt: dateToTimestamp(buyer.updatedAt),
    };

    return buyerData;
  }
}
