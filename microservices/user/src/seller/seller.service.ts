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
  USER_SELLER_QUEUE_NAME,
  SELLER_REVIEW_QUEUE_NAME,
  IRatingTypes,
  dateToTimestamp,
} from '@freedome/common';
import * as grpc from '@grpc/grpc-js';
import { SellerDocument } from './seller.schema';
import { RpcException } from '@nestjs/microservices';
import { CreateSellerRequest, UpdateSellerRequest } from 'proto/types/user';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../user/user.schema';
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
    const seller = (await this.sellerRepository.findById(sellerId)).toObject();
    if (!seller) {
      throw new RpcException({
        code: grpc.status.NOT_FOUND,
        message: 'Seller not found',
      });
    }
    const result = {
      ...seller,
      id: seller._id.toString(),
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
    const user = (await this.userModel.findOne({ userId })).toObject();
    if (!user) {
      throw new RpcException({
        code: grpc.status.NOT_FOUND,
        message: `User not found`,
      });
    }
    const existingSeller = await this.sellerRepository.findByUserId(user._id);
    if (existingSeller) {
      throw new RpcException({
        code: grpc.status.ALREADY_EXISTS,
        message: 'Seller already exists',
      });
    }
    const seller = {
      ..._.omit(sellerData, ['userId']),
      user: user._id,
    } as any;
    const createdSeller = (
      await this.sellerRepository.create(seller)
    ).toObject();
    await this.buyerService.updateBuyerIsSellerProp(createdSeller.email);
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
    queue: USER_SELLER_QUEUE_NAME,
  })
  async updateTotalGigsCount({
    sellerId,
    count,
  }: IUpdateTotalGigsCount): Promise<void> {
    await this.sellerRepository.updateTotalGigsCount(sellerId, count);
  }

  @RabbitSubscribe({
    exchange: EXCHANGE_NAME.USER_SELLER,
    routingKey: ROUTING_KEY.CREATE_ORDER,
    queue: USER_SELLER_QUEUE_NAME,
  })
  async updateSellerOngoingJobsProp({
    sellerId,
    ongoingJobs,
  }: ICreateOrderForSeller): Promise<void> {
    await this.sellerRepository.updateOngoingJobs(sellerId, ongoingJobs);
  }

  @RabbitSubscribe({
    exchange: EXCHANGE_NAME.USER_SELLER,
    routingKey: ROUTING_KEY.CANCEL_ORDER,
    queue: USER_SELLER_QUEUE_NAME,
  })
  async updateSellerCancelledJobsProp(sellerId: string): Promise<void> {
    await this.sellerRepository.updateCancelledJobs(sellerId);
  }

  @RabbitSubscribe({
    exchange: EXCHANGE_NAME.USER_SELLER,
    routingKey: ROUTING_KEY.APPROVE_ORDER,
    queue: USER_SELLER_QUEUE_NAME,
  })
  updateSellerCompletedJobsProp = async (
    data: IOrderMessage,
  ): Promise<void> => {
    const {
      sellerId,
      ongoingJobs,
      completedJobs,
      totalEarnings,
      recentDelivery,
    } = data;
    await this.sellerRepository.updateCompletedJobs(
      sellerId,
      ongoingJobs,
      completedJobs,
      totalEarnings,
      new Date(recentDelivery),
    );
  };

  @RabbitSubscribe({
    exchange: EXCHANGE_NAME.SELLER_REVIEW,
    queue: SELLER_REVIEW_QUEUE_NAME,
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
