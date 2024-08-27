import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Buyer, BuyerDocument } from './buyer.schema';
import {
  ACCEPT_ALL_MESSAGE_FROM_TOPIC,
  EXCHANGE_NAME,
  ICreateUser,
  User,
  UserDocument,
} from '@freedome/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
@Injectable()
export class BuyerConsumerService {
  constructor(
    @InjectModel(Buyer.name) private readonly buyerModel: Model<BuyerDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  @RabbitSubscribe({
    exchange: EXCHANGE_NAME.CREATE_USER,
    routingKey: ACCEPT_ALL_MESSAGE_FROM_TOPIC,
  })
  async createBuyer(user: ICreateUser): Promise<void> {
    const {
      username,
      email,
      profilePublicId,
      country,
      createdAt,
      userId,
      emailVerified,
      updatedAt,
    } = user;

    const newUser = {
      username,
      email,
      profilePublicId,
      userId,
      createdAt,
      country,
      emailVerified,
      updatedAt,
    };
    const createdUser = new this.userModel(newUser);
    const newUserData = await createdUser.save();
    const buyer = {
      purchasedGigs: [],
      createdAt,
      isSeller: false,
      user: newUserData._id,
    };
    await this.buyerModel.create(buyer);
  }
}
