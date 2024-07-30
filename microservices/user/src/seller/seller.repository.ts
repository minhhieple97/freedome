import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Seller, SellerDocument } from './seller.schema';
import { ISellerDocument } from '@freedome/common';

@Injectable()
export class SellerRepository {
  constructor(
    @InjectModel(Seller.name)
    private readonly sellerModel: Model<SellerDocument>,
  ) {}

  async findById(sellerId: string): Promise<SellerDocument | null> {
    return this.sellerModel.findById(sellerId).exec();
  }

  async findByUsername(username: string): Promise<SellerDocument | null> {
    return this.sellerModel.findOne({ username }).exec();
  }

  async findByEmail(email: string): Promise<SellerDocument | null> {
    return this.sellerModel.findOne({ email }).exec();
  }

  async getRandomSellers(size: number): Promise<SellerDocument[]> {
    return this.sellerModel.aggregate([{ $sample: { size } }]);
  }

  async create(sellerData: ISellerDocument): Promise<SellerDocument> {
    return this.sellerModel.create(sellerData);
  }

  async update(
    sellerId: string,
    sellerData: ISellerDocument,
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
        { new: true },
      )
      .exec();
  }

  async updateTotalGigsCount(sellerId: string, count: number): Promise<void> {
    await this.sellerModel
      .updateOne({ _id: sellerId }, { $inc: { totalGigs: count } })
      .exec();
  }

  async updateOngoingJobs(
    sellerId: string,
    ongoingJobs: number,
  ): Promise<void> {
    await this.sellerModel
      .updateOne({ _id: sellerId }, { $inc: { ongoingJobs } })
      .exec();
  }

  async updateCancelledJobs(sellerId: string): Promise<void> {
    await this.sellerModel
      .updateOne(
        { _id: sellerId },
        { $inc: { ongoingJobs: -1, cancelledJobs: 1 } },
      )
      .exec();
  }

  async updateCompletedJobs(
    sellerId: string,
    ongoingJobs: number,
    completedJobs: number,
    totalEarnings: number,
    recentDelivery: Date,
  ): Promise<void> {
    await this.sellerModel
      .updateOne(
        { _id: sellerId },
        {
          $inc: {
            ongoingJobs,
            completedJobs,
            totalEarnings,
          },
          $set: { recentDelivery },
        },
      )
      .exec();
  }

  async updateReview(
    sellerId: string,
    rating: number,
    ratingKey: string,
  ): Promise<void> {
    await this.sellerModel
      .updateOne(
        { _id: sellerId },
        {
          $inc: {
            ratingsCount: 1,
            ratingSum: rating,
            [`ratingCategories.${ratingKey}.value`]: rating,
            [`ratingCategories.${ratingKey}.count`]: 1,
          },
        },
      )
      .exec();
  }
}
