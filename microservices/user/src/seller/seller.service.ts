import { Injectable } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
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
  ISellerDocument,
  dateToTimestamp,
} from '@freedome/common';
import * as grpc from '@grpc/grpc-js';
import { SellerDocument } from './seller.schema';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class SellerService {
  constructor(
    private readonly sellerRepository: SellerRepository,
    private readonly buyerService: BuyerService,
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

  async createSeller(sellerData: ISellerDocument) {
    const { email } = sellerData;
    const existingSeller = await this.sellerRepository.findByEmail(email);
    if (existingSeller) {
      throw new RpcException({
        code: grpc.status.ALREADY_EXISTS,
        message: 'Seller already exists',
      });
    }
    const createdSeller = (
      await this.sellerRepository.create(sellerData)
    ).toObject();
    await this.buyerService.updateBuyerIsSellerProp(createdSeller.email);
    return {
      ...createdSeller,
      createdAt: dateToTimestamp(createdSeller.createdAt),
      updatedAt: dateToTimestamp(createdSeller.updatedAt),
    };
  }

  async updateSeller(
    sellerId: string,
    sellerData: ISellerDocument,
  ): Promise<SellerDocument | null> {
    const { email } = sellerData;
    const existingSeller = await this.sellerRepository.findByEmail(email);
    if (!existingSeller) {
      throw new RpcException({
        code: grpc.status.NOT_FOUND,
        message: 'Seller not found',
      });
    }
    return this.sellerRepository.update(sellerId, sellerData);
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
  async updateSellerReview(data: IReviewMessageDetails): Promise<void> {
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
  }
}
