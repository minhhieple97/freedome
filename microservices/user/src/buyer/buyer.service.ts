import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Buyer, BuyerDocument } from './buyer.schema';
import {
  EXCHANGE_NAME,
  IAuthBuyerMessageDetails,
  IBuyerDocument,
  ROUTING_KEY,
  USER_BUYER_QUEUE_NAME,
} from '@freedome/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class BuyerService {
  constructor(
    @InjectModel(Buyer.name) private readonly buyerModel: Model<BuyerDocument>,
  ) {}

  async getBuyerByEmail(email: string): Promise<BuyerDocument | null> {
    return this.buyerModel.findOne({ email }).exec();
  }

  async getBuyerByUsername(username: string): Promise<BuyerDocument | null> {
    return this.buyerModel.findOne({ username }).exec();
  }

  async getRandomBuyers(count: number): Promise<BuyerDocument[]> {
    return this.buyerModel.aggregate([{ $sample: { size: count } }]);
  }
  @RabbitSubscribe({
    exchange: EXCHANGE_NAME.USER_BUYER,
    routingKey: ROUTING_KEY.CREATE_USER_BUYER,
    queue: USER_BUYER_QUEUE_NAME,
  })
  async createBuyer(buyerData: IAuthBuyerMessageDetails): Promise<void> {
    const { username, email, profilePublicId, country, createdAt } = buyerData;
    const buyer: IBuyerDocument = {
      username,
      email,
      profilePublicId,
      country,
      purchasedGigs: [],
      createdAt,
    };
    await this.buyerModel.create(buyer);
  }

  async updateBuyerIsSellerProp(email: string): Promise<void> {
    await this.buyerModel
      .updateOne(
        { email },
        {
          $set: {
            isSeller: true,
          },
        },
      )
      .exec();
  }

  async updateBuyerPurchasedGigsProp(
    buyerId: string,
    purchasedGigId: string,
    type: string,
  ): Promise<void> {
    const updateOperation =
      type === 'purchased-gigs'
        ? { $push: { purchasedGigs: purchasedGigId } }
        : { $pull: { purchasedGigs: purchasedGigId } };

    await this.buyerModel.updateOne({ _id: buyerId }, updateOperation).exec();
  }
}
