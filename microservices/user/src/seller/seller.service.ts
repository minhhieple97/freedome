import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Seller, SellerDocument } from './seller.schema';
import { BuyerService } from '../buyer/buyer.service';
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
  GIG_QUEUE,
} from '@freedome/common';
import { AmqpConnection, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class SellerService {
  constructor(
    @InjectModel(Seller.name)
    private readonly sellerModel: Model<SellerDocument>,
    private readonly buyerService: BuyerService,
    private readonly amqpConnection: AmqpConnection,
  ) {}

  async getSellerById(sellerId: string): Promise<SellerDocument | null> {
    return this.sellerModel.findById(sellerId).exec();
  }

  async getSellerByUsername(username: string): Promise<SellerDocument | null> {
    return this.sellerModel.findOne({ username }).exec();
  }

  async getSellerByEmail(email: string): Promise<SellerDocument | null> {
    return this.sellerModel.findOne({ email }).exec();
  }

  async getRandomSellers(size: number): Promise<SellerDocument[]> {
    return this.sellerModel.aggregate([{ $sample: { size } }]);
  }

  async createSeller(sellerData: SellerDocument): Promise<SellerDocument> {
    const createdSeller = await this.sellerModel.create(sellerData);
    await this.buyerService.updateBuyerIsSellerProp(createdSeller.email);
    return createdSeller;
  }

  async updateSeller(
    sellerId: string,
    sellerData: SellerDocument,
  ): Promise<SellerDocument | null> {
    return this.sellerModel
      .findByIdAndUpdate(
        sellerId,
        {
          $set: {
            profilePublicId: sellerData.profilePublicId,
            fullName: sellerData.fullName,
            description: sellerData.description,
            country: sellerData.country,
            skills: sellerData.skills,
            oneliner: sellerData.oneliner,
            languages: sellerData.languages,
            responseTime: sellerData.responseTime,
            experience: sellerData.experience,
            education: sellerData.education,
            socialLinks: sellerData.socialLinks,
            certificates: sellerData.certificates,
          },
        },
        { new: true }, // Return the updated document
      )
      .exec();
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
    await this.sellerModel
      .updateOne({ _id: sellerId }, { $inc: { totalGigs: count } })
      .exec();
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
    await this.sellerModel
      .updateOne({ _id: sellerId }, { $inc: { ongoingJobs } })
      .exec();
  }
  @RabbitSubscribe({
    exchange: EXCHANGE_NAME.USER_SELLER,
    routingKey: ROUTING_KEY.CANCEL_ORDER,
    queue: USER_SELLER_QUEUE_NAME,
  })
  async updateSellerCancelledJobsProp(sellerId: string): Promise<void> {
    await this.sellerModel
      .updateOne(
        { _id: sellerId },
        { $inc: { ongoingJobs: -1, cancelledJobs: 1 } },
      )
      .exec();
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
    await this.sellerModel
      .updateOne(
        { _id: sellerId },
        {
          $inc: {
            ongoingJobs,
            completedJobs,
            totalEarnings,
          },
          $set: { recentDelivery: new Date(recentDelivery) },
        },
      )
      .exec();
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
    await this.sellerModel
      .updateOne(
        { _id: data.sellerId },
        {
          $inc: {
            ratingsCount: 1,
            ratingSum: data.rating,
            [`ratingCategories.${ratingKey}.value`]: data.rating,
            [`ratingCategories.${ratingKey}.count`]: 1,
          },
        },
      )
      .exec();
  }

  @RabbitSubscribe({
    exchange: EXCHANGE_NAME.GIG,
    queue: GIG_QUEUE,
    routingKey: ROUTING_KEY.GET_SELLERS,
  })
  async seedRandomSeller(data): Promise<void> {}
}
