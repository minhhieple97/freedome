import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Buyer, BuyerDocument } from './buyer.schema';

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

  async createBuyer(buyerData: BuyerDocument): Promise<void> {
    const checkIfBuyerExist = await this.getBuyerByEmail(buyerData.email);
    if (!checkIfBuyerExist) {
      await this.buyerModel.create(buyerData);
    }
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
