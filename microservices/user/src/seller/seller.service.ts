import { Injectable } from '@nestjs/common';
import { AmqpConnection, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { BuyerService } from '../buyer/buyer.service';
import { SellerRepository } from './seller.repository';
import {
  IOrderMessage,
  IReviewMessageDetails,
  ICreateOrderForSeller,
  IUpdateTotalGigsCount,
  EXCHANGE_NAME,
  ROUTING_KEY,
  IRatingTypes,
  dateToTimestamp,
  User,
  UserDocument,
} from '@freedome/common';
import * as grpc from '@grpc/grpc-js';
import { SellerDocument } from './seller.schema';
import { RpcException } from '@nestjs/microservices';
import { CreateSellerRequest, UpdateSellerRequest } from 'proto/types/user';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as _ from 'lodash';
@Injectable()
export class SellerService {
  constructor(
    private readonly sellerRepository: SellerRepository,
    private readonly buyerService: BuyerService,
    private readonly amqpConnection: AmqpConnection,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async getSellerById(sellerId: string) {
    const seller = await this.sellerRepository.findById(sellerId);
    if (!seller) {
      throw new RpcException({
        code: grpc.status.NOT_FOUND,
        message: 'Seller not found',
      });
    }
    const result = {
      ...seller,
      id: seller._id,
      createdAt: dateToTimestamp(seller.createdAt),
      updatedAt: dateToTimestamp(seller.updatedAt),
    };
    return result;
  }

  async getSellerByUsername(username: string): Promise<SellerDocument | null> {
    return this.sellerRepository.findByUsername(username);
  }

  async getSellerByEmail(email: string): Promise<SellerDocument | null> {
    return this.sellerRepository.findByEmail(email);
  }

  async getRandomSellers(size: number): Promise<SellerDocument[]> {
    return this.sellerRepository.getRandomSellers(size);
  }

  async createSeller(sellerData: CreateSellerRequest) {
    const { userId } = sellerData;
    const user = (await this.userModel.findOne({ userId })).toJSON();
    if (!user) {
      throw new RpcException({
        code: grpc.status.NOT_FOUND,
        message: `User not found`,
      });
    }
    const existingSeller = await this.sellerRepository.findByUserId(
      user._id.toString(),
    );
    if (existingSeller) {
      throw new RpcException({
        code: grpc.status.ALREADY_EXISTS,
        message: 'Seller already exists',
      });
    }
    const seller = {
      ..._.omit(sellerData, ['userId']),
      user: user._id.toString(),
    };
    (await this.sellerRepository.create(seller)).save();
    const createdSeller = await this.sellerRepository.findByUserId(
      user._id.toString(),
    );
    await this.buyerService.updateBuyerIsSellerProp(createdSeller.user.email);
    return {
      ...createdSeller,
      id: createdSeller._id.toString(),
      createdAt: dateToTimestamp(createdSeller.createdAt),
      updatedAt: dateToTimestamp(createdSeller.updatedAt),
    };
  }

  async updateSeller(
    sellerData: UpdateSellerRequest,
  ): Promise<SellerDocument | null> {
    const { userId, id } = sellerData;
    const user = (await this.userModel.findOne({ userId })).toObject();
    if (!user) {
      throw new RpcException({
        code: grpc.status.NOT_FOUND,
        message: `User not found`,
      });
    }
    const existingSeller = await this.sellerRepository.findOne({
      user: user._id,
      _id: id,
    });
    if (existingSeller) {
      throw new RpcException({
        code: grpc.status.ALREADY_EXISTS,
        message: 'Seller does not exists',
      });
    }
    const updateSeller = _.omit(sellerData, ['user']);
    return this.sellerRepository.update(id, updateSeller);
  }

  @RabbitSubscribe({
    exchange: EXCHANGE_NAME.USER_SELLER,
    routingKey: ROUTING_KEY.UPDATE_GIG_COUNT,
  })
  async updateTotalGigsCount({
    userId,
    count,
  }: IUpdateTotalGigsCount): Promise<void> {
    await this.sellerRepository.updateTotalGigsCount(userId, count);
  }

  @RabbitSubscribe({
    exchange: EXCHANGE_NAME.USER_SELLER,
    routingKey: ROUTING_KEY.CREATE_ORDER,
  })
  async updateSellerOngoingJobsProp({
    userId,
    ongoingJobs,
  }: ICreateOrderForSeller): Promise<void> {
    await this.sellerRepository.updateOngoingJobs(userId, ongoingJobs);
  }

  @RabbitSubscribe({
    exchange: EXCHANGE_NAME.USER_SELLER,
    routingKey: ROUTING_KEY.CANCEL_ORDER,
  })
  async updateSellerCancelledJobsProp(userId: number): Promise<void> {
    await this.sellerRepository.updateCancelledJobs(userId);
  }

  @RabbitSubscribe({
    exchange: EXCHANGE_NAME.USER_SELLER,
    routingKey: ROUTING_KEY.APPROVE_ORDER,
  })
  updateSellerCompletedJobsProp = async (
    data: IOrderMessage,
  ): Promise<void> => {
    const {
      userSellerId,
      ongoingJobs,
      completedJobs,
      totalEarnings,
      recentDelivery,
    } = data;
    await this.sellerRepository.updateCompletedJobs(
      userSellerId,
      ongoingJobs,
      completedJobs,
      totalEarnings,
      new Date(recentDelivery),
    );
  };

  @RabbitSubscribe({
    exchange: EXCHANGE_NAME.SELLER_REVIEW,
    routingKey: ROUTING_KEY.BUYER_REVIEW,
  })
  async updateSellerWhenBuyerReview(
    data: IReviewMessageDetails,
  ): Promise<void> {
    const ratingTypes: IRatingTypes = {
      '1': 'one',
      '2': 'two',
      '3': 'three',
      '4': 'four',
      '5': 'five',
    };
    const ratingKey: string = ratingTypes[`${data.rating}`];
    await this.sellerRepository.updateReview(
      data.sellerId,
      data.rating,
      ratingKey,
    );
    this.amqpConnection.publish(
      EXCHANGE_NAME.UPDATE_GIG,
      ROUTING_KEY.UPDATE_GIG_FROM_BUYER_REVIEW,
      data,
    );
  }
}
