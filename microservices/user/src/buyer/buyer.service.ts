import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Buyer, BuyerDocument } from './buyer.schema';
import { User, UserDocument } from '../user/user.schema';
import { RpcException } from '@nestjs/microservices';
import * as grpc from '@grpc/grpc-js';
import { dateToTimestamp } from '@freedome/common';
@Injectable()
export class BuyerService {
  constructor(
    @InjectModel(Buyer.name) private readonly buyerModel: Model<BuyerDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async getUserBuyerWithEmail(email: string) {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new RpcException({
        code: grpc.status.NOT_FOUND,
        message: `User with email ${email} not found`,
      });
    }
    const buyer = (
      await this.buyerModel
        .findOne({ user: user._id })
        .populate({
          path: 'user',
          select: 'email username profilePublicId country -_id',
        })
        .exec()
    ).toObject();
    if (!buyer) {
      throw new RpcException({
        code: grpc.status.NOT_FOUND,
        message: `Buyer not found`,
      });
    }
    const buyerData = {
      ...buyer,
      id: buyer._id,
      purchasedGigs: buyer.purchasedGigs.map((gig) => gig.toString()),
      createdAt: dateToTimestamp(buyer.createdAt),
      updatedAt: dateToTimestamp(buyer.updatedAt),
    };
    return buyerData;
  }

  async getUserBuyerWithUsername(
    username: string,
  ): Promise<BuyerDocument | null> {
    const user = await this.userModel.findOne({ username }).exec();
    if (!user) {
      throw new RpcException({
        code: grpc.status.NOT_FOUND,
        message: `User with username ${username} not found`,
      });
    }
    const buyer = (
      await this.buyerModel
        .findOne({ userId: user._id })
        .populate('userId')
        .exec()
    ).toObject();

    if (!buyer) {
      throw new RpcException({
        code: grpc.status.NOT_FOUND,
        message: `Buyer with user ID ${user._id} not found`,
      });
    }
    return buyer;
  }

  async getRandomBuyers(count: number): Promise<BuyerDocument[]> {
    return this.buyerModel.aggregate([{ $sample: { size: count } }]);
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
