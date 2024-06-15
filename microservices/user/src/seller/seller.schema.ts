import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {
  RatingCategory,
  RatingCategorySchema,
} from '../ratting-category/ratting-category.schema';
import { LanguageLevel } from '@freedome/common/enums';

export type SellerDocument = Seller & Document;
@Schema({ versionKey: false })
export class Seller {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true, index: true })
  username: string;

  @Prop({ required: true, index: true })
  email: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  profilePublicId: string;

  @Prop({ default: '' })
  oneliner: string;

  @Prop({ required: true })
  country: string;

  @Prop([
    {
      language: { type: String, required: true },
      level: {
        type: String,
        enum: Object.values(LanguageLevel),
        required: true,
      },
    },
  ])
  languages: { language: string; level: string }[];

  @Prop([{ type: String, required: true }])
  skills: string[];

  @Prop({ type: Number, default: 0 })
  ratingsCount: number;

  @Prop({ type: Number, default: 0 })
  ratingSum: number;

  @Prop({
    type: {
      five: { type: RatingCategorySchema },
      four: { type: RatingCategorySchema },
      three: { type: RatingCategorySchema },
      two: { type: RatingCategorySchema },
      one: { type: RatingCategorySchema },
    },
    _id: false,
  })
  ratingCategories: {
    five: RatingCategory;
    four: RatingCategory;
    three: RatingCategory;
    two: RatingCategory;
    one: RatingCategory;
  };
  @Prop({ type: Number, default: 0 })
  responseTime: number;

  @Prop({ type: Date, default: '' })
  recentDelivery: Date;

  @Prop([
    {
      company: { type: String, default: '' },
      title: { type: String, default: '' },
      startDate: { type: String, default: '' },
      endDate: { type: String, default: '' },
      description: { type: String, default: '' },
      currentlyWorkingHere: { type: Boolean, default: false },
    },
  ])
  experience: {
    company: string;
    title: string;
    startDate: string;
    endDate: string;
    description: string;
    currentlyWorkingHere: boolean;
  }[];

  @Prop([
    {
      country: { type: String, default: '' },
      university: { type: String, default: '' },
      title: { type: String, default: '' },
      major: { type: String, default: '' },
      year: { type: String, default: '' },
    },
  ])
  education: {
    country: string;
    university: string;
    title: string;
    major: string;
    year: string;
  }[];

  @Prop([{ type: String, default: '' }])
  socialLinks: string[];

  @Prop([
    {
      name: { type: String },
      from: { type: String },
      year: { type: Number },
    },
  ])
  certificates: {
    name: string;
    from: string;
    year: number;
  }[];

  @Prop({ type: Number, default: 0 })
  ongoingJobs: number;

  @Prop({ type: Number, default: 0 })
  completedJobs: number;

  @Prop({ type: Number, default: 0 })
  cancelledJobs: number;

  @Prop({ type: Number, default: 0 })
  totalEarnings: number;

  @Prop({ type: Number, default: 0 })
  totalGigs: number;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

export const SellerSchema = SchemaFactory.createForClass(Seller);
