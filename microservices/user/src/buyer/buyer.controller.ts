import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { BuyerService } from './buyer.service';
import { Empty } from 'google-protobuf/google/protobuf/empty_pb';
import {
  BuyerData,
  GetUserBuyerResponse,
  GetUserBuyerWithEmailRequest,
  GetUserBuyerWithUsernameRequest,
  USER_SERVICE_NAME,
} from 'proto/types/user';
import { dateToTimestamp } from '@freedome/common';

@Controller()
export class BuyerController {
  constructor(private readonly buyerService: BuyerService) {}

  @GrpcMethod(USER_SERVICE_NAME, 'getUserBuyerWithEmail')
  async getUserBuyerWithEmail(
    data: GetUserBuyerWithEmailRequest,
  ): Promise<GetUserBuyerResponse> {
    const buyer = await this.buyerService.getBuyerByEmail(data.email);

    if (!buyer) {
      return { null: new Empty() };
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

    return { buyer: buyerData };
  }

  @GrpcMethod(USER_SERVICE_NAME, 'getUserBuyerWithUsername')
  async getUserBuyerWithUsername(
    data: GetUserBuyerWithUsernameRequest,
  ): Promise<GetUserBuyerResponse> {
    const buyer = await this.buyerService.getBuyerByUsername(data.username);

    if (!buyer) {
      return { null: new Empty() };
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

    return { buyer: buyerData };
  }
}
