import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ACCEPT_ALL_MESSAGE_FROM_TOPIC,
  EXCHANGE_NAME,
  IUpdateUser,
} from '@freedome/common';
import { User, UserDocument } from './user.schema';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  @RabbitSubscribe({
    exchange: EXCHANGE_NAME.UPDATE_USER,
    routingKey: ACCEPT_ALL_MESSAGE_FROM_TOPIC,
  })
  async update(userId: number, updateUserData: IUpdateUser) {
    const updatedUser = await this.userModel
      .findOneAndUpdate(
        { userId },
        { $set: updateUserData },
        { new: true, runValidators: true },
      )
      .exec();
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
  }
}
