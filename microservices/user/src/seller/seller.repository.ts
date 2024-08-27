import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Seller, SellerDocument } from './seller.schema';
import { ISellerDocument, User, UserDocument } from '@freedome/common';

@Injectable()
export class SellerRepository {
  constructor(
    @InjectModel(Seller.name)
    private readonly sellerModel: Model<SellerDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async findById(sellerId: string): Promise<ISellerDocument | null> {
    return (
      await this.sellerModel.findById(sellerId).exec()
    ).toJSON() as ISellerDocument;
  }

  async findByUsername(username: string): Promise<SellerDocument | null> {
    return this.sellerModel.findOne({ username }).exec();
  }
  async findOne(filter: FilterQuery<SellerDocument>): Promise<SellerDocument> {
    const seller = await this.sellerModel.findOne(filter).exec();
    return seller;
  }

  async findByEmail(email: string): Promise<SellerDocument | null> {
    return this.sellerModel.findOne({ email }).exec();
  }

  async findByUserId(userId: string): Promise<ISellerDocument | null> {
    const seller = await this.sellerModel
      .findOne({ user: userId })
      .populate('user')
      .exec();
    if (seller) return seller.toJSON() as ISellerDocument;
    return null;
  }

  async getRandomSellers(size: number): Promise<SellerDocument[]> {
    return this.sellerModel.aggregate([{ $sample: { size } }]);
  }

  async create(sellerData: Partial<SellerDocument>): Promise<SellerDocument> {
    return this.sellerModel.create(sellerData);
  }

  async update(
    sellerId: string,
    sellerData: Partial<ISellerDocument>,
  ): Promise<SellerDocument | null> {
    return this.sellerModel
      .findByIdAndUpdate(
        sellerId,
        {
          $set: {
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

  async updateTotalGigsCount(userId: number, count: number): Promise<void> {
    const user = (await this.userModel.findOne({ userId })).toJSON();
    await this.sellerModel
      .updateOne({ user: user.id }, { $inc: { totalGigs: count } })
      .exec();
  }

  async updateOngoingJobs(userId: number, ongoingJobs: number): Promise<void> {
    const user = (await this.userModel.findOne({ userId })).toJSON();
    await this.sellerModel
      .updateOne({ user: user.id }, { $inc: { ongoingJobs } })
      .exec();
  }

  async updateCancelledJobs(userId: number): Promise<void> {
    const user = (await this.userModel.findOne({ userId })).toJSON();
    await this.sellerModel
      .updateOne(
        { _id: user.id },
        { $inc: { ongoingJobs: -1, cancelledJobs: 1 } },
      )
      .exec();
  }

  async updateCompletedJobs(
    userSellerId: number,
    ongoingJobs: number,
    completedJobs: number,
    totalEarnings: number,
    recentDelivery: Date,
  ): Promise<void> {
    const user = (
      await this.userModel.findOne({ userId: userSellerId })
    ).toJSON();
    await this.sellerModel
      .updateOne(
        { user: user.id },
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
    userId: string,
    rating: number,
    ratingKey: string,
  ): Promise<void> {
    const user = (await this.userModel.findOne({ userId })).toJSON();
    await this.sellerModel
      .updateOne(
        { user: user.id },
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
