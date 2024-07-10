import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Seller, SellerDocument } from './seller.schema';
import { BuyerService } from '../buyer/buyer.service';
import {
  IOrderMessage,
  IRatingTypes,
  IReviewMessageDetails,
  ICreateOrderForSeller,
  IUpdateTotalGigsCount,
} from '@freedome/common';

@Injectable()
export class SellerService {
  constructor(
    @InjectModel(Seller.name)
    private readonly sellerModel: Model<SellerDocument>,
    private readonly buyerService: BuyerService, // Inject BuyerService
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
    await this.buyerService.updateBuyerIsSellerProp(createdSeller.email); // Use injected service
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

  async updateTotalGigsCount({
    sellerId,
    count,
  }: IUpdateTotalGigsCount): Promise<void> {
    await this.sellerModel
      .updateOne({ _id: sellerId }, { $inc: { totalGigs: count } })
      .exec();
  }

  async updateSellerOngoingJobsProp({
    sellerId,
    ongoingJobs,
  }: ICreateOrderForSeller): Promise<void> {
    await this.sellerModel
      .updateOne({ _id: sellerId }, { $inc: { ongoingJobs } })
      .exec();
  }

  async updateSellerCancelledJobsProp(sellerId: string): Promise<void> {
    await this.sellerModel
      .updateOne(
        { _id: sellerId },
        { $inc: { ongoingJobs: -1, cancelledJobs: 1 } },
      )
      .exec();
  }

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
}
