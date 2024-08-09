import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ACCEPT_ALL_MESSAGE_FROM_TOPIC,
  EXCHANGE_NAME,
  ICreateUser,
  IUpdateUser,
} from '@freedome/common';
import { User, UserDocument } from './user.schema';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Gig, GigDocument } from '../gig.schema';
import { SearchService } from '../search/search.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Gig.name)
    private readonly gigModel: Model<GigDocument>,
    private readonly searchService: SearchService,
  ) {}

  @RabbitSubscribe({
    exchange: EXCHANGE_NAME.CREATE_USER,
    routingKey: ACCEPT_ALL_MESSAGE_FROM_TOPIC,
  })
  async create(createUserData: ICreateUser) {
    const createdUser = new this.userModel(createUserData);
    await createdUser.save();
  }

  @RabbitSubscribe({
    exchange: EXCHANGE_NAME.UPDATE_USER,
    routingKey: ACCEPT_ALL_MESSAGE_FROM_TOPIC,
  })
  async update(userId: number, updateUserData: IUpdateUser): Promise<User> {
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
    const gigs = await this.gigModel.find({
      userId: updatedUser._id,
    });

    const updates = gigs.map((gig) => ({
      id: gig._id.toString(),
      doc: {
        ...gig.toObject(),
        user: {
          username: updatedUser.username,
          email: updatedUser.email,
        },
      },
    }));

    await this.searchService.bulkUpdate(updates);

    return updatedUser;
  }
}
